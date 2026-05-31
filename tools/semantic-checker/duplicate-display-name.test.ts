import { describe, it, expect } from 'vitest';
import { fileURLToPath } from 'node:url';
import { loadRules, loadExtensions, runChecker } from '@archally/semantic-checker';
import { buildBrandvoiceModel } from '@archally/brandvoice-schema/model';
import { toCheckableModel } from './adapter.js';

// TST074 — the consumer-side TypeScript extension example detects entities that share a display
// name. Exercised explicitly here (not part of the default `rules/` set, so it never affects the
// byte-for-byte output of the eight ported rules).

describe('duplicate-display-name (consumer extension example)', () => {
  it('flags entities that share a display name with a different entity', async () => {
    const rules = await loadRules(fileURLToPath(new URL('./examples/duplicate-display-name.rule.yaml', import.meta.url)));
    const extensions = await loadExtensions(rules);

    // Two distinct channels deliberately share the name "App Store".
    const model = toCheckableModel(buildBrandvoiceModel({
      activation: { channels: { channels: [
        { id: 'CHN001', name: 'App Store' },
        { id: 'CHN002', name: 'App Store' },
        { id: 'CHN003', name: 'Newsletter' },
      ] } },
    }));

    const issues = runChecker(model, rules, {}, extensions);
    expect(issues).toHaveLength(2);
    expect(issues.map(i => i.entityId).sort()).toEqual(['CHN001', 'CHN002']);
    expect(issues[0].message).toContain("shares display name 'App Store'");
  });
});
