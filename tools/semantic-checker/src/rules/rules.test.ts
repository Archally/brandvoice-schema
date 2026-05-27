import { describe, it, expect } from 'vitest';
import { evidenceCoverage } from './evidence-coverage.js';
import { orphanEvidence } from './orphan-evidence.js';
import { activeMessageProof } from './active-message-proof.js';
import { activeCampaignLinks } from './active-campaign-links.js';
import { experimentResults } from './experiment-results.js';
import { emptyPlanes } from './empty-planes.js';
import { positioningEvidence } from './positioning-evidence.js';
import { highThreatDepth } from './high-threat-depth.js';

describe('evidence-coverage', () => {
  it('warns on entities without evidence_refs', () => {
    const model = {
      market: { landscape: { markets: [{ id: 'MKT001', name: 'Test' }] } },
    };
    const issues = evidenceCoverage.check(model);
    expect(issues).toHaveLength(1);
    expect(issues[0].entityId).toBe('MKT001');
  });

  it('passes when entity has evidence_refs', () => {
    const model = {
      market: { landscape: { markets: [{ id: 'MKT001', name: 'Test', evidence_refs: ['EVD001'] }] } },
    };
    expect(evidenceCoverage.check(model)).toHaveLength(0);
  });

  it('passes when entity has validated_by', () => {
    const model = {
      market: { landscape: { markets: [{ id: 'MKT001', name: 'Test', validated_by: ['TST001'] }] } },
    };
    expect(evidenceCoverage.check(model)).toHaveLength(0);
  });

  it('ignores entities with non-evidence-expected prefixes', () => {
    const model = {
      governance: { measurement: { metrics: [{ id: 'MET001', name: 'Test' }] } },
    };
    expect(evidenceCoverage.check(model)).toHaveLength(0);
  });
});

describe('orphan-evidence', () => {
  it('warns on unreferenced EVD records', () => {
    const model = {
      governance: { evidence: { evidence: [{ id: 'EVD001', title: 'Unused' }] } },
    };
    const issues = orphanEvidence.check(model);
    expect(issues).toHaveLength(1);
    expect(issues[0].entityId).toBe('EVD001');
  });

  it('passes when EVD is referenced via evidence_refs', () => {
    const model = {
      governance: { evidence: { evidence: [{ id: 'EVD001', title: 'Used' }] } },
      market: { landscape: { markets: [{ id: 'MKT001', evidence_refs: ['EVD001'] }] } },
    };
    expect(orphanEvidence.check(model)).toHaveLength(0);
  });
});

describe('active-message-proof', () => {
  it('errors on active message without proof_points', () => {
    const model = {
      strategy: { messaging: { messages: [
        { id: 'MSG001', title: 'x', core_statement: 'x', status: 'active', evidence_refs: ['EVD001'] },
      ] } },
    };
    const issues = activeMessageProof.check(model);
    expect(issues).toHaveLength(1);
    expect(issues[0].message).toContain('proof_points');
  });

  it('errors on active message without evidence_refs', () => {
    const model = {
      strategy: { messaging: { messages: [
        { id: 'MSG001', title: 'x', core_statement: 'x', status: 'active', proof_points: ['PRF001'] },
      ] } },
    };
    const issues = activeMessageProof.check(model);
    expect(issues).toHaveLength(1);
    expect(issues[0].message).toContain('evidence_refs');
  });

  it('passes on active message with both', () => {
    const model = {
      strategy: { messaging: { messages: [
        { id: 'MSG001', title: 'x', core_statement: 'x', status: 'active', evidence_refs: ['EVD001'], proof_points: ['PRF001'] },
      ] } },
    };
    expect(activeMessageProof.check(model)).toHaveLength(0);
  });

  it('ignores non-active messages', () => {
    const model = {
      strategy: { messaging: { messages: [
        { id: 'MSG001', title: 'x', core_statement: 'x', status: 'draft' },
      ] } },
    };
    expect(activeMessageProof.check(model)).toHaveLength(0);
  });
});

describe('active-campaign-links', () => {
  it('errors on active campaign missing links', () => {
    const model = {
      activation: { campaigns: { campaigns: [
        { id: 'CMP001', name: 'x', status: 'active', objective: 'x', start_date: '2026-01-01' },
      ] } },
    };
    const issues = activeCampaignLinks.check(model);
    expect(issues).toHaveLength(1);
    expect(issues[0].message).toContain('message_refs');
  });

  it('passes on active campaign with all links', () => {
    const model = {
      activation: { campaigns: { campaigns: [
        { id: 'CMP001', name: 'x', status: 'active', objective: 'x', start_date: '2026-01-01',
          message_refs: ['MSG001'], channel_refs: ['CHN001'], outcome_refs: ['OUT001'] },
      ] } },
    };
    expect(activeCampaignLinks.check(model)).toHaveLength(0);
  });

  it('ignores draft campaigns', () => {
    const model = {
      activation: { campaigns: { campaigns: [
        { id: 'CMP001', name: 'x', status: 'draft', objective: 'x', start_date: '2026-01-01' },
      ] } },
    };
    expect(activeCampaignLinks.check(model)).toHaveLength(0);
  });
});

describe('experiment-results', () => {
  it('errors on completed experiment without results', () => {
    const model = {
      governance: { experiments: { experiments: [
        { id: 'TST001', hypothesis: 'x', status: 'completed' },
      ] } },
    };
    expect(experimentResults.check(model)).toHaveLength(1);
  });

  it('passes with result object', () => {
    const model = {
      governance: { experiments: { experiments: [
        { id: 'TST001', hypothesis: 'x', status: 'completed', result: { winner: 'A' } },
      ] } },
    };
    expect(experimentResults.check(model)).toHaveLength(0);
  });

  it('passes with result_summary', () => {
    const model = {
      governance: { experiments: { experiments: [
        { id: 'TST001', hypothesis: 'x', status: 'completed', result_summary: 'Variant A won.' },
      ] } },
    };
    expect(experimentResults.check(model)).toHaveLength(0);
  });

  it('ignores planned experiments', () => {
    const model = {
      governance: { experiments: { experiments: [
        { id: 'TST001', hypothesis: 'x', status: 'planned' },
      ] } },
    };
    expect(experimentResults.check(model)).toHaveLength(0);
  });
});

describe('empty-planes', () => {
  it('warns on missing planes', () => {
    const issues = emptyPlanes.check({});
    expect(issues).toHaveLength(4);
  });

  it('passes when all planes present', () => {
    const model = {
      market: { landscape: {} },
      strategy: { brand_core: {} },
      activation: { channels: {} },
      governance: { evidence: {} },
    };
    expect(emptyPlanes.check(model)).toHaveLength(0);
  });

  it('warns on empty plane objects', () => {
    const model = { market: {}, strategy: { x: 1 }, activation: {}, governance: { y: 2 } };
    const issues = emptyPlanes.check(model);
    expect(issues).toHaveLength(2);
    expect(issues.map(i => i.message)).toContain('market plane is missing or empty.');
  });
});

describe('positioning-evidence', () => {
  it('warns on positioning without evidence', () => {
    const model = {
      strategy: { market_product: { positioning: [
        { id: 'POS001', market_category: 'x', differentiated_claim: 'y' },
      ] } },
    };
    expect(positioningEvidence.check(model)).toHaveLength(1);
  });

  it('passes with evidence_refs', () => {
    const model = {
      strategy: { market_product: { positioning: [
        { id: 'POS001', market_category: 'x', differentiated_claim: 'y', evidence_refs: ['EVD001'] },
      ] } },
    };
    expect(positioningEvidence.check(model)).toHaveLength(0);
  });
});

describe('high-threat-depth', () => {
  it('warns on high-threat competitor missing depth', () => {
    const model = {
      market: { competition: { competitors: [
        { id: 'CPR001', name: 'Rival', type: 'direct', threat_level: 'high' },
      ] } },
    };
    const issues = highThreatDepth.check(model);
    expect(issues).toHaveLength(1);
    expect(issues[0].message).toContain('pricing');
  });

  it('passes when high-threat competitor has full profile', () => {
    const model = {
      market: { competition: { competitors: [
        { id: 'CPR001', name: 'Rival', type: 'direct', threat_level: 'high',
          pricing: { model: 'per-seat' }, strengths: ['fast'], weaknesses: ['slow'] },
      ] } },
    };
    expect(highThreatDepth.check(model)).toHaveLength(0);
  });

  it('ignores low-threat competitors', () => {
    const model = {
      market: { competition: { competitors: [
        { id: 'CPR001', name: 'Rival', type: 'direct', threat_level: 'low' },
      ] } },
    };
    expect(highThreatDepth.check(model)).toHaveLength(0);
  });
});
