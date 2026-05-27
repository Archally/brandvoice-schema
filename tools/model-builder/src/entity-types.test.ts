import { describe, it, expect } from 'vitest';
import { getPrefix, resolveEntityType, isEntityId, PREFIX_TO_TYPE, TYPE_TO_PLANE } from './entity-types.js';

describe('getPrefix', () => {
  it('extracts prefix from plain ID', () => {
    expect(getPrefix('MKT001')).toBe('MKT');
    expect(getPrefix('EVD012')).toBe('EVD');
    expect(getPrefix('CPR003')).toBe('CPR');
  });

  it('extracts prefix from scoped ID', () => {
    expect(getPrefix('market.CPR001')).toBe('CPR');
    expect(getPrefix('governance.EVD005')).toBe('EVD');
    expect(getPrefix('strategy.NED004')).toBe('NED');
  });

  it('returns null for non-ID strings', () => {
    expect(getPrefix('hello')).toBeNull();
    expect(getPrefix('123')).toBeNull();
    expect(getPrefix('')).toBeNull();
  });

  it('handles 4-letter prefixes', () => {
    expect(getPrefix('MIGG001')).toBe('MIGG');
  });

  it('rejects 5-letter prefixes', () => {
    expect(getPrefix('ABCDE001')).toBeNull();
  });
});

describe('resolveEntityType', () => {
  it('resolves known prefixes', () => {
    expect(resolveEntityType('MKT001')).toBe('market');
    expect(resolveEntityType('CPR001')).toBe('competitor');
    expect(resolveEntityType('EVD001')).toBe('evidence');
    expect(resolveEntityType('MSG001')).toBe('message');
    expect(resolveEntityType('EPL001')).toBe('ecosystem_player');
    expect(resolveEntityType('TST001')).toBe('experiment');
    expect(resolveEntityType('PRI001')).toBe('priority_stream');
    expect(resolveEntityType('RMP001')).toBe('roadmap_phase');
  });

  it('resolves scoped IDs', () => {
    expect(resolveEntityType('market.CPR001')).toBe('competitor');
    expect(resolveEntityType('governance.DEC001')).toBe('decision');
  });

  it('returns null for unknown prefixes', () => {
    expect(resolveEntityType('ZZZ001')).toBeNull();
    expect(resolveEntityType('not-an-id')).toBeNull();
  });
});

describe('isEntityId', () => {
  it('identifies valid entity IDs', () => {
    expect(isEntityId('MKT001')).toBe(true);
    expect(isEntityId('market.CPR001')).toBe(true);
    expect(isEntityId('EVD0123')).toBe(true);
  });

  it('rejects non-IDs', () => {
    expect(isEntityId('hello')).toBe(false);
    expect(isEntityId(123)).toBe(false);
    expect(isEntityId(null)).toBe(false);
    expect(isEntityId('')).toBe(false);
    expect(isEntityId('MK01')).toBe(false);
  });
});

describe('mapping completeness', () => {
  it('every type in PREFIX_TO_TYPE has a plane in TYPE_TO_PLANE', () => {
    for (const type of Object.values(PREFIX_TO_TYPE)) {
      expect(TYPE_TO_PLANE[type], `missing plane for type: ${type}`).toBeDefined();
    }
  });

  it('has all 4 planes covered', () => {
    const planes = new Set(Object.values(TYPE_TO_PLANE));
    expect(planes).toContain('market');
    expect(planes).toContain('strategy');
    expect(planes).toContain('activation');
    expect(planes).toContain('governance');
  });

  it('has 45 entity type prefixes', () => {
    expect(Object.keys(PREFIX_TO_TYPE).length).toBe(45);
  });
});
