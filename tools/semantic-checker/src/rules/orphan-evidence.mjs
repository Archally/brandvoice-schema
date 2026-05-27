import { walkEntities, collectAllRefs, getPrefix } from "./helpers.mjs";

export const orphanEvidence = {
  id: "orphan-evidence",
  name: "Orphan Evidence",
  description: "Evidence records (EVD) that are never referenced by any entity.",
  defaultSeverity: "warn",
  check(model) {
    const evidenceIds = [];
    walkEntities(model, (entity) => {
      if (getPrefix(entity.id) === "EVD") evidenceIds.push(entity.id);
    });
    const allRefs = collectAllRefs(model);
    const issues = [];
    for (const id of evidenceIds) {
      if (!allRefs.has(id)) {
        issues.push({
          ruleId: "orphan-evidence",
          severity: "warn",
          message: `Evidence ${id} is never referenced by any entity.`,
          entityId: id,
        });
      }
    }
    return issues;
  },
};
