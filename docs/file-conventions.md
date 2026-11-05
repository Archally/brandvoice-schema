# Brandvoice 1.8.0 File Conventions

Practical rules for organizing `.brandvoice/` directories. These conventions apply to any project using the schema, regardless of size.

---

## Directory Structure

A fully populated brandvoice model:

```
my-brand/
  .brandvoice/v1.8/
    brandvoice.yaml                        # Required: root metadata + plane composition

    market/
      landscape.market.yaml                # Markets (MKT), market forces (MFR)
      direct.competition.market.yaml       # Direct competitors (CPR)
      substitutes.competition.market.yaml  # Substitute competitors (CPR)
      opportunities.market.yaml            # Opportunities (OPP), position maps (PMP), white spaces (WSP)
      ecosystem.market.yaml                # Ecosystem players (EPL)

    strategy/
      brand-core.strategy.yaml             # Brands (BRD), archetypes (ARC), tone (TON),
                                           #   verbal guidelines (VRB), assets (AST),
                                           #   brand scripts (BSC), personal brands (PBP)
      audiences.market-product.strategy.yaml  # Actors (ACT), audiences (AUD), personas (PER),
                                              #   needs (NED), jobs (JOB), contexts (CTX)
      offerings.market-product.strategy.yaml  # Offerings (OFF), positioning (POS),
                                              #   value propositions (VAL), business model (BMD)
      messaging.strategy.yaml              # Message houses (MHS), messages (MSG),
                                           #   journey stages (JSG), actions (ACN),
                                           #   outcomes (OUT), proof points (PRF)
      visual-identity.strategy.yaml        # Logo, color, typography, imagery
      capacity-priorities.strategy.yaml    # Priority streams (PRI), roadmap phases (RMP)

    activation/
      channels.activation.yaml             # Channels (CHN)
      content.campaigns.activation.yaml    # Campaigns (CMP), programs (PRG),
                                           #   content pillars (CPL), content assets (CNT)

    governance/
      competitive.evidence.governance.yaml # Evidence from competitive research
      market.evidence.governance.yaml      # Evidence from market research
      customer.evidence.governance.yaml    # Evidence from customer interviews/surveys
      decisions.governance.yaml            # Decisions (DEC), risks (RSK)
      experiments.governance.yaml          # Experiments (TST)
      measurement.governance.yaml          # Metrics (MET), KPIs (KPI)
```

A minimal brandvoice model (Phase 1):

```
my-brand/
  .brandvoice/v1.8/
    brandvoice.yaml
    market/
      landscape.market.yaml
    strategy/
      brand-core.strategy.yaml
      market-product.strategy.yaml
      messaging.strategy.yaml
    governance/
      evidence.governance.yaml
```

---

## File Naming Convention

Files use a `{semantic-stem}.{plane-subkey}.{plane}.yaml` naming pattern:

```
{semantic-stem}.{plane-subkey}.{plane}.yaml
 ^               ^               ^
 |               |               +-- plane directory name (market, strategy, activation, governance)
 |               +-- schema subkey the loader maps to (see table below)
 +-- descriptive prefix (optional, split by semantic cluster)
```

When there is no semantic prefix, the file name is just `{plane-subkey}.{plane}.yaml`.

### Loader Subkey Mapping

The loader uses the file name stem (before extensions) to determine which schema slot the file maps to:

| Plane | File Stem Prefix | Maps To Schema Slot |
|-------|-----------------|-------------------|
| market | `landscape*` | `market.landscape` |
| market | `competition*`, `substitutes*` | `market.competition` |
| market | `opportunities*`, `cross-domain*` | `market.opportunities` |
| market | `ecosystem*` | `market.ecosystem` |
| strategy | `brand-core*` | `strategy.brand_core` |
| strategy | `market-product*` | `strategy.market_product` |
| strategy | `messaging*`, `messages*` | `strategy.messaging` |
| strategy | `visual-identity*` | `strategy.visual_identity` |
| strategy | `capacity-priorities*` | `strategy.capacity_priorities` |
| governance | `evidence*`, `research-evidence*` | `governance.evidence` |
| governance | `measurement*` | `governance.measurement` |
| governance | `decisions*` | `governance.decisions` |
| governance | `experiments*` | `governance.experiments` |
| activation | `channels*` | `activation.channels` |
| activation | `campaigns*`, `content*` | `activation.campaigns` |

The asterisk indicates that any prefix before the stem is treated as a semantic grouping. For example, `direct.competition.market.yaml` and `substitutes.competition.market.yaml` both map to `market.competition` because their stems start with `competition` and `substitutes` respectively (the loader recognizes `substitutes*` as the competition slot).

---

## How the Loader Merges Files

The loader (`loadBrandvoice()`) processes files in two phases:

### Phase 1: Root Composition via `$ref`

The root `brandvoice.yaml` can wire plane slots to separate files using `$ref` placeholders:

```yaml
# brandvoice.yaml
version: "1.0.0"
schemaVersion: "1.8.0"
name: "My Brand"
market:
  landscape:
    $ref: "market/landscape.market.yaml"
  competition:
    $ref: "market/direct.competition.market.yaml"
```

Referenced files are loaded and validated against their plane schema. The `$ref` placeholder is a well-formed `{ $ref: "path" }` object -- the root schema accepts it via `file_ref_placeholder`.

### Phase 2: Supplementary File Discovery

After resolving all `$ref` targets, the loader scans each plane subdirectory (`market/`, `strategy/`, `activation/`, `governance/`) for YAML files that were NOT already loaded via `$ref`. These supplementary files are merged into the composed model.

**Merge rules:**

1. **Metadata fields are skipped.** `version`, `schemaVersion`, `scope`, and `tags` from supplementary files are ignored (the root file's metadata takes precedence).
2. **Arrays are concatenated.** If the target slot already has an array (e.g., `competitors[]`), new items are appended. No deduplication -- the validator checks for duplicate IDs after merge.
3. **Scalars are overwritten.** Non-array values from supplementary files replace existing values in the target slot (last file wins, alphabetical order).
4. **File order is alphabetical.** Files within a directory are sorted by name before processing.

This means you can split `competition` data across multiple files (`direct.competition.market.yaml`, `substitutes.competition.market.yaml`) and the loader will concatenate their `competitors[]` arrays into a single list.

### What Gets Skipped

- Files already loaded via `$ref` (no double-loading)
- Files that parse to non-object values (warning emitted)
- Files whose stem does not match any known subkey (merged into the plane root)

---

## Scoped IDs vs Plain IDs

Entity IDs support an optional scope prefix: `{scope}.{PREFIX}{NNN}`.

### Plain IDs

Use plain IDs (`CPR001`, `NED003`) when:

- The model is small (< 50 entities)
- All entities of a type live in one file
- No risk of ID collision

### Scoped IDs

Use scoped IDs (`market.CPR001`, `direct.CPR001`) when:

- Multiple files contribute entities of the same type
- A multi-brand portfolio has overlapping entity ranges per brand
- You want IDs to carry semantic context

Scoped IDs use a kebab-case prefix: `^[a-z][a-z0-9-]*\.{PREFIX}\d{3,}$`.

```yaml
# direct.competition.market.yaml
competitors:
  - id: direct.CPR001
    name: "Competitor A"
    type: direct

# substitutes.competition.market.yaml
competitors:
  - id: substitutes.CPR001
    name: "Manual Spreadsheet Tracking"
    type: substitute
```

References from other entities must use the full scoped ID:

```yaml
# strategy/market-product.strategy.yaml
positioning:
  - id: POS001
    competitors: [direct.CPR001, substitutes.CPR001]
```

---

## `brandvoice.yaml` Root File

The root file is the only required file. Minimal valid content:

```yaml
version: "1.0.0"
schemaVersion: "1.8.0"
name: "My Brand"
```

Full root file with all plane slots wired:

```yaml
version: "1.0.0"
schemaVersion: "1.8.0"
name: "My Brand"
description: "Brief summary of brand scope and market context."
scope: my-brand
tags: [saas, b2b]

market:
  landscape:
    $ref: "market/landscape.market.yaml"
  competition:
    $ref: "market/direct.competition.market.yaml"
  opportunities:
    $ref: "market/opportunities.market.yaml"
  ecosystem:
    $ref: "market/ecosystem.market.yaml"

strategy:
  brand_core:
    $ref: "strategy/brand-core.strategy.yaml"
  market_product:
    $ref: "strategy/market-product.strategy.yaml"
  messaging:
    $ref: "strategy/messaging.strategy.yaml"
  visual_identity:
    $ref: "strategy/visual-identity.strategy.yaml"

activation:
  channels:
    $ref: "activation/channels.activation.yaml"
  campaigns:
    $ref: "activation/content.campaigns.activation.yaml"

governance:
  measurement:
    $ref: "governance/measurement.governance.yaml"
  decisions:
    $ref: "governance/decisions.governance.yaml"
  evidence:
    $ref: "governance/evidence.governance.yaml"
  experiments:
    $ref: "governance/experiments.governance.yaml"

profiles:
  - name: sb7
    category: messaging
    status: active
    applies_to: [strategy.brand_core, strategy.messaging]
```

The `$ref` wiring is optional. If you omit it, the loader discovers supplementary files from the plane subdirectories automatically. Explicit `$ref` wiring is recommended for clarity -- it makes the composition visible in the root file.

Custom plane slot names (beyond the standard ones) are allowed via `additionalProperties` but must use the `$ref` placeholder form. This supports project-specific extensions like `cross_domain_opportunities`, `capacity_priorities`, or `research_evidence`.

---

## When to Split Files

Split a file when any of these apply:

| Signal | Threshold | Action |
|--------|-----------|--------|
| File length | > 350 lines | Split by semantic cluster |
| Entity count | > 20 entities of the same type | Split by grouping (e.g., direct vs. substitute competitors) |
| Natural semantic boundary | Distinct subgroups exist | Create one file per subgroup |
| Different evidence provenance | Market research vs. customer interviews | Separate evidence files by source type |

### Splitting Evidence Files

Evidence accumulates fast. Split by provenance:

```
governance/
  competitive.evidence.governance.yaml    # CPR-related research
  market.evidence.governance.yaml         # Industry reports, sizing data
  customer.evidence.governance.yaml       # Interviews, surveys, analytics
```

### Splitting Competitor Files

Separate by competitor type for focused analysis:

```
market/
  direct.competition.market.yaml          # Direct competitors
  substitutes.competition.market.yaml     # Non-product alternatives
```

### Splitting Market-Product Files

When the strategy plane grows beyond 30 entities:

```
strategy/
  audiences.market-product.strategy.yaml  # Actors, audiences, personas, needs
  offerings.market-product.strategy.yaml  # Offerings, positioning, value propositions
```

### When NOT to Split

Keep a single file when:

- Fewer than 20 entities of that type
- All entities belong to the same semantic cluster
- The file is under 200 lines
- Splitting would create files with only 2-3 entities each

---

## Validation

Validate a brandvoice directory:

```bash
npm run validate -- .brandvoice/v1.8
```

The validator:
1. Loads and composes all files via the loader
2. Validates each plane file against its schema (Ajv, JSON Schema draft-2020-12)
3. Checks entity ID uniqueness across the composed model
4. Reports reference integrity issues (dangling refs to non-existent entities)

Validation runs per-file against each plane's schema. The root `brandvoice.yaml` accepts both inline plane content and `$ref` placeholders -- the per-file validator handles each referenced file independently.

## Editor schema association

Use a YAML editor that supports JSON Schema associations. Associate model files
with the matching file in `schema/v1.8/`. For example, in VS Code with the YAML
extension, set `yaml.schemas` to associate the local
`./schema/v1.8/brandvoice.schema.yaml` with `**/.brandvoice/v1.8/brandvoice.yaml`.
Plane file associations use their matching schema, such as
`strategy/brand-core.schema.yaml` for `**/brand-core.strategy.yaml`.
The editor checks individual files; run `npm run validate:examples` for the
worked examples and use the validator on your own model for reference checks.
