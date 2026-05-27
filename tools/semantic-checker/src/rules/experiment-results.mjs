export const experimentResults = {
  id: "experiment-results",
  name: "Completed Experiment Results",
  description: "Completed experiments must include result or result_summary.",
  defaultSeverity: "error",
  check(model) {
    const experiments = model?.governance?.experiments?.experiments ?? [];
    const issues = [];
    for (const experiment of experiments) {
      if (experiment?.status !== "completed") continue;
      const id = experiment.id ?? "<unknown>";
      const hasResult = !!experiment.result;
      const hasSummary = typeof experiment.result_summary === "string" && experiment.result_summary.trim().length > 0;
      if (!hasResult && !hasSummary) {
        issues.push({
          ruleId: "experiment-results",
          severity: "error",
          message: `Completed experiment '${id}' has no result or result_summary.`,
          entityId: id,
        });
      }
    }
    return issues;
  },
};
