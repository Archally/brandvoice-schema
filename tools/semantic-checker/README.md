# Brandvoice Semantic Checker

Catches modeling issues schema validation cannot detect (missing evidence linkage, incomplete
active campaigns, orphan evidence, …). The **engine is external**: this directory is
a thin brandvoice-specific layer over [`@archally/semantic-checker`](https://github.com/archally/semantic-checker):

```
loadBrandvoice ─▶ buildBrandvoiceModel ─▶ toCheckableModel (adapter) ─▶ @archally/semantic-checker
   (compose)         (entities+relations)        (normalize)              (loadRules → runChecker)
```

The 18 rules are registered in YAML (`rules/*.yaml`). Six use declarative checks and twelve
load custom JavaScript modules. The engine, severity handling, JSON-Schema rule validation,
and extension loading come from the package. See its
[`docs/`](https://github.com/archally/semantic-checker/tree/main/docs) for the rule DSL and the
migration recipe this layer follows.

## Usage

```bash
# Check default path (.brandvoice/v1.9/)
npm run check

# Check a specific model
npm run check -- examples/fitness-app/.brandvoice/v1.9

# List available rules
npm run check -- --list

# Custom severity config
npm run check -- <model> --config .brandvoice-lint.yaml
```

## Rules (`rules/*.yaml`)

| Rule ID | Default | Requires |
|---------|---------|----------|
| `evidence-coverage` | warn | an outgoing `backed-by`/`validated-by` relation to an authored entity on evidence-expected entities |
| `orphan-evidence` | warn | every EVD record referenced by ≥ 1 entity |
| `active-message-proof` | error | active messages have `evidence_refs` **and** `proof_points` |
| `active-campaign-links` | error | active campaigns link `message_refs`, `channel_refs`, `outcome_refs` |
| `experiment-results` | error | completed experiments have `result` or `result_summary` |
| `empty-planes` | warn | each declared plane (market/strategy/activation/governance) has ≥ 1 entity |
| `positioning-evidence` | warn | positioning claims have a `backed-by` relation to an authored entity |
| `high-threat-depth` | warn | high/critical competitors have `pricing`, `strengths`, `weaknesses` |
| `recommended-story-framework` | warn | brand script frameworks use a recommended name; custom names remain valid |
| `active-offering-audience` | warn | explicitly active/beta offerings have a resolved target audience or an attached value proposition/message with one |
| `offering-audiences-untested` | info | a nonempty resolved target set contains an audience whose evidence level is not explicitly hypothesis |
| `offering-competitor-depth` | warn | each resolved named competitor has populated evidence references, strengths, weaknesses or pricing in a supplied shard |
| `evidence-level-backed` | warn | audiences/personas above hypothesis have outgoing `backed-by` or `validated-by` linkage to an authored entity |
| `persona-evidence-within-audience` | warn | stated persona evidence levels do not exceed their audience's stated level |
| `superseded-offering-lifecycle` | warn | superseded offerings leave active/beta and their resolved replacements are not deprioritized/sunset |
| `superseded-by-cycle` | error | offering and evidence replacement graphs contain no directed cycles |
| `offering-audience-consistency` | warn | attached value proposition/message audiences belong to the offering's stated target list |
| `active-message-retired-offering` | warn | explicitly active messages do not promote explicitly sunset/deprioritized offerings |


> **Graph-model semantics.** Rules run over the extracted entity/relation graph, so a `*_ref` counts
> as linkage only when it resolves to a real entity (a dangling ref no longer counts), and
> `empty-planes` means "the plane has ≥ 1 entity". Findings are sorted deterministically by
> `(rule, id)`. Models whose evidence references remain unresolved can gain coverage warnings.

Evidence levels rank as `hypothesis < weak-signal < moderate-evidence < strong-evidence`.
An absent lifecycle status or evidence level remains unstated. An entirely unresolved target set
does not count as untested; unresolved references remain reference-validation concerns.

Custom joins compare resolved entity identities, accept qualified references, and consider all
supplied shards of each identity. Empty competitor arrays and objects do not supply depth.
Lifecycle findings aggregate reasons and sorted retired replacement IDs into one issue per
superseded offering. Replacement-cycle findings report each logical cycle member once, with
sorted strongly connected participants; tails entering cycles and acyclic joins remain quiet.

The `validated-by` alternative for audience/persona evidence is a graph-level contract. Their
YAML definitions expose `evidence_refs` for `backed-by` linkage, without a `validated_by` field.
The core recognizes `validated_by` on opportunities, without global recognition on other types
such as markets. Evidence coverage follows that same extraction contract. R4, evidence coverage
and positioning evidence use custom checks because declarative relation existence cannot verify
target resolution. Retained dangling edges and entities marked `_placeholder: true` never supply
evidence coverage; the adapter preserves the graph relations.

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
| 1 | Failed - at least one error-severity issue |
| 2 | Runner error (missing files, composition failure) |

## Layout

| File | Responsibility |
|------|----------------|
| `cli.ts` | thin entry point - compose, adapt, run, format (compiled to `dist/cli.js`) |
| `adapter.ts` | `BrandvoiceModel` → engine `CheckableModel` |
| `rules/*.yaml` | 18 registered rule packs loaded by the CLI |
| `rules/*.mjs` | custom checks and shared resolved-entity joins |
| `examples/duplicate-display-name.{ts,rule.yaml}` | consumer-side TypeScript extension example (not in the default run; see its test) |
| `*.test.ts` | rules, shared-engine routing, and extension tests |
| `checker-rules.test.mjs` | schema-validated composed fixtures through the builder, adapter and engine; synthetic `validated-by` graph fixture |
| `framework-recommendations.test.mjs` | framework fixtures and CLI checks |

## Tests

Build the model builder and checker before running the fixtures. From this directory:

```bash
node --test checker-rules.test.mjs
node --test framework-recommendations.test.mjs
npx --no-install vitest run --config vitest.config.ts
```

Composed fixtures use temporary directories and require no private model imports.

The default suite includes the composed rule fixtures. In Archally Pro,
`bv check <model-dir> [--config <path>]` runs the same rules and uses the same exit
codes and severity configuration as this package's `npm run check` command.
The nine offering, audience, evidence-level and replacement rules are included in
schema release 1.9.2; replacement cycles are errors by default.
