import { describe, it, expect } from 'vitest';
import { extractEntities, extractRelations } from './extractor.js';

const MODEL_WITH_REPLACEMENTS = {
  strategy: {
    market_product: {
      offerings: [
        { id: 'OFF001', name: 'Legacy plan', status: 'sunset', superseded_by: ['OFF002'] },
        { id: 'OFF002', name: 'Current plan', status: 'active' },
      ],
    },
  },
  governance: {
    evidence: {
      evidence: [
        { id: 'EVD001', title: 'Older survey', superseded_by: ['EVD002'] },
        { id: 'EVD002', title: 'Newer survey' },
      ],
    },
  },
};

describe('superseded_by relations', () => {
  const entities = extractEntities(MODEL_WITH_REPLACEMENTS);
  const relations = extractRelations(entities);

  it('extracts an offering replaced by another offering as a superseded-by edge', () => {
    const edge = relations.find(relation => relation.source === 'OFF001' && relation.target === 'OFF002');
    expect(edge?.type).toBe('superseded-by');
    expect(edge?.predicate).toBe('superseded_by');
  });

  it('extracts an evidence record replaced by newer evidence as a superseded-by edge', () => {
    const edge = relations.find(relation => relation.source === 'EVD001' && relation.target === 'EVD002');
    expect(edge?.type).toBe('superseded-by');
  });

  it('does not read an offering status as a reference', () => {
    expect(relations.filter(relation => relation.predicate === 'status')).toHaveLength(0);
  });
});
