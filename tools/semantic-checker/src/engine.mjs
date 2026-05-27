/**
 * @param {Record<string, unknown>} model - Composed brandvoice model
 * @param {import('./types.mjs').RuleDefinition[]} rules
 * @param {import('./types.mjs').CheckerConfig} config
 * @returns {import('./types.mjs').SemanticIssue[]}
 */
export function runChecker(model, rules, config = {}) {
  const issues = [];
  for (const rule of rules) {
    const ruleConfig = config.rules?.[rule.id];
    const severity = resolveRuleSeverity(rule, ruleConfig);
    if (severity === "off") continue;
    const ruleIssues = rule.check(model);
    for (const issue of ruleIssues) {
      issues.push({ ...issue, severity });
    }
  }
  return issues;
}

function resolveRuleSeverity(rule, config) {
  if (!config) return rule.defaultSeverity;
  if (typeof config === "string") return config;
  return config.severity ?? rule.defaultSeverity;
}
