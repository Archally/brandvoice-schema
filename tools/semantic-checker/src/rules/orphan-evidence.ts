import type { RuleDefinition, SemanticIssue } from '../types.js';
import { walkEntities, collectAllRefs, getPrefix } from './helpers.js';

export const orphanEvidence: RuleDefinition = {
  id: 'orphan-evidence',
  name: 'Orphan Evidence',
  description: 'Evidence records (EVD) that are never referenced by any entity.',
  defaultSeverity: 'warn',
  check(model) {
    const evidenceIds: string[] = [];
    walkEntities(model, (entity) => {
      if (getPrefix(entity.id as string) === 'EVD') evidenceIds.push(entity.id as string);
    });
    const allRefs = collectAllRefs(model);
    const issues: SemanticIssue[] = [];
    for (const id of evidenceIds) {
      if (!allRefs.has(id)) {
        issues.push({
          ruleId: 'orphan-evidence',
          severity: 'warn',
          message: `Evidence ${id} is never referenced by any entity.`,
          entityId: id,
        });
      }
    }
    return issues;
  },
};
