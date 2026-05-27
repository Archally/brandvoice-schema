export const activeCampaignLinks = {
  id: "active-campaign-links",
  name: "Active Campaign Completeness",
  description: "Active campaigns must link message_refs, channel_refs, and outcome_refs.",
  defaultSeverity: "error",
  check(model) {
    const campaigns = model?.activation?.campaigns?.campaigns ?? [];
    const issues = [];
    for (const campaign of campaigns) {
      if (campaign?.status !== "active") continue;
      const id = campaign.id ?? "<unknown>";
      const missing = [];
      if (!Array.isArray(campaign.message_refs) || campaign.message_refs.length === 0) missing.push("message_refs");
      if (!Array.isArray(campaign.channel_refs) || campaign.channel_refs.length === 0) missing.push("channel_refs");
      if (!Array.isArray(campaign.outcome_refs) || campaign.outcome_refs.length === 0) missing.push("outcome_refs");
      if (missing.length > 0) {
        issues.push({
          ruleId: "active-campaign-links",
          severity: "error",
          message: `Active campaign '${id}' is missing: ${missing.join(", ")}.`,
          entityId: id,
        });
      }
    }
    return issues;
  },
};
