const PLANES = ["market", "strategy", "activation", "governance"];

export const emptyPlanes = {
  id: "empty-planes",
  name: "Empty Planes",
  description: "Planes that are missing or have no content.",
  defaultSeverity: "warn",
  check(model) {
    const issues = [];
    for (const plane of PLANES) {
      const content = model[plane];
      if (!content || typeof content !== "object" || Object.keys(content).length === 0) {
        issues.push({
          ruleId: "empty-planes",
          severity: "warn",
          message: `${plane} plane is missing or empty.`,
        });
      }
    }
    return issues;
  },
};
