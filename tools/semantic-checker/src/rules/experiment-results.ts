import type { RuleDefinition, SemanticIssue } from '../types.js';

export const experimentResults: RuleDefinition = {
  id: 'experiment-results',
  name: 'Completed Experiment Results',
  description: 'Completed experiments must include result or result_summary.',
  defaultSeverity: 'error',
  check(model) {
    const governance = model.governance as Record<string, unknown> | undefined;
    const experiments = ((governance?.experiments as Record<string, unknown>)?.experiments ?? []) as Record<string, unknown>[];
    const issues: SemanticIssue[] = [];
    for (const experiment of experiments) {
      if (experiment.status !== 'completed') continue;
      const id = (experiment.id ?? '<unknown>') as string;
      const hasResult = !!experiment.result;
      const hasSummary = typeof experiment.result_summary === 'string' && experiment.result_summary.trim().length > 0;
      if (!hasResult && !hasSummary) {
        issues.push({ ruleId: 'experiment-results', severity: 'error', message: `Completed experiment '${id}' has no result or result_summary.`, entityId: id });
      }
    }
    return issues;
  },
};
