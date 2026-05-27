import type { RuleDefinition, SemanticIssue } from '../types.js';

export const activeCampaignLinks: RuleDefinition = {
  id: 'active-campaign-links',
  name: 'Active Campaign Completeness',
  description: 'Active campaigns must link message_refs, channel_refs, and outcome_refs.',
  defaultSeverity: 'error',
  check(model) {
    const activation = model.activation as Record<string, unknown> | undefined;
    const campaigns = ((activation?.campaigns as Record<string, unknown>)?.campaigns ?? []) as Record<string, unknown>[];
    const issues: SemanticIssue[] = [];
    for (const campaign of campaigns) {
      if (campaign.status !== 'active') continue;
      const id = (campaign.id ?? '<unknown>') as string;
      const missing: string[] = [];
      if (!Array.isArray(campaign.message_refs) || campaign.message_refs.length === 0) missing.push('message_refs');
      if (!Array.isArray(campaign.channel_refs) || campaign.channel_refs.length === 0) missing.push('channel_refs');
      if (!Array.isArray(campaign.outcome_refs) || campaign.outcome_refs.length === 0) missing.push('outcome_refs');
      if (missing.length > 0) {
        issues.push({ ruleId: 'active-campaign-links', severity: 'error', message: `Active campaign '${id}' is missing: ${missing.join(', ')}.`, entityId: id });
      }
    }
    return issues;
  },
};
