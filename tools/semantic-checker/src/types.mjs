/**
 * @typedef {'error' | 'warn' | 'info'} Severity
 *
 * @typedef {Object} SemanticIssue
 * @property {string} ruleId
 * @property {Severity} severity
 * @property {string} message
 * @property {string} [entityId]
 *
 * @typedef {Object} RuleDefinition
 * @property {string} id
 * @property {string} name
 * @property {string} description
 * @property {Severity} defaultSeverity
 * @property {(model: Record<string, unknown>) => SemanticIssue[]} check
 *
 * @typedef {Object} CheckerConfig
 * @property {Record<string, Severity | 'off' | { severity?: Severity | 'off' }>} [rules]
 */

export {};
