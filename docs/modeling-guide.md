# Brandvoice 1.8.0 Modeling Guide

How to build effective brandvoice models -- from a blank directory to a comprehensive brand strategy specification.

---

## Core Philosophy

### Evidence-first, not assertion-first

Every market claim, competitive comparison, and positioning statement should link to evidence records (`EVD###`). Claims without evidence are hypotheses, not facts. Tag evidence with confidence levels: `hypothesis`, `weak-signal`, `moderate-evidence`, `strong-evidence`. Be honest about what you know versus what you assume.

### Single authoritative location

Every fact has exactly one source. When the same entity type appears in multiple schema files (e.g., `CPR###` in both `market/competition.yaml` and `strategy/market-product.yaml`), one file owns the detail and the other provides a lightweight view. The market-plane competitor profile (`competition.yaml`) owns pricing, need-fit, competitive moves. The strategy-plane competitor (`market-product.yaml`) keeps a lightweight version for positioning context.

| Fact | Authoritative Source | Reference View |
|------|---------------------|---------------|
| Competitor depth (pricing, moves) | `market/competition.yaml` | `strategy/market-product.yaml` |
| Market sizing | `market/landscape.yaml` | `strategy/market-product.yaml` (via `market_refs`) |
| Message architecture | `strategy/messaging.yaml` | `activation/campaigns.yaml` (via `message_refs`) |
| Metric definitions | `governance/measurement.yaml` | `activation/campaigns.yaml` (via `north_star`, `guardrail_metrics`) |

### Planes in order

Model the planes in dependency order. Market plane first (external reality exists independently), then strategy (the brand's response), then activation (execution of strategy), then governance (proof and learning). Each plane builds on the previous one through typed references.

---

## Three Phases

### Phase 1: Market + Strategy Core (25-60 entities)

Build the structural foundation: who the market is, who the brand is, what needs exist, and how the brand positions itself.

**Market plane -- model these first:**

- 1-3 markets (`MKT###`) with category, maturity, growth rate
- 3-5 market forces (`MFR###`) with direction and time horizon
- 3-8 competitors (`CPR###`) covering direct, indirect, and at least one substitute
- 1-3 opportunities (`OPP###`) with thesis and status

**Strategy plane -- model these second:**

- 1 brand (`BRD###`) with purpose, promise, and values
- 3-6 actors (`ACT###`) with roles
- 5-10 needs (`NED###`) linked to actors
- 1-3 offerings (`OFF###`) linked to needs
- 1-2 positioning statements (`POS###`) with differentiated claims
- 3-5 messages (`MSG###`)
- 1 message house (`MHS###`) with pillars
- 2-4 journey stages (`JSG###`)
- 3-5 proof points (`PRF###`)

**Governance plane -- seed early:**

- 5-10 evidence records (`EVD###`) backing market claims

**Phase 1 explicitly defers:** visual identity, capacity planning, ecosystem players, programs, content pillars, content assets, experiments, metrics, KPIs, personal brand profiles, brand scripts.

### Phase 2: Activation + Detail (60-120 entities)

Bridge strategy to execution and deepen market intelligence.

**Activation plane:**

- 3-6 channels (`CHN###`) with media type and journey stage links
- 1-3 campaigns (`CMP###`) with objectives and channel/message refs
- 3-10 content assets (`CNT###`)
- 1-3 content pillars (`CPL###`)

**Strategy depth:**

- Personas (`PER###`) with empathy maps
- Audiences (`AUD###`) for legacy/segment views
- Jobs-to-be-done (`JOB###`)
- Value propositions (`VAL###`) with pain relievers and gain creators
- Brand scripts (`BSC###`) for multi-audience narratives
- Tone guidelines (`TON###`) with quantitative dimensions
- Verbal guidelines (`VRB###`)
- Visual identity (logo, color, typography)

**Market depth:**

- Extended competitor profiles with pricing, need-fit, competitive moves
- Position maps (`PMP###`) and white spaces (`WSP###`)
- Ecosystem players (`EPL###`)

### Phase 3: Governance + Depth (120-200+ entities)

Complete the learning loop with measurement, experimentation, and capacity planning.

**Governance:**

- Metrics (`MET###`) with formulas and cadence
- KPIs (`KPI###`) linking metrics to targets
- Experiments (`TST###`) with variants and success criteria
- Decisions (`DEC###`) with rationale and impact links
- Risks (`RSK###`) with likelihood and mitigation

**Strategy depth:**

- Priority streams (`PRI###`) for revenue prioritization
- Roadmap phases (`RMP###`)
- Business model elements (`BMD###`)
- Personal brand profiles (`PBP###`)
- Distinctive assets (`AST###`)

**Activation depth:**

- Programs (`PRG###`) coordinating multi-campaign initiatives
- Complete content asset inventory
- Budget and milestone detail on campaigns

---

## Quality Gates

### Phase 1 Gate

- [ ] Every market claim links to at least one `EVD###`
- [ ] Every need links to at least one actor
- [ ] At least one positioning statement with differentiated claim
- [ ] Brand has purpose, promise, and at least 2 values
- [ ] Message house has roof claim and at least 2 pillars
- [ ] Model validates clean (`npm run validate -- /path/to/my-brand/.brandvoice/v1.8 --schemas schema/v1.8`)

### Phase 2 Gate

- [ ] Every channel links to at least one journey stage
- [ ] Every campaign links to messages and channels
- [ ] Competitor profiles have need-fit assessments for top 3 needs
- [ ] Tone guidelines have quantitative dimensions (all four: humor, formality, respect, enthusiasm)
- [ ] At least one persona has an empathy map
- [ ] Content assets link to campaigns and messages

### Phase 3 Gate

- [ ] Every KPI links to a metric with a formula
- [ ] At least one experiment is designed per strategic hypothesis
- [ ] Decisions reference the evidence that informed them
- [ ] Risks have mitigation strategies
- [ ] Evidence records have confidence levels

---

## Anti-Patterns

| # | Name | What Goes Wrong | Fix |
|---|------|----------------|-----|
| AP01 | Assertion-first modeling | Market claims, positioning, and competitor assessments written without evidence records | Create `EVD###` records first, then link claims to them. Unlinked claims are hypotheses. |
| AP02 | Monolithic files | Single 500-line `market-product.yaml` covering all actors, needs, offerings, positioning | Split by semantic cluster: `audiences.market-product.yaml`, `offerings.market-product.yaml`. See [File Conventions](file-conventions.md). |
| AP03 | Premature activation | Defining campaigns and content before positioning and messaging are stable | Complete Phase 1 fully before starting activation entities. Campaigns without strategic grounding drift. |
| AP04 | Orphaned entities | Entities defined but never referenced by any other entity | Every entity should participate in at least one relation. Orphans indicate missing connections or unnecessary entities. |
| AP05 | ID collisions | Same `CPR001` in two files without scoped IDs | Use scoped IDs (`market.CPR001`, `strategy.CPR001`) when splitting across files. Or use the same CPR ID deliberately when both files describe the same competitor at different depths. |
| AP06 | Evidence hoarding | 50+ evidence records in a single file with no structure | Split evidence by topic: `competitive.evidence.yaml`, `market.evidence.yaml`, `customer.evidence.yaml`. |
| AP07 | Message-first strategy | Writing messages before defining actors, needs, and positioning | Messages derive from positioning; positioning derives from market analysis. Follow the plane order: market -> strategy -> activation. |

---

## Decision Trees

### When to Split Files

```
File > 350 lines?
  YES --> Split by semantic cluster
  NO  --> Content has 2+ distinct clusters?
            YES --> Split if each cluster > 100 lines
            NO  --> Keep single file
```

See [File Conventions](file-conventions.md) for naming patterns and loader behavior.

### When to Use Scoped IDs

```
Model has multiple files in the same plane subdir?
  YES --> Are IDs unique across files without scope?
            YES --> Plain IDs are fine
            NO  --> Use scoped IDs: {scope}.{PREFIX}{NNN}
  NO  --> Plain IDs are fine
```

Scoped IDs are recommended when:
- Multiple files contribute entities to the same plane slot (e.g., two competition files)
- A multi-brand portfolio has overlapping entity types per brand
- You want the ID to carry semantic context (e.g., `market.CPR001` vs `strategy.CPR001`)

### When to Add Evidence

```
Is this a factual claim about the market?
  YES --> Create EVD### and link it
Is this a competitive assessment?
  YES --> Create EVD### with source and observed_at date
Is this a strategic choice (positioning, messaging)?
  YES --> Link to existing evidence or create new record with confidence: hypothesis
Is this internal preference (tone, verbal guideline)?
  NO  --> Evidence optional but recommended for contested choices
```

### Competitor: Market Plane or Strategy Plane?

```
Need pricing, need-fit, competitive moves, switching cost?
  YES --> Market plane (market/competition.yaml) -- full CPR### profile
  NO  --> Is this just for positioning context (strengths, weaknesses, threat_level)?
            YES --> Strategy plane (strategy/market-product.yaml) -- lightweight CPR###
```

Both files can share the same `CPR###` ID. The market plane owns the extended profile; the strategy plane has a lightweight version for positioning context.

### Ecosystem Player or Competitor?

```
Primary frame is COOPERATION (referrals, co-presenting, distribution)?
  YES --> Ecosystem player (EPL###) in market/ecosystem.yaml
  NO  --> Primary frame is COMPETITION (threat, switching, need-fit)?
            YES --> Competitor (CPR###) in market/competition.yaml
            BOTH --> Create EPL### with also_competitor_ref pointing to CPR###
```

---

## Modeling Patterns

### Multi-Brand Portfolio

For organizations with multiple brands, use `brand_role` and `architecture_role` on each `BRD###`:

```yaml
brands:
  - id: BRD001
    name: "Acme Corp"
    brand_role: organization
    architecture_role: master-brand
    purpose: "..."
    promise: "..."

  - id: BRD002
    name: "Acme Pro"
    brand_role: product
    architecture_role: endorsed-brand
    parent_brand_ref: BRD001
    purpose: "..."
    promise: "..."
```

Scope audiences, personas, and messages to specific brands using `brand_ref` on those entities.

### Narrative Scripts for Multiple Audiences

When one brand needs different narrative backbones for different audiences, use `BSC###` entries instead of overloading the brand's `narrative` field:

```yaml
brand_scripts:
  - id: BSC001
    name: "Developer Story"
    brand_ref: BRD001
    is_default: true
    primary_audience_refs: [AUD001]
    narrative:
      framework: sb7
      hero: "The developer drowning in boilerplate"
      problem: "Building from scratch wastes weeks"
      guide: "Acme's SDK"
      plan: "Install, configure, ship"
      call_to_action: "Start free"
      success: "Ship in days, not months"
      failure: "Another quarter of custom plumbing"

  - id: BSC002
    name: "CTO Story"
    brand_ref: BRD001
    primary_audience_refs: [AUD002]
    narrative:
      framework: sb7
      hero: "The CTO under delivery pressure"
      problem: "Team velocity stalls on infrastructure"
      guide: "Acme's platform"
      plan: "Evaluate, pilot, adopt"
      call_to_action: "Request a pilot"
      success: "2x team velocity, predictable costs"
      failure: "Continued talent churn and missed deadlines"
```

### Evidence-Backed Opportunity Thesis

An opportunity should read as a testable hypothesis, not a wish:

```yaml
opportunities:
  - id: OPP001
    name: "Underserved SMB automation"
    thesis: >
      We believe SMB operations managers (ACT002) need affordable process
      automation (NED003) that is poorly-met by enterprise tools (CPR001,
      CPR003) because of pricing barriers. Given the AI adoption force
      (MFR001), there is a window to offer accessible AI-powered workflows
      before enterprise vendors move downmarket.
    status: validating
    target_actors: [ACT002]
    unmet_needs: [NED003]
    demand_intensity: strong
    buyer_readiness: solution-aware
    enabling_forces: [MFR001]
    blocking_forces: [MFR004]
    estimated_size: "20% of $800M SAM = $160M"
    confidence: moderate-evidence
    validated_by: [EVD005, EVD008]
    invalidated_by: []
```
