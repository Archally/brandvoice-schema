import type { RuleDefinition, SemanticIssue } from '../types.js';

export const activeMessageProof: RuleDefinition = {
  id: 'active-message-proof',
  name: 'Active Message Proof Points',
  description: 'Active messages must include proof_points and evidence_refs.',
  defaultSeverity: 'error',
  check(model) {
    const messaging = (model.strategy as Record<string, unknown>)?.messaging as Record<string, unknown> | undefined;
    const messages = (messaging?.messages ?? []) as Record<string, unknown>[];
    const issues: SemanticIssue[] = [];
    for (const message of messages) {
      if (message.status !== 'active') continue;
      const id = (message.id ?? '<unknown>') as string;
      if (!Array.isArray(message.evidence_refs) || message.evidence_refs.length === 0) {
        issues.push({ ruleId: 'active-message-proof', severity: 'error', message: `Active message '${id}' has no evidence_refs.`, entityId: id });
      }
      if (!Array.isArray(message.proof_points) || message.proof_points.length === 0) {
        issues.push({ ruleId: 'active-message-proof', severity: 'error', message: `Active message '${id}' has no proof_points.`, entityId: id });
      }
    }
    return issues;
  },
};
