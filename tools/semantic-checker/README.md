# Brandvoice Semantic Checker

Configurable rule engine that catches modeling issues schema validation cannot detect. Ships with 8 built-in rules, configurable via `.brandvoice-lint.yaml`.

## Usage

```bash
# Check default path (.brandvoice/v1.6/)
npx @archally/brandvoice-schema brandvoice-check

# Check specific model
npx @archally/brandvoice-schema brandvoice-check path/to/.brandvoice/v1.6

# List available rules
npx @archally/brandvoice-schema brandvoice-check --list

# Custom config
npx @archally/brandvoice-schema brandvoice-check --config .brandvoice-lint.yaml
```

## Built-in Rules

| Rule ID | Default | Description |
|---------|---------|-------------|
| `evidence-coverage` | warn | Entities that should reference evidence but have no `evidence_refs` |
| `orphan-evidence` | warn | EVD records never referenced by any entity |
| `active-message-proof` | error | Active messages missing `proof_points` or `evidence_refs` |
| `active-campaign-links` | error | Active campaigns missing `message_refs`, `channel_refs`, or `outcome_refs` |
| `experiment-results` | error | Completed experiments without `result` or `result_summary` |
| `empty-planes` | warn | Market, strategy, activation, or governance planes missing or empty |
| `positioning-evidence` | warn | Positioning claims without `evidence_refs` |
| `high-threat-depth` | warn | High-threat competitors lacking pricing, strengths, or weaknesses |

## Configuration

Create a `.brandvoice-lint.yaml` file to override rule severity:

```yaml
rules:
  evidence-coverage: warn
  active-message-proof: error
  high-threat-depth: off
  empty-planes: info
```

Valid severity values: `error`, `warn`, `info`, `off`.

## Exit Codes

| Code | Meaning |
|------|---------|
| 0 | Passed (warnings/info may be present) |
| 1 | Failed — at least one error-severity issue |
| 2 | Runner error (missing files, composition failure) |

## Module Structure

| File | Responsibility |
|------|---------------|
| `cli.mjs` | CLI entry point, config loading, output formatting |
| `engine.mjs` | Rule engine — iterates rules, applies severity config |
| `rules/index.mjs` | Built-in rule registry |
| `rules/helpers.mjs` | Shared utilities — entity walking, ref collection |
| `rules/*.mjs` | Individual rule implementations |
