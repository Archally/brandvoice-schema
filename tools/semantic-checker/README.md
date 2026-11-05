# Brandvoice Semantic Checker

Catches modeling issues schema validation cannot detect (missing evidence linkage, incomplete
active campaigns, orphan evidence, …). The **engine is external**: this directory is
a thin brandvoice-specific layer over [`@archally/semantic-checker`](https://github.com/archally/semantic-checker):

```
loadBrandvoice ─▶ buildBrandvoiceModel ─▶ toCheckableModel (adapter) ─▶ @archally/semantic-checker
   (compose)         (entities+relations)        (normalize)              (loadRules → runChecker)
```

The rules are declarative YAML (`rules/*.yaml`); the engine, severity handling, JSON-Schema rule
validation, and the TypeScript escape hatch all come from the package. See its
[`docs/`](https://github.com/archally/semantic-checker/tree/main/docs) for the rule DSL and the
migration recipe this layer follows.

## Usage

```bash
# Check default path (.brandvoice/v1.8/)
npm run check

# Check a specific model
npm run check -- examples/fitness-app/.brandvoice/v1.8

# List available rules
npm run check -- --list

# Custom severity config
npm run check -- <model> --config .brandvoice-lint.yaml
```

## Rules (`rules/*.yaml`)

| Rule ID | Default | Requires |
|---------|---------|----------|
| `evidence-coverage` | warn | a `backed-by`/`validated-by` relation on evidence-expected entities |
| `orphan-evidence` | warn | every EVD record referenced by ≥ 1 entity |
| `active-message-proof` | error | active messages have `evidence_refs` **and** `proof_points` |
| `active-campaign-links` | error | active campaigns link `message_refs`, `channel_refs`, `outcome_refs` |
| `experiment-results` | error | completed experiments have `result` or `result_summary` |
| `empty-planes` | warn | each declared plane (market/strategy/activation/governance) has ≥ 1 entity |
| `positioning-evidence` | warn | positioning claims have a `backed-by` relation |
| `high-threat-depth` | warn | high/critical competitors have `pricing`, `strengths`, `weaknesses` |

> **Graph-model semantics.** Rules run over the extracted entity/relation graph, so a `*_ref` counts
> as linkage only when it resolves to a real entity (a dangling ref no longer counts), and
> `empty-planes` means "the plane has ≥ 1 entity". On the example models this produces the same
> findings as the legacy checker; output is now sorted deterministically by `(rule, id)`.

## Configuration

`.brandvoice-lint.yaml` (same `{ rules: { <id>: severity } }` shape as before; consumed directly as
the engine's `CheckerConfig`):

```yaml
rules:
  evidence-coverage: warn
  active-message-proof: error
  high-threat-depth: off
  empty-planes: info
```

Valid severities: `error`, `warn`, `info`, `off`.

## Exit Codes

| Code | Meaning |
|------|---------|
| 0 | Passed (warnings/info may be present) |
| 1 | Failed — at least one error-severity issue |
| 2 | Runner error (missing files, composition failure) |

## Layout

| File | Responsibility |
|------|----------------|
| `cli.ts` | thin entry point — compose, adapt, run, format (compiled to `dist/cli.js`) |
| `adapter.ts` | `BrandvoiceModel` → engine `CheckableModel` |
| `rules/*.yaml` | the eight declarative rule packs the CLI loads |
| `examples/duplicate-display-name.{ts,rule.yaml}` | consumer-side TypeScript extension example (not in the default run; see its test) |
| `*.test.ts` | rules, shared-engine routing, and extension tests |
