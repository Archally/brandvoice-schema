import { describe, expect, it } from 'vitest';
import { buildBrandvoiceModel } from './build-model.js';
import { extractRelations, extractEntities, deriveBuilderRelations } from './extractor.js';
import { EXPECTED_RELATIONS, NESTED_CASES } from './relation-expectations.js';

describe('relation contract', () => {
  it.each(NESTED_CASES)('preserves $name', ({ entity, expected }) => {
    const model = buildBrandvoiceModel({ entities: [entity] });
    expect(model.relations.map(relation => [relation.target, relation.type, relation.predicate]).sort()).toEqual([...expected].sort());
    const result = deriveBuilderRelations(extractEntities({ entities: [entity] }));
    expect(result.placeholders).toHaveLength(new Set(expected.map(([target]) => target)).size);
  });

  it.each(EXPECTED_RELATIONS)('%s.%s retains the contract name %s', (entityType, field, relationType) => {
    const singularFields = new Set(['actor', 'audience', 'offering', 'need', 'stage', 'channel', 'primary_message', 'journey_stage', 'action', 'metric', 'north_star', 'decision_outcome']);
    const value = field.endsWith('_ref') || singularFields.has(field) ? 'EVD001' : ['EVD001'];
    const relations = extractRelations([
      { id: 'OFF001', type: entityType, plane: 'strategy', name: 'Source', data: { id: 'OFF001', [field]: value } },
      { id: 'EVD001', type: 'evidence', plane: 'governance', name: 'Target', data: { id: 'EVD001' } },
    ]);
    const expected = entityType === 'evidence' && ['related_experiments', 'related_decisions'].includes(field)
      ? []
      : [['OFF001', 'EVD001', relationType, field]];
    expect(relations.map(({ source, target, type, predicate }) => [source, target, type, predicate])).toEqual(expected);
  });

  it('merges depth and references from shards sharing an ID without overwriting conflicts', () => {
    const firstShard = { id: 'CPR001', name: 'First', strengths: ['Fast'] };
    const secondShard = { id: 'CPR001', name: 'Second', weaknesses: ['Slow'], pricing: { model: 'flat' }, evidence_refs: ['EVD001'] };
    const model = buildBrandvoiceModel({ strategy: { competitors: [secondShard] }, market: { competitors: [firstShard] } });
    expect(model.entities.filter(entity => entity.id === 'CPR001')).toHaveLength(1);
    expect(model.entities.find(entity => entity.id === 'CPR001')?.data).toEqual({ ...secondShard, ...firstShard });
    expect(model.relations.map(({ source, target, type, predicate }) => [source, target, type, predicate])).toEqual([
      ['CPR001', 'EVD001', 'backed-by', 'evidence_refs'],
    ]);
    expect(firstShard).toEqual({ id: 'CPR001', name: 'First', strengths: ['Fast'] });
  });

  it('attributes child references only to the child and retains unresolved fallback edges', () => {
    const model = buildBrandvoiceModel({ message_houses: [{ id: 'MHS001', pillars: [{ id: 'MPL001', custom_refs: ['NED999', 'NED999'] }] }] });
    expect(model.relations.map(({ source, target, type, predicate }) => [source, target, type, predicate]).sort()).toEqual([
      ['MPL001', 'MHS001', 'belongs-to-house', 'message_house_ref'],
      ['MPL001', 'NED999', 'custom', 'custom_refs'],
      ['MPL001', 'NED999', 'custom', 'custom_refs'],
    ]);
    expect(model.entities.filter(entity => entity.id === 'NED999')).toHaveLength(0);
    const result = deriveBuilderRelations(extractEntities({ entities: [{ id: 'MPL001', custom_refs: ['NED999', 'NED999'] }] }));
    expect(result.placeholders).toHaveLength(1);
    expect(result.placeholders[0].data._placeholder).toBe(true);
  });
});


describe('nested message pillar extraction', () => {
  it('uses the pillars collection type for noncanonical identifiers and preserves explicit containment', () => {
    const source = {
      strategy: {
        message_houses: [{
          id: 'MHS001', name: 'House',
          pillars: [
            { id: 'PIL001', name: 'Implicit containment' },
            { id: 'PIL002', name: 'Explicit containment', message_house_ref: 'MHS002' },
            { id: 'MPL003', name: 'Canonical identifier' },
          ],
          other_children: [{ id: 'PIL004', name: 'Unrelated child' }],
        }],
      },
    };
    const original = structuredClone(source);
    const model = buildBrandvoiceModel(source);
    expect(model.entities.filter(entity => ['PIL001', 'PIL002', 'MPL003'].includes(entity.id)))
      .toEqual(expect.arrayContaining(['PIL001', 'PIL002', 'MPL003'].map(id => expect.objectContaining({
        id, type: 'message_pillar', plane: 'strategy',
      }))));
    expect(model.entities.find(entity => entity.id === 'PIL004')?.type).toBe('unknown');
    expect(model.relations.map(({ source, target, type, predicate }) => [source, target, type, predicate]).sort()).toEqual([
      ['MPL003', 'MHS001', 'belongs-to-house', 'message_house_ref'],
      ['PIL001', 'MHS001', 'belongs-to-house', 'message_house_ref'],
      ['PIL002', 'MHS002', 'belongs-to-house', 'message_house_ref'],
    ]);
    expect(source).toEqual(original);
  });
});
