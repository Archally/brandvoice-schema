import { walkEntities, getPrefix } from "./helpers.mjs";

const EVIDENCE_EXPECTED = new Set([
  "ACT", "NED", "OFF", "CPR", "CTX", "MKT", "MFR", "OPP",
  "POS", "MSG", "CHN", "CMP", "BRD", "PBP", "MHS", "PRG",
  "CPL", "WSP", "DEC", "RSK",
]);

export const evidenceCoverage = {
  id: "evidence-coverage",
  name: "Evidence Coverage",
  description: "Entities that should reference evidence but have no evidence_refs.",
  defaultSeverity: "warn",
  check(model) {
    const issues = [];
    walkEntities(model, (entity, location) => {
      const prefix = getPrefix(entity.id);
      if (!EVIDENCE_EXPECTED.has(prefix)) return;
      const hasEvidence = Array.isArray(entity.evidence_refs) && entity.evidence_refs.length > 0;
      const hasValidatedBy = Array.isArray(entity.validated_by) && entity.validated_by.length > 0;
      if (!hasEvidence && !hasValidatedBy) {
        issues.push({
          ruleId: "evidence-coverage",
          severity: "warn",
          message: `${entity.id} (${entity.name ?? entity.title ?? "unnamed"}) has no evidence linkage.`,
          entityId: entity.id,
        });
      }
    });
    return issues;
  },
};
