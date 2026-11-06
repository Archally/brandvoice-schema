import { describe, it, expect } from 'vitest';
import { extractEntities, extractRelations } from './extractor.js';

const MINIMAL_MODEL = {
  name: 'Test Brand',
  market: {
    landscape: {
      markets: [
        { id: 'MKT001', name: 'Test Market', evidence_refs: ['EVD001'] },
      ],
      forces: [
        { id: 'MFR001', name: 'Force One', affected_needs: ['NED001'], evidence_refs: ['EVD001'] },
      ],
    },
    competition: {
      competitors: [
        { id: 'CPR001', name: 'Rival Corp', type: 'direct', threat_level: 'high' },
      ],
    },
  },
  strategy: {
    brand_core: {
      brands: [{ id: 'BRD001', name: 'Test Brand', purpose: 'test', promise: 'test' }],
    },
    market_product: {
      actors: [{ id: 'ACT001', name: 'User', role: 'buyer' }],
      needs: [
        { id: 'NED001', statement: 'I need X', actors: ['ACT001'], evidence_refs: ['EVD001'] },
      ],
      offerings: [
        { id: 'OFF001', name: 'Product', solves_needs: ['NED001'] },
      ],
      positioning: [
        { id: 'POS001', market_category: 'Test', differentiated_claim: 'Best', competitors: ['CPR001'], evidence_refs: ['EVD001'] },
      ],
    },
    messaging: {
      messages: [
        { id: 'MSG001', title: 'Core Message', core_statement: 'We are the best', evidence_refs: ['EVD001'] },
      ],
    },
  },
  activation: {
    channels: {
      channels: [
        { id: 'CHN001', name: 'LinkedIn', media_type: 'owned', objective: 'awareness' },
      ],
    },
  },
  governance: {
    evidence: {
      evidence: [
        { id: 'EVD001', title: 'Market research', type: 'secondary-research', date: '2025-01-01', summary: 'Findings', supports: ['MKT001', 'MFR001'] },
      ],
    },
    decisions: {
      decisions: [
        { id: 'DEC001', title: 'Pricing', status: 'accepted', rationale: { problem: 'p', alternatives: ['a'], selected: 's', why: 'w' } },
      ],
    },
  },
};

describe('extractEntities', () => {
  const entities = extractEntities(MINIMAL_MODEL);

  it('extracts all entities by ID', () => {
    const ids = entities.map(e => e.id).sort();
    expect(ids).toEqual([
      'ACT001', 'BRD001', 'CHN001', 'CPR001', 'DEC001',
      'EVD001', 'MFR001', 'MKT001', 'MSG001', 'NED001',
      'OFF001', 'POS001',
    ]);
  });

  it('resolves entity types from ID prefix', () => {
    const market = entities.find(e => e.id === 'MKT001')!;
    expect(market.type).toBe('market');
    expect(market.plane).toBe('market');

    const evidence = entities.find(e => e.id === 'EVD001')!;
    expect(evidence.type).toBe('evidence');
    expect(evidence.plane).toBe('governance');
  });

  it('resolves name from various fields', () => {
    const market = entities.find(e => e.id === 'MKT001')!;
    expect(market.name).toBe('Test Market');

    const need = entities.find(e => e.id === 'NED001')!;
    expect(need.name).toBe('I need X');

    const message = entities.find(e => e.id === 'MSG001')!;
    expect(message.name).toBe('Core Message');
  });

  it('preserves full data on each entity', () => {
    const competitor = entities.find(e => e.id === 'CPR001')!;
    expect(competitor.data.threat_level).toBe('high');
    expect(competitor.data.type).toBe('direct');
  });

  it('deduplicates by ID', () => {
    const dupeModel = {
      market: {
        landscape: { markets: [{ id: 'MKT001', name: 'First' }] },
        competition: { competitors: [{ id: 'MKT001', name: 'Dupe' }] },
      },
    };
    const entities = extractEntities(dupeModel);
    const mkts = entities.filter(e => e.id === 'MKT001');
    expect(mkts).toHaveLength(1);
    expect(mkts[0].name).toBe('First');
  });
});

describe('extractRelations', () => {
  const entities = extractEntities(MINIMAL_MODEL);
  const relations = extractRelations(entities);

  it('derives backed-by from evidence_refs', () => {
    const backedBy = relations.filter(r => r.type === 'backed-by');
    expect(backedBy.length).toBeGreaterThan(0);
    const mktToEvd = backedBy.find(r => r.source === 'MKT001' && r.target === 'EVD001');
    expect(mktToEvd).toBeDefined();
    expect(mktToEvd!.predicate).toBe('evidence_refs');
  });

  it('derives supports from evidence supports[]', () => {
    const supports = relations.filter(r => r.type === 'supports');
    expect(supports.length).toBe(2);
    expect(supports.map(r => r.target).sort()).toEqual(['MFR001', 'MKT001']);
  });

  it('derives affects-need from affected_needs', () => {
    const affects = relations.find(r => r.type === 'affects-need');
    expect(affects).toBeDefined();
    expect(affects!.source).toBe('MFR001');
    expect(affects!.target).toBe('NED001');
  });

  it('derives experienced-by from need actors[]', () => {
    const targets = relations.find(r => r.type === 'experienced-by' && r.source === 'NED001');
    expect(targets).toBeDefined();
    expect(targets!.target).toBe('ACT001');
  });

  it('derives solves-need from solves_needs', () => {
    const solves = relations.find(r => r.type === 'solves-need');
    expect(solves).toBeDefined();
    expect(solves!.source).toBe('OFF001');
    expect(solves!.target).toBe('NED001');
  });

  it('derives competes-against from competitors[]', () => {
    const competes = relations.find(r => r.type === 'competes-against');
    expect(competes).toBeDefined();
    expect(competes!.source).toBe('POS001');
    expect(competes!.target).toBe('CPR001');
  });

  it.each([
    ['offerings', 'OFF001'],
    ['positioning', 'POS001'],
  ])('derives targets-audience and preserves competes-against for %s', (collection, source) => {
    const model = {
      strategy: {
        market_product: {
          [collection]: [{ id: source, target_audiences: ['AUD001'], competitors: ['CPR001'] }],
          audiences: [{ id: 'AUD001', name: 'Audience' }],
        },
      },
      market: {
        competition: { competitors: [{ id: 'CPR001', name: 'Rival' }] },
      },
    };
    const relations = extractRelations(extractEntities(model));
    expect(relations.map(({ source, target, type, predicate }) => ({ source, target, type, predicate })))
      .toEqual([
        { source, target: 'CPR001', type: 'competes-against', predicate: 'competitors' },
        { source, target: 'AUD001', type: 'targets-audience', predicate: 'target_audiences' },
      ]);
  });

  it('retains refs to non-existent entities', () => {
    const model = {
      governance: {
        evidence: {
          evidence: [
            { id: 'EVD001', title: 'Test', type: 'survey', date: '2025-01-01', summary: 'x', supports: ['MISSING001'] },
          ],
        },
      },
    };
    const entities = extractEntities(model);
    const relations = extractRelations(entities);
    expect(relations).toHaveLength(1);
    expect(relations[0].target).toBe('MISSING001');
  });

  it('generates unique relation IDs', () => {
    const ids = relations.map(r => r.id);
    expect(new Set(ids).size).toBe(ids.length);
    expect(ids[0]).toMatch(/^REL\d{4}$/);
  });
});

describe('scoped IDs', () => {
  it('extracts entities with scoped IDs', () => {
    const model = {
      market: {
        competition: {
          competitors: [
            { id: 'market.CPR001', name: 'Scoped Rival' },
            { id: 'strategy.CPR001', name: 'Strategy Rival' },
          ],
        },
      },
    };
    const entities = extractEntities(model);
    expect(entities).toHaveLength(2);
    expect(entities[0].type).toBe('competitor');
    expect(entities[1].type).toBe('competitor');
  });

  it('resolves scoped refs in relations', () => {
    const model = {
      strategy: {
        market_product: {
          positioning: [
            { id: 'strategy.POS001', market_category: 'x', differentiated_claim: 'y', competitors: ['market.CPR001'] },
          ],
        },
      },
      market: {
        competition: {
          competitors: [{ id: 'market.CPR001', name: 'Rival' }],
        },
      },
    };
    const entities = extractEntities(model);
    const relations = extractRelations(entities);
    const competes = relations.find(r => r.type === 'competes-against');
    expect(competes).toBeDefined();
    expect(competes!.source).toBe('strategy.POS001');
    expect(competes!.target).toBe('market.CPR001');
  });
});
