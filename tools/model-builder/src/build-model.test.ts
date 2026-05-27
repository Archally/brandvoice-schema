import { describe, it, expect } from 'vitest';
import { buildBrandvoiceModel } from './build-model.js';

const SAMPLE_MODEL = {
  name: 'Acme Brand',
  version: '1.0.0',
  schemaVersion: '1.6.1',
  market: {
    landscape: {
      markets: [
        { id: 'MKT001', name: 'Primary Market', evidence_refs: ['EVD001'] },
      ],
      forces: [
        { id: 'MFR001', name: 'Tech Force', force_type: 'technological', evidence_refs: ['EVD001'] },
        { id: 'MFR002', name: 'Economic Force', force_type: 'economic', evidence_refs: ['EVD002'] },
      ],
    },
    competition: {
      competitors: [
        { id: 'CPR001', name: 'Rival', type: 'direct' },
      ],
    },
  },
  strategy: {
    brand_core: {
      brands: [{ id: 'BRD001', name: 'Acme', purpose: 'test', promise: 'test' }],
    },
    market_product: {
      actors: [{ id: 'ACT001', name: 'Buyer', role: 'buyer', evidence_refs: ['EVD001'] }],
      needs: [{ id: 'NED001', statement: 'Need X', actors: ['ACT001'] }],
    },
  },
  governance: {
    evidence: {
      evidence: [
        { id: 'EVD001', title: 'Research A', type: 'survey', date: '2025-01-01', summary: 'a', supports: ['MKT001'] },
        { id: 'EVD002', title: 'Research B', type: 'survey', date: '2025-02-01', summary: 'b' },
      ],
    },
  },
};

describe('buildBrandvoiceModel', () => {
  const model = buildBrandvoiceModel(SAMPLE_MODEL);

  it('produces entities and relations', () => {
    expect(model.entities.length).toBeGreaterThan(0);
    expect(model.relations.length).toBeGreaterThan(0);
  });

  it('populates metadata', () => {
    expect(model.metadata.name).toBe('Acme Brand');
    expect(model.metadata.version).toBe('1.0.0');
    expect(model.metadata.schemaVersion).toBe('1.6.1');
    expect(model.metadata.totalEntities).toBe(model.entities.length);
    expect(model.metadata.totalRelations).toBe(model.relations.length);
    expect(model.metadata.builtAt).toBeTruthy();
  });

  it('counts entity types correctly', () => {
    expect(model.metadata.entityTypeCounts.market).toBe(1);
    expect(model.metadata.entityTypeCounts.market_force).toBe(2);
    expect(model.metadata.entityTypeCounts.competitor).toBe(1);
    expect(model.metadata.entityTypeCounts.brand).toBe(1);
    expect(model.metadata.entityTypeCounts.evidence).toBe(2);
  });

  it('counts planes correctly', () => {
    expect(model.metadata.planeCounts.market).toBe(4);
    expect(model.metadata.planeCounts.strategy).toBe(3);
    expect(model.metadata.planeCounts.governance).toBe(2);
  });

  it('counts relation types', () => {
    expect(model.metadata.relationTypeCounts['backed-by']).toBeGreaterThan(0);
  });

  it('handles empty model gracefully', () => {
    const empty = buildBrandvoiceModel({ name: 'Empty' });
    expect(empty.entities).toHaveLength(0);
    expect(empty.relations).toHaveLength(0);
    expect(empty.metadata.totalEntities).toBe(0);
  });
});
