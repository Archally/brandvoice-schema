export const highThreatDepth = {
  id: "high-threat-depth",
  name: "High-Threat Competitor Depth",
  description: "Competitors at threat_level 'high' or 'critical' should have pricing, strengths, and weaknesses.",
  defaultSeverity: "warn",
  check(model) {
    const competitors = model?.market?.competition?.competitors ?? [];
    const issues = [];
    for (const competitor of competitors) {
      if (competitor?.threat_level !== "high" && competitor?.threat_level !== "critical") continue;
      const id = competitor.id ?? "<unknown>";
      const name = competitor.name ?? "unnamed";
      const missing = [];
      if (!competitor.pricing) missing.push("pricing");
      if (!Array.isArray(competitor.strengths) || competitor.strengths.length === 0) missing.push("strengths");
      if (!Array.isArray(competitor.weaknesses) || competitor.weaknesses.length === 0) missing.push("weaknesses");
      if (missing.length > 0) {
        issues.push({
          ruleId: "high-threat-depth",
          severity: "warn",
          message: `High-threat competitor '${id}' (${name}) is missing: ${missing.join(", ")}.`,
          entityId: id,
        });
      }
    }
    return issues;
  },
};
