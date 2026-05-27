import type { RuleDefinition, SemanticIssue } from '../types.js';

export const highThreatDepth: RuleDefinition = {
  id: 'high-threat-depth',
  name: 'High-Threat Competitor Depth',
  description: 'Competitors at threat_level high or critical should have pricing, strengths, and weaknesses.',
  defaultSeverity: 'warn',
  check(model) {
    const market = model.market as Record<string, unknown> | undefined;
    const competition = market?.competition as Record<string, unknown> | undefined;
    const competitors = (competition?.competitors ?? []) as Record<string, unknown>[];
    const issues: SemanticIssue[] = [];
    for (const competitor of competitors) {
      if (competitor.threat_level !== 'high' && competitor.threat_level !== 'critical') continue;
      const id = (competitor.id ?? '<unknown>') as string;
      const name = (competitor.name ?? 'unnamed') as string;
      const missing: string[] = [];
      if (!competitor.pricing) missing.push('pricing');
      if (!Array.isArray(competitor.strengths) || competitor.strengths.length === 0) missing.push('strengths');
      if (!Array.isArray(competitor.weaknesses) || competitor.weaknesses.length === 0) missing.push('weaknesses');
      if (missing.length > 0) {
        issues.push({ ruleId: 'high-threat-depth', severity: 'warn', message: `High-threat competitor '${id}' (${name}) is missing: ${missing.join(', ')}.`, entityId: id });
      }
    }
    return issues;
  },
};
