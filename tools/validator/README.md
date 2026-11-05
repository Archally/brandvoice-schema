# Brandvoice Validator

Schema validation + cross-reference integrity + semantic checks + gap analysis for brandvoice models.

## Usage

```bash
# Validate default path (.brandvoice/v1.8/)
npm run validate

# Validate specific model directory
npm run validate -- path/to/.brandvoice/v1.8

# Explicit schema version
npm run validate -- --model path/to/model --schemas schema/v1.8

# Compat mode (schema failures become warnings)
npm run validate -- --compat
```

## Checks Performed

1. **Composition resolution** — loads `brandvoice.yaml`, resolves `$ref` placeholders, merges unreferenced supplementary files from plane subdirectories
2. **Schema validation** — Ajv draft-2020-12 against the root `brandvoice.schema.yaml`
3. **Cross-reference integrity** — every `*_ref` / `*_refs` value must resolve to a declared entity ID
4. **Semantic checks** — active messages need `evidence_refs`, active campaigns need `message_refs` + `channel_refs` + `outcome_refs`, completed experiments need results
5. **Gap warnings** — entities missing evidence linkage, orphan evidence records, empty planes

## Schema Version Auto-Detection

When `--schemas` is not specified, the validator detects the schema version from the model path. A model at `.brandvoice/v1.8/` automatically resolves to `schema/v1.8/`.

## Exit Codes

| Code | Meaning |
|------|---------|
| 0 | Passed (warnings may be present) |
| 1 | Failed — schema, cross-reference, or semantic errors |
| 2 | Runner error (missing files, parse failure) |

## Module Structure

| File | Responsibility |
|------|---------------|
| `cli.mjs` | CLI entry point, arg parsing, output formatting |
| `validate.mjs` | Orchestration — composes all checks into a single result |
| `schema-registry.mjs` | Ajv setup, schema file loading, base URI construction |
| `schema-types.mjs` | Plane subdirectory mapping, nested sub-key detection |
| `references.mjs` | ID regex, ref-key detection, `collectIds`, `collectRefs` |
| `composition.mjs` | `$ref` resolution, supplementary file merging |
| `semantics.mjs` | Semantic error checks, gap warning collection |
| `utils.mjs` | File I/O, YAML parsing, BOM stripping, merge helpers |
