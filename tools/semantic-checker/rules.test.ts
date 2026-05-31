import { describe, it, expect, beforeAll } from 'vitest';
import { fileURLToPath } from 'node:url';
import { loadRules, runChecker } from '@archally/semantic-checker';
import type { RuleDefinition, SemanticIssue } from '@archally/semantic-checker';
import { buildBrandvoiceModel } from '@archally/brandvoice-schema/model';
import { toCheckableModel } from './adapter.js';

// Each test runs ONE ported YAML rule over a raw brandvoice fragment, through the same pipeline
// the CLI uses: buildBrandvoiceModel → toCheckableModel → shared runChecker.
//
// Where the graph model refines a legacy check, fixtures are adjusted deliberately (and noted):
//   - evidence linkage now requires a relation to a REAL entity (a dangling ref no longer counts),
//     so "passes" fixtures declare the referenced EVD/TST entity.
//   - empty-planes now means "plane has ≥ 1 entity" (not "plane key present"), so fixtures place
//     entities in the planes that must pass.

let byId: Map<string, RuleDefinition>;

beforeAll(async () => {
  const rules = await loadRules(fileURLToPath(new URL('./rules', import.meta.url)));
  byId = new Map(rules.map(rule => [rule.id, rule]));
});

function run(ruleId: string, raw: Record<string, unknown>): SemanticIssue[] {
  const rule = byId.get(ruleId);
  if (!rule) throw new Error(`rule '${ruleId}' not loaded`);
  return runChecker(toCheckableModel(buildBrandvoiceModel(raw)), [rule]);
}

describe('evidence-coverage', () => {
  it('warns on entities without evidence linkage', () => {
    const issues = run('evidence-coverage', {
      market: { landscape: { markets: [{ id: 'MKT001', name: 'Test' }] } },
    });
    expect(issues).toHaveLength(1);
    expect(issues[0].entityId).toBe('MKT001');
  });

  it('passes when entity has evidence_refs to a real EVD', () => {
    expect(run('evidence-coverage', {
      market: { landscape: { markets: [{ id: 'MKT001', name: 'Test', evidence_refs: ['EVD001'] }] } },
      governance: { evidence: { evidence: [{ id: 'EVD001', title: 'Source' }] } },
    })).toHaveLength(0);
  });

  it('passes when entity has validated_by to a real experiment', () => {
    expect(run('evidence-coverage', {
      market: { landscape: { markets: [{ id: 'MKT001', name: 'Test', validated_by: ['TST001'] }] } },
      governance: { experiments: { experiments: [{ id: 'TST001', hypothesis: 'h' }] } },
    })).toHaveLength(0);
  });

  it('ignores entities with non-evidence-expected types', () => {
    expect(run('evidence-coverage', {
      governance: { measurement: { metrics: [{ id: 'MET001', name: 'Test' }] } },
    })).toHaveLength(0);
  });
});

describe('orphan-evidence', () => {
  it('warns on unreferenced EVD records', () => {
    const issues = run('orphan-evidence', {
      governance: { evidence: { evidence: [{ id: 'EVD001', title: 'Unused' }] } },
    });
    expect(issues).toHaveLength(1);
    expect(issues[0].entityId).toBe('EVD001');
  });

  it('passes when EVD is referenced via evidence_refs', () => {
    expect(run('orphan-evidence', {
      governance: { evidence: { evidence: [{ id: 'EVD001', title: 'Used' }] } },
      market: { landscape: { markets: [{ id: 'MKT001', evidence_refs: ['EVD001'] }] } },
    })).toHaveLength(0);
  });
});

describe('active-message-proof', () => {
  it('errors on active message without proof_points', () => {
    const issues = run('active-message-proof', {
      strategy: { messaging: { messages: [
        { id: 'MSG001', title: 'x', core_statement: 'x', status: 'active', evidence_refs: ['EVD001'] },
      ] } },
    });
    expect(issues).toHaveLength(1);
    expect(issues[0].message).toContain('proof_points');
  });

  it('errors on active message without evidence_refs', () => {
    const issues = run('active-message-proof', {
      strategy: { messaging: { messages: [
        { id: 'MSG001', title: 'x', core_statement: 'x', status: 'active', proof_points: ['PRF001'] },
      ] } },
    });
    expect(issues).toHaveLength(1);
    expect(issues[0].message).toContain('evidence_refs');
  });

  it('passes on active message with both', () => {
    expect(run('active-message-proof', {
      strategy: { messaging: { messages: [
        { id: 'MSG001', title: 'x', core_statement: 'x', status: 'active', evidence_refs: ['EVD001'], proof_points: ['PRF001'] },
      ] } },
    })).toHaveLength(0);
  });

  it('ignores non-active messages', () => {
    expect(run('active-message-proof', {
      strategy: { messaging: { messages: [
        { id: 'MSG001', title: 'x', core_statement: 'x', status: 'draft' },
      ] } },
    })).toHaveLength(0);
  });
});

describe('active-campaign-links', () => {
  it('errors on active campaign missing links', () => {
    const issues = run('active-campaign-links', {
      activation: { campaigns: { campaigns: [
        { id: 'CMP001', name: 'x', status: 'active', objective: 'x', start_date: '2026-01-01' },
      ] } },
    });
    expect(issues).toHaveLength(1);
    expect(issues[0].message).toContain('message_refs');
  });

  it('passes on active campaign with all links', () => {
    expect(run('active-campaign-links', {
      activation: { campaigns: { campaigns: [
        { id: 'CMP001', name: 'x', status: 'active', objective: 'x', start_date: '2026-01-01',
          message_refs: ['MSG001'], channel_refs: ['CHN001'], outcome_refs: ['OUT001'] },
      ] } },
    })).toHaveLength(0);
  });

  it('ignores draft campaigns', () => {
    expect(run('active-campaign-links', {
      activation: { campaigns: { campaigns: [
        { id: 'CMP001', name: 'x', status: 'draft', objective: 'x', start_date: '2026-01-01' },
      ] } },
    })).toHaveLength(0);
  });
});

describe('experiment-results', () => {
  it('errors on completed experiment without results', () => {
    expect(run('experiment-results', {
      governance: { experiments: { experiments: [{ id: 'TST001', hypothesis: 'x', status: 'completed' }] } },
    })).toHaveLength(1);
  });

  it('passes with result object', () => {
    expect(run('experiment-results', {
      governance: { experiments: { experiments: [{ id: 'TST001', hypothesis: 'x', status: 'completed', result: { winner: 'A' } }] } },
    })).toHaveLength(0);
  });

  it('passes with result_summary', () => {
    expect(run('experiment-results', {
      governance: { experiments: { experiments: [{ id: 'TST001', hypothesis: 'x', status: 'completed', result_summary: 'Variant A won.' }] } },
    })).toHaveLength(0);
  });

  it('ignores planned experiments', () => {
    expect(run('experiment-results', {
      governance: { experiments: { experiments: [{ id: 'TST001', hypothesis: 'x', status: 'planned' }] } },
    })).toHaveLength(0);
  });
});

describe('empty-planes', () => {
  it('warns on a model with no entities (all four planes empty)', () => {
    expect(run('empty-planes', {})).toHaveLength(4);
  });

  it('passes when every plane has at least one entity', () => {
    expect(run('empty-planes', {
      market: { landscape: { markets: [{ id: 'MKT001' }] } },
      strategy: { messaging: { messages: [{ id: 'MSG001' }] } },
      activation: { channels: { channels: [{ id: 'CHN001' }] } },
      governance: { evidence: { evidence: [{ id: 'EVD001' }] } },
    })).toHaveLength(0);
  });

  it('warns only on the planes that contain no entities', () => {
    const issues = run('empty-planes', {
      strategy: { messaging: { messages: [{ id: 'MSG001' }] } },
      governance: { evidence: { evidence: [{ id: 'EVD001' }] } },
    });
    expect(issues).toHaveLength(2);
    expect(issues.map(i => i.message)).toEqual([
      'activation plane is missing or empty.',
      'market plane is missing or empty.',
    ]);
  });
});

describe('positioning-evidence', () => {
  it('warns on positioning without evidence', () => {
    expect(run('positioning-evidence', {
      strategy: { market_product: { positioning: [{ id: 'POS001', market_category: 'x', differentiated_claim: 'y' }] } },
    })).toHaveLength(1);
  });

  it('passes with evidence_refs to a real EVD', () => {
    expect(run('positioning-evidence', {
      strategy: { market_product: { positioning: [{ id: 'POS001', market_category: 'x', differentiated_claim: 'y', evidence_refs: ['EVD001'] }] } },
      governance: { evidence: { evidence: [{ id: 'EVD001', title: 'Source' }] } },
    })).toHaveLength(0);
  });
});

describe('high-threat-depth', () => {
  it('warns on high-threat competitor missing depth', () => {
    const issues = run('high-threat-depth', {
      market: { competition: { competitors: [{ id: 'CPR001', name: 'Rival', type: 'direct', threat_level: 'high' }] } },
    });
    expect(issues).toHaveLength(1);
    expect(issues[0].message).toContain('pricing');
  });

  it('passes when high-threat competitor has full profile', () => {
    expect(run('high-threat-depth', {
      market: { competition: { competitors: [
        { id: 'CPR001', name: 'Rival', type: 'direct', threat_level: 'high',
          pricing: { model: 'per-seat' }, strengths: ['fast'], weaknesses: ['slow'] },
      ] } },
    })).toHaveLength(0);
  });

  it('ignores low-threat competitors', () => {
    expect(run('high-threat-depth', {
      market: { competition: { competitors: [{ id: 'CPR001', name: 'Rival', type: 'direct', threat_level: 'low' }] } },
    })).toHaveLength(0);
  });
});
