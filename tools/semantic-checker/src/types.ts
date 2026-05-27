export type Severity = 'error' | 'warn' | 'info';

export interface SemanticIssue {
  ruleId: string;
  severity: Severity;
  message: string;
  entityId?: string;
}

export interface RuleDefinition {
  id: string;
  name: string;
  description: string;
  defaultSeverity: Severity;
  check: (model: Record<string, unknown>) => SemanticIssue[];
}

export interface RuleConfig {
  severity?: Severity | 'off';
}

export interface CheckerConfig {
  rules?: Record<string, RuleConfig | Severity | 'off'>;
}
