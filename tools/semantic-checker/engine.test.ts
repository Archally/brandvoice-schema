import { describe, it, expect, beforeAll } from 'vitest';
import { fileURLToPath } from 'node:url';
import { loadRules, runChecker } from '@archally/semantic-checker';
import type { RuleDefinition } from '@archally/semantic-checker';
import { buildBrandvoiceModel } from '@archally/brandvoice-schema/model';
import { toCheckableModel } from './adapter.js';

// Verifies the wrapper routes correctly to the shared engine: severity config handling, and that
// the adapter produces a well-formed CheckableModel (identity, structure, lifted relations).

let evidenceCoverage: RuleDefinition;

beforeAll(async () => {
  const rules = await loadRules(fileURLToPath(new URL('./rules', import.meta.url)));
  evidenceCoverage = rules.find(rule => rule.id === 'evidence-coverage')!;
});

const FLAGGED = { market: { landscape: { markets: [{ id: 'MKT001', name: 'Test' }] } } };

function model(raw: Record<string, unknown>) {
  return toCheckableModel(buildBrandvoiceModel(raw));
}

describe('shared-engine routing', () => {
  it('runs a loaded rule and emits a well-formed issue', () => {
    const issues = runChecker(model(FLAGGED), [evidenceCoverage]);
    expect(issues).toEqual([
      { ruleId: 'evidence-coverage', severity: 'warn', message: 'MKT001 (Test) has no evidence linkage.', entityId: 'MKT001' },
    ]);
  });

  it('applies config severity override (warn → error)', () => {
    const issues = runChecker(model(FLAGGED), [evidenceCoverage], { rules: { 'evidence-coverage': 'error' } });
    expect(issues[0].severity).toBe('error');
  });

  it('skips rules set to off', () => {
    expect(runChecker(model(FLAGGED), [evidenceCoverage], { rules: { 'evidence-coverage': 'off' } })).toHaveLength(0);
  });

  it('supports object-style config', () => {
    const issues = runChecker(model(FLAGGED), [evidenceCoverage], { rules: { 'evidence-coverage': { severity: 'info' } } });
    expect(issues[0].severity).toBe('info');
  });
});

describe('adapter', () => {
  it('maps BrandvoiceModel → CheckableModel (schema, four planes, displayId == id, root-scoped)', () => {
    const checkable = model(FLAGGED);
    expect(checkable.schema).toBe('brandvoice');
    expect(checkable.structure.planes.map(p => p.id)).toEqual(['market', 'strategy', 'activation', 'governance']);
    const entity = checkable.entities.find(e => e.id === 'MKT001')!;
    expect(entity.displayId).toBe('MKT001');
    expect(entity.type).toBe('market');
    expect(entity.slices).toEqual([]);
  });

  it('lifts evidence_refs to a backed-by relation when the target exists', () => {
    const checkable = model({
      market: { landscape: { markets: [{ id: 'MKT001', evidence_refs: ['EVD001'] }] } },
      governance: { evidence: { evidence: [{ id: 'EVD001', title: 'Source' }] } },
    });
    expect(checkable.relations).toContainEqual(
      expect.objectContaining({ source: 'MKT001', target: 'EVD001', type: 'backed-by' }),
    );
  });
});
