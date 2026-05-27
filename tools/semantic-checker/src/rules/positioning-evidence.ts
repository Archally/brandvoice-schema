import type { RuleDefinition, SemanticIssue } from '../types.js';

export const positioningEvidence: RuleDefinition = {
  id: 'positioning-evidence',
  name: 'Positioning Evidence',
  description: 'Positioning claims without evidence_refs are unsubstantiated assertions.',
  defaultSeverity: 'warn',
  check(model) {
    const strategy = model.strategy as Record<string, unknown> | undefined;
    const marketProduct = strategy?.market_product as Record<string, unknown> | undefined;
    const positioning = (marketProduct?.positioning ?? []) as Record<string, unknown>[];
    const issues: SemanticIssue[] = [];
    for (const pos of positioning) {
      const id = (pos.id ?? '<unknown>') as string;
      if (!Array.isArray(pos.evidence_refs) || pos.evidence_refs.length === 0) {
        issues.push({ ruleId: 'positioning-evidence', severity: 'warn', message: `Positioning '${id}' has no evidence_refs — claim is unsubstantiated.`, entityId: id });
      }
    }
    return issues;
  },
};
