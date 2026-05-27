export const positioningEvidence = {
  id: "positioning-evidence",
  name: "Positioning Evidence",
  description: "Positioning claims without evidence_refs are unsubstantiated assertions.",
  defaultSeverity: "warn",
  check(model) {
    const positioning = model?.strategy?.market_product?.positioning ?? [];
    const issues = [];
    for (const pos of positioning) {
      const id = pos.id ?? "<unknown>";
      if (!Array.isArray(pos.evidence_refs) || pos.evidence_refs.length === 0) {
        issues.push({
          ruleId: "positioning-evidence",
          severity: "warn",
          message: `Positioning '${id}' has no evidence_refs — claim is unsubstantiated.`,
          entityId: id,
        });
      }
    }
    return issues;
  },
};
