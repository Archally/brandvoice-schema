# Brandvoice tools

Run these commands from the repository root after `npm ci` and `npm run build`.

| Tool | Command | Purpose | License |
|---|---|---|---|
| validator | `npm run validate:examples` | Schema and reference conformance for both examples | Apache-2.0 |
| model-builder | `npm run model -- examples/fitness-app/.brandvoice/v1.9 --output fitness-model.json` | Build the entity graph | FSL-1.1-ALv2 |
| semantic-checker | `npm run check:examples` | Model quality findings | FSL-1.1-ALv2 |
| schema-atlas | `npm run atlas` / `npm run atlas:check` | Generate/check the [schema reference](../docs/schema-atlas/2026-11-05-reference.md) | Apache-2.0 |
| doc-snippet-validate | `npm run doc-snippets` | Validate named YAML models in README | Apache-2.0 |
| entity-query | `node tools/entity-query/cli.mjs fitness-model.json --type brand` | Filter built entities by type, plane or text | FSL-1.1-ALv2 |
| next-id | `node tools/next-id/cli.mjs fitness-model.json BRD` | Suggest the next three-digit ID, without reserving it | FSL-1.1-ALv2 |
| port | `npm run port:verify` | Check shipped file integrity | Apache-2.0 |

The authoritative license map is [LICENSE](../LICENSE); [tools/LICENSE](LICENSE)
names each directory. Dependencies retain their own licenses.

For the second worked model:

```bash
npm run model -- examples/time-management/.brandvoice/v1.9 --output time-model.json
node tools/entity-query/cli.mjs time-model.json --type brand
node tools/next-id/cli.mjs time-model.json BRD
```

Query output is JSON with `total` and `entities`. Add `--plane strategy` or
`--text phrase` to filter. ID allocation considers entity IDs in the built graph,
uses prefixes from the shipped metamodel, and fails if the three-digit range is
exhausted. For scoped IDs add `--scope namespace`; build the graph again after
editing. Suggestions are local and do not reserve an ID across users.

Documentation snippets use a heading such as `### ` followed by a backticked
YAML file name immediately before a YAML fence. Named blocks in a document form
one model; unnamed fragments are counted and skipped. Run
`node tools/doc-snippet-validate/cli.mjs README.md` to check it.

`npm test` runs every declared test suite and rejects missing or zero-test suites.
`npm run docs:check` checks documentation for private paths and unsupported
future claims. This text check supplements review of the actual behavior.
