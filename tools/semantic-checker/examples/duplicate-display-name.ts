import type { CheckableModel, CheckableEntity, ExtensionResult } from '@archally/semantic-checker';

/**
 * Consumer-side TypeScript extension example (escape hatch, D4) for the brandvoice rule set.
 *
 * Flags any entity that shares its display name with a *different* entity - cross-entity logic the
 * declarative DSL cannot express. This is a standalone template: it lives in `examples/`, NOT in
 * the default `rules/` set the CLI loads for `npm run check`, so it never changes the byte-for-byte
 * output of the eight ported rules. It is exercised by `duplicate-display-name.test.ts`
 * (loadRules → loadExtensions → runChecker). Copy this pattern to add your own consumer extension.
 *
 * Pairs with `duplicate-display-name.rule.yaml`.
 */
export function duplicateDisplayName(
  model: CheckableModel,
  subject: CheckableEntity | undefined,
): ExtensionResult {
  if (!subject || !subject.name) return { ok: true };
  const twins = model.entities.filter(
    entity => entity.id !== subject.id && entity.name === subject.name,
  );
  if (twins.length === 0) return { ok: true };
  return {
    ok: false,
    context: { duplicates: twins.map(entity => entity.displayId ?? entity.id) },
  };
}

export default duplicateDisplayName;
