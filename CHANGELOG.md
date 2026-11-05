# Changelog

All notable changes to `@archally/brandvoice-schema` will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/) and this project uses [SemVer](https://semver.org/).

## [Unreleased]

## [1.8.0] - 2026-10-28

### Summary

- A brand-core file requires only `version`, so a file holding only tone, verbal, asset or personal-profile entries validates on its own and a model can split its brand core into several files.
- Compatibility: BACKWARD. No field becomes required and no constraint tightens, so every model valid under 1.7.0 stays valid and no instance change is required. A model that relies on the relaxation fails a 1.7.0 validator, so it declares `schemaVersion: "1.8.0"` in its root `brandvoice.yaml`.

### Changed

- `strategy/brand-core.schema.yaml`: root `required` is `[version]`; `brands` is no longer required in every brand-core file. The `brands` property and its item schema are unchanged.
- `schemaVersion` enum value `1.8.0` in `metamodel.schema.yaml`.
- The schema ships under `schema/v1.8/` and the package exports `./schema/v1.8/*`. Both worked examples live under `examples/<name>/.brandvoice/v1.8/` and declare `schemaVersion: "1.8.0"`. The validator, model builder and semantic checker default to `.brandvoice/v1.8`.
- **BREAKING for tool consumers: the semantic-checker engine is the [`@archally/semantic-checker`](https://github.com/archally/semantic-checker) package.** `tools/semantic-checker/` is a thin layer: an adapter (`BrandvoiceModel` to the engine's `CheckableModel`) plus the eight rules as declarative YAML (`rules/*.yaml`). The engine, severity handling, JSON-Schema rule validation and the TypeScript escape hatch come from the package, installed from GitHub as `github:archally/semantic-checker#v0.1.0`. The `brandvoice-check` CLI, its arguments, exit codes and `.brandvoice-lint.yaml` config are unchanged, and findings on the example models are identical. Code that imported the engine or rules from `tools/semantic-checker/dist` imports them from `@archally/semantic-checker`.
- Semantic-checker output is ordered deterministically by `(rule, entityId)`; the set of findings is unchanged.
- Tool READMEs and the README Quick Start give the commands as `npm run validate`, `npm run model` and `npm run check` from a clone of this repository.

### Added

- `npm run validate:examples` and `npm run check:examples` validate and check both worked examples.
- `npm run release:check` (`tools/port/release-check.mjs`) checks that `package.json`, `package-lock.json`, the top CHANGELOG release, the deployed schema and its exports, the README Quick Start and every worked example declare one release version, and that nothing newer is mixed in. `npm test` runs its tests and the validator's reference tests.
- A consumer-side TypeScript extension example, `tools/semantic-checker/examples/duplicate-display-name.{ts,rule.yaml}`, demonstrating the engine's escape hatch (flags entities sharing a display name). Not part of the default rule run.

## [1.7.0] - 2026-10-21

### Summary

- An evidence record can name the records that replace its claims, and an offering can state where it stands in its lifecycle and which offerings replace it.
- Compatibility: BACKWARD. Every field is optional and no field becomes required, so every model valid under 1.6.x stays valid; no instance change is required.

### Added

- `governance/evidence.schema.yaml`: `evidence_record.superseded_by`, an array of `evidence_ref` with `minItems: 1`. A record with this field is read as superseded rather than expired or fresh.
- `strategy/market-product.schema.yaml`: `offering.status`, enum `active`, `beta`, `deprioritized`, `sunset`, where `sunset` means still delivered to existing buyers and no longer offered to new ones; an absent status is not stated, not `active`. `offering.superseded_by`: an array of `offering_ref`, `minItems: 1`.
- `schemaVersion` enum values `1.6.2` and `1.7.0` in `metamodel.schema.yaml`, so a model can declare either release.
- Relations: the validator reports a `superseded_by` target that no entity declares as a cross-reference error, and the model builder extracts each `superseded_by` entry as a `superseded-by` relation. The schema requires the target to carry the source's own prefix: `EVD` for evidence, `OFF` for an offering.

## [1.6.2] - 2026-08-16

### Fixed

- `any_entity_ref` pattern in `metamodel.schema.yaml` now includes the `BSC` prefix — `brand_script` (`BSC###`, added in v1.3.0) records can now be referenced through `any_entity_ref` typed-ref fields.

### Added

- `governance/evidence.schema.yaml`: `type` enum gains `research`, `primary-research`, `primary-academic`, `thought-leadership`, `analyst-report`; `source_type` enum gains `peer-reviewed`, `academic-classic`, `practitioner-credible`, `industry-analysis`, `industry-consortium`, `secondary-research`, `survey`, `internal-analysis`, `primary-data` — additional evidence-source credibility and research-method classes.
- `metamodel.schema.yaml`: an `x-gdsm.modeling_guidance` ledger — durable, reusable brandvoice modeling guidance (plane-vs-layer semantics, entity nesting for `white_space`/`message_pillar`, multi-plane entity placement, competitor/market-force dedup-by-name), served on demand by the brandvoice MCP's `get_analysis_guidance` tool (Archally Pro).

## [1.6.1] - 2026-05-27

### Summary

- **Ecosystem modeling** (v1.6.0): Added `ecosystem_player (EPL###)` in `market/ecosystem.schema.yaml` — a first-class entity for referral partners, co-presenters, distribution channels, complementary experts, and coopetition peers. Distinct from competitor (CPR): competitors frame competitive threat; ecosystem players frame cooperative value.
- **Bug fixes** (v1.6.1): Schema refinements and validation improvements.

### Added

- **`market/ecosystem.schema.yaml`** — new schema file for ecosystem modeling.
- **`ecosystem_player_ref (EPL###)`** in `metamodel.schema.yaml`.
- **`schemaVersion` enum values:** `1.6.0` and `1.6.1` in `metamodel.schema.yaml`.
- **`any_entity_ref` pattern** extended to include `EPL` prefix.

## [1.5.0] - 2026-04-06

### Summary

- Adds **capacity planning** entities to the strategy plane: `priority_stream (PRI###)` for prioritized revenue/service streams and `roadmap_phase (RMP###)` for quarterly delivery phases.
- Introduces `strategy/capacity.schema.yaml` as the schema file for `strategy/capacity-priorities.yaml` files.
- Backward-compatible: every existing v1.4.0 model continues to validate unchanged.

### Added

- **`strategy/capacity.schema.yaml`** — new schema file covering:
  - `$defs/priority_stream` — PRI### entities with `name`, `priority`, `rationale`, `time_investment`, `revenue_estimate`, `strategic_value`, `timing`, `dependencies[]`, `offering_ref`, `opportunity_ref`, `evidence_refs`.
  - `$defs/roadmap_phase` — RMP### entities with `name`, `period`, `goals[]`, `budget`, `kpi`, `evidence_refs`.
  - `$defs/capacity_model` — non-entity scalar config block (working-day allocation); not extracted as a graph entity.
  - Top-level arrays: `priority_streams[]`, `roadmap[]`, `operational_risks[]`.
- **`$defs/priority_stream_ref (PRI###)`** in `metamodel.schema.yaml`.
- **`$defs/roadmap_phase_ref (RMP###)`** in `metamodel.schema.yaml`.
- **`schemaVersion` enum value:** `"1.5.0"` in `metamodel.schema.yaml`.
- **`any_entity_ref` pattern** extended to include `PRI` and `RMP` prefixes.

### Migration notes for authors

- No migration required for existing models. Bump `schemaVersion` to `1.5.0` when adding a `strategy/capacity-priorities.yaml` file.
- Roadmap phases **must have an `id` field** (`RMP###`) to be extracted as graph entities. Add `name` for the display label; `period` for the calendar span.

## [1.4.0] - 2026-04-06

### Summary

- Adds optional **`geo_scope`** to market-level records so multi-region brandvoice portfolios can tag geographic applicability and provenance without breaking models that never set it.
- Backward-compatible: every existing v1.1.0 / v1.3.0 model continues to validate unchanged.

### Added

- **`$defs/geo_scope`** in `metamodel.schema.yaml` — reusable object with:
  - `level` enum: `local | country | europe | global` (required).
  - `countries[]` — ISO 3166-1 alpha-2 codes; `minItems: 1` and `uniqueItems: true` when present; **required** when `level = country` (enforced via `if/then`).
  - `region_label` — free-text label like `DACH`, `Nordics`, `Benelux`.
  - `notes` — rationale / caveats.
- Optional **`geo_scope`** property on seven market-level entity types:
  `evidence_record`, `market_definition`, `market_force`, `competitor_profile`, `competitor`, `opportunity`, `risk`.
- **`schemaVersion` enum value:** `1.4.0` in `metamodel.schema.yaml`.

### Migration notes for authors

- No migration required. Bump `schemaVersion` to `1.4.0` only when you start using `geo_scope`.

## [1.3.0] - 2026-04-03

### Summary

- Introduces **multiple narrative scripts per brand** (StoryBrand / SB7-style backbones and other frameworks), identified as **`BSC###`**, with optional links from **`MSG###`** rows.
- Extracts shared **`narrative_backbone`** shape for reuse on **`brand`** (legacy/denormalized) and **`brand_script`** (canonical per script).

### Added

- **`brand_script_ref (BSC###)`** in `metamodel.schema.yaml`.
- **`strategy.brand_core.brand_scripts[]`** with `id`, `name`, `brand_ref`, `narrative`.
- **`$defs/narrative_backbone`** — shared object for framework-specific story fields.
- **`strategy.messaging.message.brand_script_ref`** — ties a message to a specific script.

## [1.1.0] - 2026-03-25

### Summary

- Reorganized and expanded the schema while keeping the four-plane model intact.
- Strengthened brand strategy, personal brand, message systems, and integrated campaign planning.

### Breaking

- Bumped `schemaVersion` from `1.0.0` to `1.1.0`.
- Removed strategy-local `markets[]`; strategy now references canonical `MKT###` through `market_refs`.
- Changed `verbal_guidelines[].id` from `TON###` to `VRB###`.
- Changed `white_space_refs` from free-form strings to `WSP###` references.

### Added

- New ID refs: `VRB###`, `PBP###`, `MHS###`, `MPL###`, `PRG###`, `CPL###`, `WSP###`.
- `personal_brand_profiles[]` for founder/expert-led voice systems.
- Portfolio-aware brand fields (`brand_role`, `architecture_role`, parent/child refs).
- `message_houses[]` and pillar modeling for roof-claim / pillar / proof architecture.
- `programs[]` for always-on or multi-campaign initiatives.
- `content_pillars[]` for recurring editorial authority themes.
- Stronger source metadata on evidence: `source_type`, `source_url`, `publisher`.

## [1.0.0] - 2026-02-24

### Added

- Initial brandvoice schema suite with four planes: Market, Strategy, Activation, Governance.
- Root composition schema: `brandvoice.schema.yaml`.
- Cross-cutting metamodel: `metamodel.schema.yaml`.
- Migration schema: `migration.schema.yaml`.
- Strategy plane: `brand-core`, `market-product`, `messaging`.
- Activation plane: `channels`, `campaigns`.
- Governance plane: `measurement`, `decisions`, `experiments`.
- Optional profile mechanism for framework patterns (SB7, JTBD, AARRR, RACE).
- Optional interoperability links to blueprint schema entities.
