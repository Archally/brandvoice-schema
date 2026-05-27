import { describe, it, expect } from 'vitest';
import { runChecker } from './engine.js';
import type { RuleDefinition } from './types.js';

const alwaysWarnRule: RuleDefinition = {
  id: 'test-warn',
  name: 'Test Warn',
  description: 'Always warns',
  defaultSeverity: 'warn',
  check: () => [{ ruleId: 'test-warn', severity: 'warn', message: 'warning found' }],
};

const alwaysErrorRule: RuleDefinition = {
  id: 'test-error',
  name: 'Test Error',
  description: 'Always errors',
  defaultSeverity: 'error',
  check: () => [{ ruleId: 'test-error', severity: 'error', message: 'error found' }],
};

const noIssuesRule: RuleDefinition = {
  id: 'test-clean',
  name: 'Test Clean',
  description: 'Never issues',
  defaultSeverity: 'warn',
  check: () => [],
};

describe('runChecker', () => {
  it('runs all rules and collects issues', () => {
    const issues = runChecker({}, [alwaysWarnRule, alwaysErrorRule, noIssuesRule]);
    expect(issues).toHaveLength(2);
  });

  it('applies config severity override', () => {
    const issues = runChecker({}, [alwaysWarnRule], { rules: { 'test-warn': 'error' } });
    expect(issues[0].severity).toBe('error');
  });

  it('skips rules set to off', () => {
    const issues = runChecker({}, [alwaysWarnRule], { rules: { 'test-warn': 'off' } });
    expect(issues).toHaveLength(0);
  });

  it('supports object-style config', () => {
    const issues = runChecker({}, [alwaysWarnRule], { rules: { 'test-warn': { severity: 'info' } } });
    expect(issues[0].severity).toBe('info');
  });

  it('falls back to default severity when no config', () => {
    const issues = runChecker({}, [alwaysErrorRule]);
    expect(issues[0].severity).toBe('error');
  });

  it('returns empty for no rules', () => {
    expect(runChecker({}, [])).toHaveLength(0);
  });
});
