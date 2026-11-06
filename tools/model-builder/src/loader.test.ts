import { afterAll, describe, it, expect } from 'vitest';
import { mkdtempSync, mkdirSync, writeFileSync, rmSync } from 'node:fs';
import { tmpdir } from 'node:os';
import path from 'node:path';
import { loadBrandvoice } from './loader.js';
import { buildBrandvoiceModel } from './build-model.js';

const fixtureDirectory = mkdtempSync(path.join(tmpdir(), 'brandvoice-loader-'));
writeFileSync(path.join(fixtureDirectory, 'brandvoice.yaml'), `
name: Synthetic brand
market:
  landscape: { $ref: landscape.yaml }
strategy: {}
activation: {}
governance: {}
`);
writeFileSync(path.join(fixtureDirectory, 'landscape.yaml'), `
markets: [{ id: MKT001, name: Market }]
forces: [{ id: MFR001, name: Force }]
`);
afterAll(() => rmSync(fixtureDirectory, { recursive: true, force: true }));

describe('loadBrandvoice', () => {
  it('loads a model directory without errors', () => {
    const result = loadBrandvoice(fixtureDirectory);
    expect(result.errors).toEqual([]);
    expect(result.root.name).toBe('Synthetic brand');
    for (const plane of ['market', 'strategy', 'activation', 'governance']) {
      expect(result.root[plane]).toBeDefined();
    }
  });

  it('loads a root file without errors', () => {
    const result = loadBrandvoice(path.join(fixtureDirectory, 'brandvoice.yaml'));
    expect(result.errors).toEqual([]);
    expect(result.root.name).toBe('Synthetic brand');
  });

  it('composes reference files into planes', () => {
    const result = loadBrandvoice(fixtureDirectory);
    const market = result.root.market as Record<string, unknown>;
    expect(market.markets).toEqual([{ id: 'MKT001', name: 'Market' }]);
    expect(market.forces).toEqual([{ id: 'MFR001', name: 'Force' }]);
  });

  it('tracks composed files', () => {
    const result = loadBrandvoice(fixtureDirectory);
    expect(result.files).toEqual({
      root: path.join(fixtureDirectory, 'brandvoice.yaml'),
      'landscape.yaml': path.join(fixtureDirectory, 'landscape.yaml'),
    });
  });
});


describe('plane document correspondence', () => {
  function fixture(documents: Record<string, unknown>): string {
    const directory = mkdtempSync(path.join(fixtureDirectory, 'planes-'));
    for (const [fileName, content] of Object.entries(documents)) {
      const filePath = path.join(directory, fileName);
      mkdirSync(path.dirname(filePath), { recursive: true });
      writeFileSync(filePath, typeof content === 'string' ? content : JSON.stringify(content));
    }
    return directory;
  }

  it('retains evidence from supplementary topic shards before and after evidence.yaml', () => {
    const directory = fixture({
      'brandvoice.yaml': { name: 'Supplementary evidence', governance: {} },
      'governance/core-product.evidence.yaml': { evidence: [{ id: 'EVD001' }] },
      'governance/evidence.yaml': { evidence: [{ id: 'source.EVD002' }] },
      'governance/product.evidence.yml': { evidence: [{ id: 'EVD003' }] },
    });
    const composed = loadBrandvoice(directory);
    expect(composed.root.governance).toEqual({
      evidence: [{ id: 'EVD001' }, { id: 'source.EVD002' }, { id: 'EVD003' }],
    });
    expect(buildBrandvoiceModel(composed.root).entities.map(entity => entity.id).sort())
      .toEqual(['EVD001', 'EVD003', 'source.EVD002']);
  });

  it('merges inline slices first, then all direct YAML children in sorted order', () => {
    const directory = fixture({
      'brandvoice.yaml': {
        governance: { evidence: { evidence: [{ id: 'EVD001' }], version: 'inline' } },
      },
      'governance/zeta.yaml': { evidence: [{ id: 'EVD004' }], label: 'last' },
      'governance/evidence.yaml': { evidence: [{ id: 'EVD003' }] },
      'governance/arbitrary.yml': '\ufeffevidence: [{ id: EVD002 }]\nlabel: first\n',
      'governance/nested/ignored.yaml': { evidence: [{ id: 'EVD999' }] },
      'unknown/ignored.yaml': { evidence: [{ id: 'EVD998' }] },
      'ignored.yaml': { evidence: [{ id: 'EVD997' }] },
      'governance/ignored.txt': 'evidence: [{ id: EVD996 }]',
    });
    const composed = loadBrandvoice(directory);
    expect(composed.root.governance).toEqual({
      evidence: [{ id: 'EVD001' }, { id: 'EVD002' }, { id: 'EVD003' }, { id: 'EVD004' }],
      label: 'last',
    });
    expect(Object.keys(composed.files).sort()).toEqual([
      'governance/arbitrary.yml', 'governance/evidence.yaml', 'governance/zeta.yaml', 'root',
    ]);
  });

  it('loads referenced plane documents once in disk order rather than root reference order', () => {
    const directory = fixture({
      'brandvoice.yaml': { governance: {
        later: { $ref: 'governance/zeta.yaml' },
        earlier: { $ref: 'governance/alpha.yaml' },
      } },
      'governance/zeta.yaml': { evidence: [{ id: 'EVD002' }] },
      'governance/alpha.yaml': { evidence: [{ id: 'EVD001' }] },
    });
    expect(loadBrandvoice(directory).root.governance).toEqual({
      $ref: 'governance/alpha.yaml',
      evidence: [{ id: 'EVD001' }, { id: 'EVD002' }],
    });
  });

  it('routes every direct YAML child by its plane directory regardless of filename', () => {
    const directory = fixture({
      'brandvoice.yaml': {},
      'market/custom.yaml': { markets: [{ id: 'MKT001' }] },
      'strategy/custom.yml': { actors: [{ id: 'ACT001' }] },
      'activation/custom.yaml': { campaigns: [{ id: 'CAM001' }] },
      'governance/custom.yaml': { evidence: [{ id: 'EVD001' }] },
    });
    const composed = loadBrandvoice(directory);
    expect(composed.root.market).toEqual({ markets: [{ id: 'MKT001' }] });
    expect(composed.root.strategy).toEqual({ actors: [{ id: 'ACT001' }] });
    expect(composed.root.activation).toEqual({ campaigns: [{ id: 'CAM001' }] });
    expect(composed.root.governance).toEqual({ evidence: [{ id: 'EVD001' }] });
  });

  it('warns for non-object supplementary documents and rejects malformed YAML', () => {
    const directory = fixture({
      'brandvoice.yaml': {},
      'governance/empty.yaml': '',
      'governance/list.yaml': '- example',
      'governance/scalar.yaml': 'example',
    });
    const composed = loadBrandvoice(directory);
    expect(composed.supplementaryWarnings).toHaveLength(3);
    writeFileSync(path.join(directory, 'governance/broken.yaml'), 'evidence: [');
    expect(() => loadBrandvoice(directory)).toThrow();
  });
});
