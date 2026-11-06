# Brandvoice Model Builder

Loads brandvoice YAML files and produces a typed in-memory entity/relation graph. Available as a CLI that writes `model.json`.

## Usage

```bash
# CLI - produce model.json
npm run model -- .brandvoice/v1.9 --output model.json --pretty

# Stats only - entity/relation counts without JSON output
npm run model -- .brandvoice/v1.9 --stats

# Pipe to stdout
npm run model -- .brandvoice/v1.9 | jq '.metadata'
```

## Output Shape

```json
{
  "entities": [
    {
      "id": "MKT001",
      "type": "market",
      "plane": "market",
      "name": "Primary Market",
      "data": { /* full YAML entity data */ }
    }
  ],
  "relations": [
    {
      "id": "REL0001",
      "source": "MKT001",
      "target": "EVD001",
      "type": "backed-by",
      "predicate": "evidence_refs"
    }
  ],
  "metadata": {
    "name": "My Brand",
    "version": "1.0.0",
    "schemaVersion": "1.9.0",
    "totalEntities": 45,
    "totalRelations": 87,
    "entityTypeCounts": { "market": 2, "competitor": 5, ... },
    "planeCounts": { "market": 15, "strategy": 20, ... },
    "relationTypeCounts": { "backed-by": 30, "targets-actor": 8, ... },
    "builtAt": "2026-05-27T12:00:00.000Z"
  }
}
```

## Entity Type Resolution

Entities are typed by their ID prefix (from `metamodel.schema.yaml`):

| Prefix | Entity Type | Plane |
|--------|-------------|-------|
| MKT | market | market |
| MFR | market_force | market |
| CPR | competitor | market |
| EPL | ecosystem_player | market |
| OPP | opportunity | market |
| BRD | brand | strategy |
| ACT | actor | strategy |
| NED | need | strategy |
| OFF | offering | strategy |
| POS | positioning | strategy |
| MSG | message | strategy |
| MHS | message_house | strategy |
| CHN | channel | activation |
| CMP | campaign | activation |
| PRG | program | activation |
| EVD | evidence | governance |
| DEC | decision | governance |
| RSK | risk | governance |
| TST | experiment | governance |
| MET | metric | governance |
| KPI | kpi | governance |

Full prefix table: 44 entity types across 4 planes.

## Relation Derivation

Relations are derived from `*_ref` and `*_refs` fields in entity data. The relation type is determined by a lookup table keyed on `(source_entity_type, ref_field_name)`. Common relation types:

- `backed-by` - entity → evidence (via `evidence_refs`)
- `targets-actor` - entity → actor (via `actor_refs`, `actors`)
- `solves-need` - offering → need (via `solves_needs`)
- `competes-with` - positioning → competitor (via `competitors`)
- `uses-message` - campaign → message (via `message_refs`)
- `proved-by` - message → proof_point (via `proof_points`)
- `supports` / `contradicts` - evidence → entity (via `supports`, `contradicts`)

## Module Structure

| File | Responsibility |
|------|---------------|
| `cli.mjs` | CLI entry point, output formatting, --stats mode |
| `build-model.mjs` | Model assembly - entities + relations + metadata |
| `extractor.mjs` | Entity extraction (ID walk) + relation derivation (ref fields) |
| `entity-types.mjs` | Prefix → type mapping, type → plane mapping |
