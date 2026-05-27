# Brandvoice Schema Reference

Complete reference for Archally Brandvoice Schema v1.6.1. Covers entity types, ID patterns, planes, relation types, versioning, and traceability.

---

## 1. What is a Brandvoice?

A brandvoice is a single formal model of a brand's communication strategy -- one source that captures what the market looks like, how the brand responds, how it activates through channels and campaigns, and how it proves what works. It replaces scattered artifacts (slide decks, agency briefs, Notion boards, tribal memory) with a structured, validated, version-controlled specification.

Every schema field carries a machine-readable `description`. AI agents consume brandvoice models as structured domain context via MCP servers -- deterministic graph queries against a validated formal model, not retrieval over unstructured documents. The same brandvoice that onboards a new team member also grounds an AI agent's reasoning about brand strategy.

---

## 2. Architecture

Four planes plus one cross-cutting metamodel:

```
+--------------------------------------------------------------+
|                        METAMODEL                              |
|   Typed IDs . versioning . geo scope . evidence levels .      |
|   shared vocab . framework profiles . blueprint interop       |
+----------+----------+----------+----------+------------------+
           |          |          |          |
    +------+---+ +----+-----+ +-+-------+ ++-----------+
    |  MARKET  | | STRATEGY | |ACTIVATION| |GOVERNANCE  |
    | External | | Brand    | |Execution | |Proof &     |
    | Reality  | | Response | |          | |Learning    |
    |          | |          | |          | |            |
    |landscape | |brand-core| |channels  | |evidence    |
    |competit. | |market-   | |campaigns | |decisions   |
    |opportun. | | product  | |          | |experiments |
    |ecosystem | |messaging | |          | |measurement |
    |          | |visual-id | |          | |            |
    |          | |capacity  | |          | |            |
    +----------+ +----------+ +----------+ +------------+
```

- **Market Plane** -- external reality the brand responds to. Sizing, forces, competitive landscape, opportunities, ecosystem partners.
- **Strategy Plane** -- why and for whom the brand creates value. Identity, positioning, messaging architecture, visual system, capacity planning.
- **Activation Plane** -- where and how strategy is executed. Channels, campaigns, programs, content pillars, content assets.
- **Governance Plane** -- evidence, experimentation, and decision traceability. Evidence records, decisions, risks, experiments, measurable outcomes.

---

## 3. Schema Inventory

| # | Schema File | Plane | Purpose | Key Entities |
|---|-------------|-------|---------|-------------|
| 1 | `brandvoice.schema.yaml` | Root | Root composition, metadata, plane slots | -- |
| 2 | `metamodel.schema.yaml` | Cross-cutting | Typed ID refs, versioning, geo scope, shared vocabulary | -- |
| 3 | `migration.schema.yaml` | Cross-cutting | Model evolution records | MIG |
| 4 | `market/landscape.schema.yaml` | Market | Market definitions, sizing (TAM/SAM/SOM), forces | MKT, MFR |
| 5 | `market/competition.schema.yaml` | Market | Competitor profiles, pricing, need-fit analysis | CPR |
| 6 | `market/opportunities.schema.yaml` | Market | Opportunity theses, position maps, white spaces | OPP, PMP, WSP |
| 7 | `market/ecosystem.schema.yaml` | Market | Ecosystem players -- partners, co-presenters, coopetition | EPL |
| 8 | `strategy/brand-core.schema.yaml` | Strategy | Brand identity, narrative, archetypes, tone, verbal guidelines, personal brands | BRD, BSC, ARC, TON, VRB, AST, PBP |
| 9 | `strategy/market-product.schema.yaml` | Strategy | Actors, needs, offerings, competitors (lightweight), positioning, business model | ACT, NED, OFF, CPR, CTX, AUD, PER, JOB, VAL, POS, BMD |
| 10 | `strategy/messaging.schema.yaml` | Strategy | Message houses, messages, journey stages, actions, outcomes, proof points | MHS, MPL, MSG, JSG, ACN, OUT, PRF |
| 11 | `strategy/visual-identity.schema.yaml` | Strategy | Logo systems, color palettes, typography, imagery, iconography | -- (non-entity) |
| 12 | `strategy/capacity.schema.yaml` | Strategy | Priority streams, roadmap phases, capacity model | PRI, RMP |
| 13 | `activation/channels.schema.yaml` | Activation | Channel portfolio with actor/context/journey links | CHN |
| 14 | `activation/campaigns.schema.yaml` | Activation | Programs, campaigns, content pillars, content assets | CMP, PRG, CPL, CNT |
| 15 | `governance/evidence.schema.yaml` | Governance | Evidence records with source metadata and geo scope | EVD |
| 16 | `governance/decisions.schema.yaml` | Governance | Decisions (ADR-style), risks | DEC, RSK |
| 17 | `governance/experiments.schema.yaml` | Governance | Experiments (A/B tests, concept validation) | TST |
| 18 | `governance/measurement.schema.yaml` | Governance | Metrics, KPIs, measurable outcomes | MET, KPI |

---

## 4. Entity ID Patterns

All entity IDs use a 2-4 letter uppercase prefix followed by 3+ digits. IDs support an optional scope prefix in dot notation: `{scope}.{PREFIX}{NNN}` (e.g., `market.CPR001`).

Pattern: `^([a-z][a-z0-9-]*\.)?{PREFIX}\d{3,}$`

### Market Plane

| Prefix | Entity Type | Description |
|--------|-------------|-------------|
| `MKT` | market | Market definition with sizing and segmentation |
| `MFR` | market_force | Environmental force (PESTEL + industry/behavioral) |
| `CPR` | competitor | Competitor profile (direct, indirect, substitute, status-quo, potential-entrant) |
| `EPL` | ecosystem_player | Cooperation-oriented partner, co-presenter, distribution channel (v1.6.0) |
| `OPP` | opportunity | Strategic opportunity thesis with evidence backing |
| `PMP` | position_map | Competitive position map with axes and placements |
| `WSP` | white_space | Unoccupied region on a position map |

### Strategy Plane

| Prefix | Entity Type | Description |
|--------|-------------|-------------|
| `ACT` | actor | Who participates in buying/using/influencing |
| `NED` | need | Customer need, problem, or progress criterion |
| `OFF` | offering | What is offered to satisfy needs |
| `CTX` | context | Situational context shaping demand and decisions |
| `AUD` | audience | Audience segment (legacy; prefer actors) |
| `PER` | persona | Behavioral archetype of a segment with empathy map |
| `JOB` | job | Jobs-to-be-done statement |
| `VAL` | value_proposition | Value proposition with pain relievers and gain creators |
| `POS` | positioning | Market category choice and differentiated claim |
| `BMD` | business_model | Business model canvas / Lean Canvas element |
| `BRD` | brand | Brand identity with purpose, promise, narrative, SWOT |
| `BSC` | brand_script | Narrative backbone (SB7-style) scoped to one audience (v1.3.0) |
| `ARC` | archetype | Brand archetype (e.g., Creator, Sage) |
| `TON` | tone | Tone guideline with quantitative dimensions |
| `VRB` | verbal_guideline | Writing system rules (terminology, inclusivity, grammar) |
| `AST` | asset | Distinctive brand asset (verbal, visual, sonic, mnemonic) |
| `PBP` | personal_brand_profile | Founder/expert voice overlay on the brand system |
| `JSG` | journey_stage | Customer journey stage with universal phase mapping |
| `ACN` | action | Desired customer action at a journey stage |
| `OUT` | outcome | Measurable outcome tied to business impact |
| `PRF` | proof_point | Evidence-backed claim for messaging credibility |
| `MHS` | message_house | Roof claim + pillars + proof messaging architecture |
| `MPL` | message_pillar | Support pillar within a message house |
| `MSG` | message | Reusable communication unit with audience/channel targeting |
| `PRI` | priority_stream | Prioritized revenue or service stream (v1.5.0) |
| `RMP` | roadmap_phase | Quarterly or milestone delivery phase (v1.5.0) |

### Activation Plane

| Prefix | Entity Type | Description |
|--------|-------------|-------------|
| `CHN` | channel | Distribution channel (owned, paid, earned, shared) |
| `CMP` | campaign | Time-bounded campaign with creative brief and budget |
| `PRG` | program | Always-on or multi-campaign initiative |
| `CNT` | content_asset | Individual content piece (post, article, video, talk, etc.) |
| `CPL` | content_pillar | Recurring editorial authority theme |

### Governance Plane

| Prefix | Entity Type | Description |
|--------|-------------|-------------|
| `EVD` | evidence | Traceable evidence record with source metadata |
| `MET` | metric | Measurable quantity with formula and cadence |
| `KPI` | kpi | Key performance indicator linking metric to target |
| `TST` | experiment | Experiment (A/B test, concept test, survey) |
| `DEC` | decision | Strategic decision with rationale and alternatives |
| `RSK` | risk | Identified risk with likelihood, impact, mitigation |
| `MIG` | migration | Model evolution record |

---

## 5. Relation Types

Relations are derived from ref fields on entities. The extractor maps ref field names to semantic relation types:

| Ref Field | Relation Type | Direction | Description |
|-----------|---------------|-----------|-------------|
| `evidence_refs` | `backed-by` | source -> EVD | Entity is backed by evidence |
| `supports` | `supports` | EVD -> entity | Evidence supports an entity |
| `contradicts` | `contradicts` | EVD -> entity | Evidence challenges an entity |
| `supersedes` | `supersedes` | DEC -> DEC | Decision supersedes another |
| `validated_by` | `validated-by` | OPP -> EVD | Opportunity validated by evidence |
| `invalidated_by` | `invalidated-by` | OPP -> EVD | Opportunity invalidated by evidence |
| `actors` / `actor_refs` / `target_actors` | `targets-actor` | entity -> ACT | Entity targets an actor |
| `solves_needs` / `need_refs` | `solves-need` | OFF -> NED | Offering solves a need |
| `affected_needs` | `affects-need` | MFR -> NED | Force affects a need |
| `market_refs` / `target_markets` | `in-market` / `targets-market` | entity -> MKT | Entity operates in market |
| `competitor_refs` / `competitors` | `competes-with` | entity -> CPR | Entity competes with competitor |
| `opportunity_refs` | `captures-opportunity` | entity -> OPP | Entity captures an opportunity |
| `message_refs` | `uses-message` | entity -> MSG | Entity uses a message |
| `channel_refs` | `uses-channel` | entity -> CHN | Entity uses a channel |
| `outcome_refs` | `targets-outcome` | entity -> OUT | Entity targets an outcome |
| `campaign_refs` | `contains-campaign` | PRG -> CMP | Program contains campaign |
| `program_ref` / `program_refs` | `part-of-program` | entity -> PRG | Entity belongs to program |
| `message_house_refs` | `follows-message-house` | entity -> MHS | Entity follows message house |
| `positioning_refs` | `supports-positioning` | entity -> POS | Entity supports positioning |
| `proof_refs` / `proof_points` | `proved-by` | entity -> PRF | Entity is proved by proof point |
| `brand_ref` | `belongs-to-brand` | entity -> BRD | Entity belongs to brand |
| `brand_script_ref` | `uses-script` | MSG -> BSC | Message uses narrative script |
| `tone_refs` | `uses-tone` | entity -> TON | Entity uses tone guideline |
| `journey_stage_refs` | `at-stage` | entity -> JSG | Entity is at journey stage |
| `also_competitor_ref` | `also-competes-as` | EPL -> CPR | Ecosystem player is also a competitor |
| `success_metrics` / `measured_by` | `measured-by` | entity -> MET | Entity is measured by metric |
| `metric` | `tracks-metric` | KPI -> MET | KPI tracks a metric |

Ref fields not in this table are derived automatically: `{field_name}` without `_ref`/`_refs` suffix becomes `references-{field_name}` (e.g., `offering_ref` -> `references-offering`).

---

## 6. Per-Plane Entity Reference

### 6.1 Market Plane

#### Market (MKT)

Market definition with sizing and segmentation.

| Field | Type | Required | Description |
|-------|------|----------|-------------|
| `id` | `market_ref` | Yes | `MKT###` pattern |
| `name` | string | Yes | Human-readable market label |
| `category` | string | Yes | Industry vertical or category name |
| `description` | string | No | |
| `maturity` | enum | No | `emerging`, `growing`, `mature`, `declining` |
| `growth_rate` | string | No | Annual growth estimate (e.g., `12% CAGR 2024-2028`) |
| `sizing` | object | No | TAM/SAM/SOM tiers with methodology and evidence |
| `segments` | array | No | Market segments with actors, needs, sizing |
| `key_competitors` | `competitor_ref[]` | No | |
| `actors` | `actor_ref[]` | No | |
| `forces` | `market_force_ref[]` | No | |
| `evidence_refs` | `evidence_ref[]` | No | |
| `geo_scope` | object | No | Geographic applicability (v1.4.0) |

#### Market Force (MFR)

Environmental force shaping market dynamics. Aligns with PESTEL + industry/behavioral categories.

| Field | Type | Required | Description |
|-------|------|----------|-------------|
| `id` | `market_force_ref` | Yes | `MFR###` pattern |
| `name` | string | Yes | Force name |
| `force_type` | enum | Yes | `technological`, `economic`, `social`, `political`, `regulatory`, `environmental`, `industry`, `behavioral` |
| `direction` | enum | Yes | `emerging`, `accelerating`, `stable`, `decelerating`, `reversing` |
| `impact` | enum | No | `critical`, `high`, `medium`, `low` |
| `time_horizon` | enum | No | `immediate`, `near-term`, `medium-term`, `long-term` |
| `affected_needs` | `need_ref[]` | No | Needs this force amplifies or diminishes |
| `affected_actors` | `actor_ref[]` | No | Actors most impacted |
| `creates_opportunities` | `opportunity_ref[]` | No | |
| `confidence` | enum | No | `hypothesis`, `weak-signal`, `moderate-evidence`, `strong-evidence` |
| `evidence_refs` | `evidence_ref[]` | No | |
| `geo_scope` | object | No | Geographic applicability (v1.4.0) |

#### Competitor (CPR) -- Market Plane Profile

Extended competitor profile with pricing, need-fit, and competitive moves. Same CPR IDs as the lightweight version in strategy/market-product.

| Field | Type | Required | Description |
|-------|------|----------|-------------|
| `id` | `competitor_ref` | Yes | `CPR###` pattern |
| `name` | string | Yes | Competitor or substitute name |
| `type` | enum | Yes | `direct`, `indirect`, `substitute`, `status-quo`, `potential-entrant` |
| `description` | string | No | |
| `website` | string | No | |
| `pricing` | object | No | Model, currency, tiers, non-monetary cost |
| `need_fit` | array | No | Per-need fulfillment assessment with gaps |
| `competitive_moves` | array | No | Chronological record of significant actions |
| `strengths` | `string[]` | No | |
| `weaknesses` | array | No | With optional exploitable_by_refs and severity |
| `switching_cost` | enum | No | `none`, `low`, `moderate`, `high`, `prohibitive` |
| `threat_level` | enum | No | `critical`, `high`, `medium`, `low` |
| `evidence_refs` | `evidence_ref[]` | No | |
| `geo_scope` | object | No | Geographic applicability (v1.4.0) |

#### Opportunity (OPP)

Strategic opportunity thesis backed by evidence.

| Field | Type | Required | Description |
|-------|------|----------|-------------|
| `id` | `opportunity_ref` | Yes | `OPP###` pattern |
| `name` | string | Yes | Short opportunity label |
| `thesis` | string | Yes | Full strategic thesis |
| `status` | enum | Yes | `identified`, `exploring`, `validating`, `validated`, `pursued`, `abandoned` |
| `target_actors` | `actor_ref[]` | No | |
| `unmet_needs` | `need_ref[]` | No | |
| `demand_intensity` | enum | No | `latent`, `emerging`, `moderate`, `strong`, `urgent` |
| `buyer_readiness` | enum | No | `unaware`, `problem-aware`, `solution-aware`, `product-aware`, `ready-to-buy` |
| `enabling_forces` | `market_force_ref[]` | No | Forces that create this opportunity |
| `blocking_forces` | `market_force_ref[]` | No | Forces that threaten this opportunity |
| `estimated_size` | string | No | Revenue/volume potential |
| `validated_by` | `evidence_ref[]` | No | |
| `invalidated_by` | `evidence_ref[]` | No | |
| `confidence` | enum | No | Evidence level |
| `geo_scope` | object | No | Geographic applicability (v1.4.0) |

#### Position Map (PMP)

Competitive position map with axes, placements, and white space analysis.

| Field | Type | Required | Description |
|-------|------|----------|-------------|
| `id` | `position_map_ref` | Yes | `PMP###` pattern |
| `name` | string | Yes | Map title |
| `axes` | array (min 2) | Yes | Axis definitions with labels and buyer importance |
| `placements` | array | No | Entity positions on the map (0-100 per axis) |
| `white_spaces` | array | No | Unoccupied regions with demand signals |
| `market_refs` | `market_ref[]` | No | |

#### White Space (WSP)

Unoccupied region on a position map representing an opportunity gap.

| Field | Type | Required | Description |
|-------|------|----------|-------------|
| `id` | `white_space_ref` | Yes | `WSP###` pattern |
| `name` | string | Yes | White space label |
| `region` | object | Yes | Coordinate ranges defining this space on the map |
| `demand_intensity` | enum | No | Strength of buyer demand signal |
| `buyer_readiness` | enum | No | Dominant awareness level |
| `unmet_needs` | `need_ref[]` | No | |
| `willingness_to_pay` | object | No | Estimate with price sensitivity |

#### Ecosystem Player (EPL)

Cooperation-oriented profile for partners, co-presenters, distribution channels, and coopetition peers. Added in v1.6.0.

| Field | Type | Required | Description |
|-------|------|----------|-------------|
| `id` | `ecosystem_player_ref` | Yes | `EPL###` pattern |
| `name` | string | Yes | Person or organization name |
| `type` | enum | Yes | `individual`, `organization`, `community`, `platform`, `publication`, `event` |
| `relationship_type` | enum | Yes | `referral-partner`, `co-presenter`, `distribution-channel`, `complementary-expert`, `coopetition`, `community-ally`, `conference-network`, `content-peer`, `podcast-host`, `mentor`, `other` |
| `cooperation_potential` | string | No | Why this relationship matters |
| `also_competitor_ref` | `competitor_ref` | No | Link to CPR profile for coopetition case |
| `collaboration_ideas` | `string[]` | No | Concrete co-creation hypotheses |
| `status` | enum | No | `prospective`, `active`, `engaged`, `paused`, `lapsed` |
| `geo_scope` | object | No | Geographic applicability |

### 6.2 Strategy Plane

#### Brand (BRD)

Core brand identity with purpose, promise, values, narrative, and SWOT.

| Field | Type | Required | Description |
|-------|------|----------|-------------|
| `id` | `brand_ref` | Yes | `BRD###` pattern |
| `name` | string | Yes | |
| `promise` | string | Yes | Primary value promise to customers |
| `purpose` | string | Yes | Why the brand exists beyond revenue |
| `brand_role` | enum | No | `organization`, `product`, `service`, `portfolio`, `personal`, `initiative` |
| `architecture_role` | enum | No | `master-brand`, `endorsed-brand`, `sub-brand`, `standalone-brand`, `ingredient-brand` |
| `vision` | string | No | |
| `values` | `string[]` | No | Core decision principles |
| `personality` | `string[]` | No | Stable personality traits |
| `narrative` | object | No | Legacy/denormalized narrative backbone |
| `archetypes` | `archetype_ref[]` | No | |
| `tone_refs` | `tone_ref[]` | No | |
| `market_refs` | `market_ref[]` | No | |
| `swot` | object | No | SWOT snapshot with opportunity/risk linkage |
| `parent_brand_ref` | `brand_ref` | No | Portfolio parent or endorser |
| `child_brand_refs` | `brand_ref[]` | No | Sub-brands |

#### Actor (ACT)

Who participates in buying, using, or influencing.

| Field | Type | Required | Description |
|-------|------|----------|-------------|
| `id` | `actor_ref` | Yes | `ACT###` pattern |
| `name` | string | Yes | |
| `role` | enum | Yes | `buyer`, `user`, `influencer`, `champion`, `approver`, `gatekeeper`, `partner`, `internal` |
| `description` | string | No | |
| `characteristics` | `string[]` | No | |
| `priority` | enum | No | `critical`, `high`, `medium`, `low` |
| `evidence_refs` | `evidence_ref[]` | No | |

#### Need (NED)

Customer need, problem, or progress criterion.

| Field | Type | Required | Description |
|-------|------|----------|-------------|
| `id` | `need_ref` | Yes | `NED###` pattern |
| `statement` | string | Yes | Need statement |
| `actors` | `actor_ref[]` | Yes | Actors who have this need |
| `need_type` | enum | No | `functional`, `emotional`, `social`, `economic` |
| `urgency` | enum | No | `low`, `medium`, `high`, `critical` |
| `evidence_level` | enum | No | Confidence level |
| `current_fulfillment` | array | No | How this need is currently served, with friction and switching barriers |
| `context_refs` | `context_ref[]` | No | |

#### Offering (OFF)

What is offered to satisfy needs.

| Field | Type | Required | Description |
|-------|------|----------|-------------|
| `id` | `offering_ref` | Yes | `OFF###` pattern |
| `name` | string | Yes | |
| `value_statement` | string | Yes | |
| `capabilities` | `string[]` | No | Concrete, verifiable product/service capabilities |
| `solves_needs` | `need_ref[]` | No | |
| `addresses_opportunities` | `opportunity_ref[]` | No | |
| `brand_ref` | `brand_ref` | No | Owning brand in a multi-brand portfolio |
| `proof_points` | `proof_ref[]` | No | |

#### Positioning (POS)

Market category choice and differentiated claim.

| Field | Type | Required | Description |
|-------|------|----------|-------------|
| `id` | `position_ref` | Yes | `POS###` pattern |
| `market_category` | string | Yes | Category label framing competition |
| `differentiated_claim` | string | Yes | |
| `brand_ref` | `brand_ref` | No | |
| `category_strategy` | object | No | Frame of reference, category definition, category move (`enter`, `redefine`, `create`, `defend`, `bridge`) |
| `target_audiences` | `audience_ref[]` | No | |
| `competitors` | `competitor_ref[]` | No | |
| `reasons_to_believe` | `proof_ref[]` | No | |
| `based_on_opportunities` | `opportunity_ref[]` | No | |

#### Persona (PER)

Behavioral archetype with empathy map.

| Field | Type | Required | Description |
|-------|------|----------|-------------|
| `id` | `persona_ref` | Yes | `PER###` pattern |
| `name` | string | Yes | |
| `audience` | `audience_ref` | Yes | Segment this persona represents |
| `actor` | `actor_ref` | No | Bridge to primitive Actor |
| `goals` | `string[]` | No | |
| `barriers` | `string[]` | No | |
| `decision_criteria` | `string[]` | No | |
| `empathy_map` | object | No | Structured empathy map (thinks, feels, sees, hears, says_and_does, pains, gains) |

#### Message House (MHS)

Roof claim / pillar / proof messaging architecture.

| Field | Type | Required | Description |
|-------|------|----------|-------------|
| `id` | `message_house_ref` | Yes | `MHS###` pattern |
| `name` | string | Yes | |
| `roof_claim` | string | Yes | Umbrella statement every pillar reinforces |
| `pillars` | array (min 1) | Yes | Support pillars (`MPL###`) |
| `brand_ref` | `brand_ref` | No | |
| `audience_refs` | `audience_ref[]` | No | |
| `positioning_refs` | `position_ref[]` | No | |
| `foundation` | string | No | Mission/purpose statement grounding the house |

#### Message (MSG)

Reusable communication unit with audience/channel targeting.

| Field | Type | Required | Description |
|-------|------|----------|-------------|
| `id` | `message_ref` | Yes | `MSG###` pattern |
| `title` | string | Yes | |
| `core_statement` | string | Yes | |
| `audience` | `audience_ref` | No | |
| `actor` | `actor_ref` | No | |
| `needs` | `need_ref[]` | No | |
| `offering` | `offering_ref` | No | |
| `journey_stages` | `journey_stage_ref[]` | No | |
| `framework_pattern` | enum | No | `message-house`, `sb7`, `aida`, `pas`, `bab`, `stdc`, `custom` |
| `brand_script_ref` | `brand_script_ref` | No | Links to specific narrative script (v1.3.0) |
| `message_house_refs` | `message_house_ref[]` | No | |
| `proof_points` | `proof_ref[]` | No | |
| `tone` | `tone_ref[]` | No | |
| `status` | enum | No | `draft`, `active`, `paused`, `deprecated`, `archived` |

#### Tone (TON)

Tone guideline with quantitative dimensions.

| Field | Type | Required | Description |
|-------|------|----------|-------------|
| `id` | `tone_ref` | Yes | `TON###` pattern |
| `label` | string | Yes | |
| `do` | `string[]` | Yes | Recommended writing behaviors |
| `avoid` | `string[]` | Yes | Disallowed writing behaviors |
| `dimensions` | object | Yes | `humor` (-2..+2), `formality` (-2..+2), `respect` (-2..+2), `enthusiasm` (-2..+2) |
| `context_notes` | array | No | Per-context tone adaptations |

#### Journey Stage (JSG)

Customer journey stage with universal phase mapping.

| Field | Type | Required | Description |
|-------|------|----------|-------------|
| `id` | `journey_stage_ref` | Yes | `JSG###` pattern |
| `name` | string | Yes | |
| `intent` | string | No | What the customer intends at this stage |
| `universal_phase` | enum | No | `unaware`, `aware`, `engaged`, `committed`, `active`, `loyal`, `advocate` |
| `order` | integer | No | Sequence number |

#### Brand Script (BSC)

Narrative backbone scoped to one audience (v1.3.0).

| Field | Type | Required | Description |
|-------|------|----------|-------------|
| `id` | `brand_script_ref` | Yes | `BSC###` pattern |
| `name` | string | Yes | Script label |
| `brand_ref` | `brand_ref` | Yes | Owning brand |
| `narrative` | object | Yes | Framework-specific story fields (hero, problem, guide, plan, etc.) |
| `primary_audience_refs` | `audience_ref[]` | No | |
| `primary_persona_refs` | `persona_ref[]` | No | |
| `is_default` | boolean | No | Default script for multi-script brands |

#### Personal Brand Profile (PBP)

Founder/expert voice overlay on the brand system.

| Field | Type | Required | Description |
|-------|------|----------|-------------|
| `id` | `personal_brand_profile_ref` | Yes | `PBP###` pattern |
| `name` | string | Yes | |
| `subject_brand_ref` | `brand_ref` | Yes | Brand this profile belongs to |
| `signature_ideas` | `string[]` | Yes | Repeatable ideas the person should become known for |
| `role_in_system` | enum | No | `founder`, `executive`, `operator`, `evangelist`, `creator`, `analyst`, `advisor`, `community-lead` |
| `authority_sources` | array | No | Credibility anchors (role, credential, publication, speaking, etc.) |
| `boundaries` | `string[]` | No | What the personal brand should/should not own |

#### Priority Stream (PRI) -- v1.5.0

Prioritized revenue or service stream.

| Field | Type | Required | Description |
|-------|------|----------|-------------|
| `id` | string | Yes | `PRI###` pattern |
| `name` | string | Yes | |
| `priority` | integer | Yes | Rank (1 = highest) |
| `rationale` | string | No | Why this rank |
| `time_investment` | string | No | |
| `revenue_estimate` | string | No | |
| `offering_ref` | `offering_ref` | No | |
| `opportunity_ref` | `opportunity_ref` | No | |

#### Roadmap Phase (RMP) -- v1.5.0

Quarterly or milestone delivery phase.

| Field | Type | Required | Description |
|-------|------|----------|-------------|
| `id` | string | Yes | `RMP###` pattern |
| `name` | string | Yes | Phase label |
| `period` | string | No | Calendar span |
| `goals` | `string[]` | No | |
| `budget` | string | No | |
| `kpi` | string | No | Primary success metric |

### 6.3 Activation Plane

#### Channel (CHN)

Distribution channel with audience/context/journey links.

| Field | Type | Required | Description |
|-------|------|----------|-------------|
| `id` | `channel_ref` | Yes | `CHN###` pattern |
| `name` | string | Yes | |
| `media_type` | enum | Yes | `owned`, `paid`, `earned`, `shared` |
| `audience_refs` | `audience_ref[]` | No | |
| `actor_refs` | `actor_ref[]` | No | |
| `journey_stage_refs` | `journey_stage_ref[]` | No | |
| `message_refs` | `message_ref[]` | No | |
| `tone_adaptation` | string | No | How core voice is adapted for this channel |
| `objective` | enum | No | `awareness`, `engagement`, `consideration`, `conversion`, `retention`, `advocacy` |
| `universal_phases` | `universal_phase[]` | No | Normalized journey phases (prefer over objective) |
| `status` | enum | No | `draft`, `active`, `paused`, `deprecated`, `archived` |

#### Campaign (CMP)

Time-bounded campaign with creative brief, budget, and milestone tracking.

| Field | Type | Required | Description |
|-------|------|----------|-------------|
| `id` | `campaign_ref` | Yes | `CMP###` pattern |
| `name` | string | Yes | |
| `objective` | string | Yes | Strategic reason for the campaign |
| `start_date` | date | Yes | ISO 8601 date |
| `end_date` | date | No | |
| `program_ref` | `program_ref` | No | Parent program |
| `primary_idea` | string | No | Central creative idea |
| `target_actors` | `actor_ref[]` | No | |
| `message_refs` | `message_ref[]` | No | |
| `channel_refs` | `channel_ref[]` | No | |
| `creative_brief` | object | No | Problem, audience insight, promise, proof, CTA, constraints |
| `budget` | object | No | Currency, total, split_hint (paid/owned/earned/shared) |
| `north_star` | `kpi_ref` | No | |
| `status` | enum | No | `draft`, `active`, `paused`, `deprecated`, `archived` |

#### Program (PRG)

Always-on or multi-campaign initiative.

| Field | Type | Required | Description |
|-------|------|----------|-------------|
| `id` | `program_ref` | Yes | `PRG###` pattern |
| `name` | string | Yes | |
| `objective` | string | Yes | |
| `primary_idea` | string | No | Unifying narrative across campaigns |
| `campaign_refs` | `campaign_ref[]` | No | |
| `message_house_refs` | `message_house_ref[]` | No | |
| `content_pillar_refs` | `content_pillar_ref[]` | No | |
| `status` | enum | No | `draft`, `active`, `paused`, `deprecated`, `archived` |

#### Content Asset (CNT)

Individual content piece.

| Field | Type | Required | Description |
|-------|------|----------|-------------|
| `id` | `content_ref` | Yes | `CNT###` pattern |
| `name` | string | Yes | |
| `format` | enum | Yes | `post`, `article`, `video`, `email`, `ad`, `landing-page`, `deck`, `webinar`, `case-study`, `tutorial`, `talk`, `other` |
| `campaign_refs` | `campaign_ref[]` | No | Campaigns this asset supports |
| `channel` | `channel_ref` | No | |
| `primary_message` | `message_ref` | No | |
| `journey_stage` | `journey_stage_ref` | No | |
| `action` | `action_ref` | No | |
| `status` | enum | No | `draft`, `active`, `paused`, `deprecated`, `archived` |

#### Content Pillar (CPL)

Recurring editorial theme for building authority.

| Field | Type | Required | Description |
|-------|------|----------|-------------|
| `id` | `content_pillar_ref` | Yes | `CPL###` pattern |
| `name` | string | Yes | |
| `angle` | string | Yes | Strategic lens or recurring POV |
| `purpose` | enum | No | `awareness`, `consideration`, `demand`, `retention`, `advocacy`, `learning`, `community`, `partnership`, `other` |
| `message_refs` | `message_ref[]` | No | |
| `message_house_refs` | `message_house_ref[]` | No | |
| `status` | enum | No | Lifecycle status |

### 6.4 Governance Plane

#### Evidence (EVD)

Traceable evidence record with source metadata.

| Field | Type | Required | Description |
|-------|------|----------|-------------|
| `id` | `evidence_ref` | Yes | `EVD###` pattern |
| `title` | string | Yes | |
| `type` | enum | Yes | `assumption`, `interview`, `survey`, `analytics`, `experiment`, `observation`, `secondary-research`, `expert-opinion`, `benchmark`, `internal-analysis`, `market-data`, `market-signal`, `competitor-intelligence`, `primary-data` |
| `date` | date | Yes | ISO 8601 date |
| `source` | string | No | Human-readable source label |
| `source_type` | enum | No | `first-party`, `third-party`, `internal`, `external`, `mixed`, `industry-report`, `thought-leadership`, `technology-report`, `analyst-report`, `market-data`, `competitor-website`, `own-website`, `self-assessment`, `third-party-validation` |
| `source_url` | string | No | Canonical URL |
| `publisher` | string | No | |
| `summary` | string | No | |
| `confidence` | enum | No | `hypothesis`, `weak-signal`, `moderate-evidence`, `strong-evidence` |
| `supports` | `any_entity_ref[]` | No | Entities this evidence supports |
| `contradicts` | `any_entity_ref[]` | No | Entities this evidence challenges |
| `geo_scope` | object | No | Geographic applicability (v1.4.0) |

#### Decision (DEC)

Strategic decision with rationale and alternatives.

| Field | Type | Required | Description |
|-------|------|----------|-------------|
| `id` | `decision_ref` | Yes | `DEC###` pattern |
| `title` | string | Yes | |
| `status` | enum | Yes | `proposed`, `accepted`, `rejected`, `superseded`, `landed` |
| `date` | date | Yes | ISO 8601 date |
| `rationale` | object | Yes | `problem` (required), `selected` (required), `alternatives`, `why` |
| `impacts` | object | No | Cross-entity impact links |
| `risks` | `risk_ref[]` | No | |
| `supersedes` | `decision_ref[]` | No | |

#### Risk (RSK)

Identified risk with likelihood, impact, and mitigation.

| Field | Type | Required | Description |
|-------|------|----------|-------------|
| `id` | `risk_ref` | Yes | `RSK###` pattern |
| `title` | string | Yes | |
| `likelihood` | enum | Yes | `low`, `medium`, `high` |
| `impact` | enum | Yes | `low`, `medium`, `high`, `critical` |
| `mitigation` | string | No | |
| `status` | enum | No | `identified`, `mitigating`, `accepted`, `resolved` |
| `affects` | object | No | Cross-entity impact links |
| `geo_scope` | object | No | Geographic applicability (v1.4.0) |

#### Experiment (TST)

Experiment for message, channel, or campaign validation.

| Field | Type | Required | Description |
|-------|------|----------|-------------|
| `id` | `test_ref` | Yes | `TST###` pattern |
| `hypothesis` | string | Yes | |
| `status` | enum | Yes | `planned`, `running`, `completed`, `cancelled` |
| `method` | enum | No | `ab-test`, `multivariate`, `interview`, `survey`, `concept-test`, `incrementality`, `other` |
| `variants` | array | No | Named variants with message/channel/content refs |
| `success_metrics` | `metric_ref[]` | No | |
| `result` | object | No | Winner, effect size, confidence, conclusion |
| `decision_outcome` | `decision_ref` | No | Decision made from results |
| `produced_evidence` | `evidence_ref[]` | No | Evidence records generated |

#### Metric (MET)

Measurable quantity with formula and cadence.

| Field | Type | Required | Description |
|-------|------|----------|-------------|
| `id` | `metric_ref` | Yes | `MET###` pattern |
| `name` | string | Yes | |
| `formula` | string | Yes | How this metric is calculated |
| `cadence` | enum | No | `real-time`, `daily`, `weekly`, `monthly`, `quarterly` |
| `source` | string | No | Data source |
| `owner` | string | No | |

#### KPI (KPI)

Key performance indicator linking metric to target.

| Field | Type | Required | Description |
|-------|------|----------|-------------|
| `id` | `kpi_ref` | Yes | `KPI###` pattern |
| `name` | string | Yes | |
| `metric` | `metric_ref` | Yes | Underlying metric |
| `target` | string | Yes | Target value |
| `stage` | enum | No | `awareness`, `acquisition`, `activation`, `engagement`, `retention`, `referral`, `revenue`, `strategic` |
| `universal_phase` | enum | No | Normalized journey phase (prefer over stage) |
| `linked_campaigns` | `campaign_ref[]` | No | |
| `linked_messages` | `message_ref[]` | No | |

---

## 7. Versioning and Migration

### Schema Versioning

The schema follows [SemVer](https://semver.org/):

| Level | Meaning | Example |
|-------|---------|---------|
| Major | Breaking schema changes | 2.0.0 |
| Minor | New optional fields or entity types | 1.6.0 |
| Patch | Documentation, clarification, validator fixes | 1.6.1 |

Valid `schemaVersion` values: `1.1.0`, `1.3.0`, `1.4.0`, `1.5.0`, `1.6.0`, `1.6.1`.

### Model Versioning

Each brandvoice file has a `version` field (SemVer) tracking the content version independently of the schema version. Bump the model version when you change the content.

### Migration Records

Migrations track model evolution over time. Each migration has:

| Field | Required | Description |
|-------|----------|-------------|
| `id` | Yes | `MIG###` pattern |
| `name` | Yes | Kebab-case label |
| `date` | Yes | ISO 8601 date |
| `status` | Yes | `draft`, `pending`, `applied`, `rolled-back` |
| `change_scope` | Yes | `ontology`, `communication`, `mixed` |
| `intent` | No | `discover`, `refine`, `reclassify`, `invalidate`, `pivot`, `expand`, `consolidate`, `measure` |

Migrations contain four change collections:

| Collection | Purpose |
|------------|---------|
| `entities` | Add, modify, deprecate, remove, split, merge whole entities |
| `properties` | Set, unset, rename, append, remove-item on entity fields |
| `relationships` | Add, remove, redirect, modify edges between entities |
| `content_timeline` | Communication-level lifecycle changes (launch, pause, retire, rewrite) |

### Schema Evolution History

| Version | Date | Key Changes |
|---------|------|-------------|
| 1.0.0 | 2026-02-24 | Initial schema: four planes, root composition, metamodel, migration |
| 1.1.0 | 2026-03-25 | VRB, PBP, MHS, MPL, PRG, CPL, WSP entities; personal brands; message houses; portfolio brands |
| 1.3.0 | 2026-04-03 | Brand scripts (BSC); multiple narrative backbones per brand; brand_script_ref on messages |
| 1.4.0 | 2026-04-06 | `geo_scope` on market-level entities for multi-region portfolios |
| 1.5.0 | 2026-04-06 | Priority streams (PRI) and roadmap phases (RMP) for capacity planning |
| 1.6.0 | 2026-05-27 | Ecosystem players (EPL) for cooperation modeling |
| 1.6.1 | 2026-05-27 | Schema refinements and validation improvements |

---

## 8. Traceability Map

Cross-plane reference paths showing how entities connect across the brandvoice model:

| From | To | Via | Strength |
|------|----|-----|----------|
| Brand (BRD) | Market (MKT) | `brand.market_refs` | Optional |
| Brand (BRD) | Tone (TON) | `brand.tone_refs` | Optional |
| Brand (BRD) | Positioning (POS) | `brand.positioning_refs` | Optional |
| Brand (BRD) | Opportunity (OPP) | `brand.pursuing_opportunities` | Optional |
| Brand Script (BSC) | Brand (BRD) | `brand_script.brand_ref` | Required |
| Brand Script (BSC) | Audience (AUD) | `brand_script.primary_audience_refs` | Optional |
| Need (NED) | Actor (ACT) | `need.actors` | Required |
| Need (NED) | Context (CTX) | `need.context_refs` | Optional |
| Offering (OFF) | Need (NED) | `offering.solves_needs` | Optional |
| Offering (OFF) | Opportunity (OPP) | `offering.addresses_opportunities` | Optional |
| Offering (OFF) | Brand (BRD) | `offering.brand_ref` | Optional |
| Positioning (POS) | Competitor (CPR) | `positioning.competitors` | Optional |
| Positioning (POS) | Opportunity (OPP) | `positioning.based_on_opportunities` | Optional |
| Positioning (POS) | Proof Point (PRF) | `positioning.reasons_to_believe` | Optional |
| Message House (MHS) | Brand (BRD) | `message_house.brand_ref` | Optional |
| Message House (MHS) | Positioning (POS) | `message_house.positioning_refs` | Optional |
| Message (MSG) | Audience (AUD) | `message.audience` | Optional |
| Message (MSG) | Need (NED) | `message.needs` | Optional |
| Message (MSG) | Journey Stage (JSG) | `message.journey_stages` | Optional |
| Message (MSG) | Proof Point (PRF) | `message.proof_points` | Optional |
| Message (MSG) | Message House (MHS) | `message.message_house_refs` | Optional |
| Message (MSG) | Brand Script (BSC) | `message.brand_script_ref` | Optional |
| Channel (CHN) | Actor (ACT) | `channel.actor_refs` | Optional |
| Channel (CHN) | Journey Stage (JSG) | `channel.journey_stage_refs` | Optional |
| Channel (CHN) | Message (MSG) | `channel.message_refs` | Optional |
| Campaign (CMP) | Channel (CHN) | `campaign.channel_refs` | Optional |
| Campaign (CMP) | Message (MSG) | `campaign.message_refs` | Optional |
| Campaign (CMP) | Message House (MHS) | `campaign.message_house_refs` | Optional |
| Campaign (CMP) | KPI (KPI) | `campaign.north_star` | Optional |
| Campaign (CMP) | Program (PRG) | `campaign.program_ref` | Optional |
| Campaign (CMP) | Opportunity (OPP) | `campaign.opportunity_refs` | Optional |
| Program (PRG) | Campaign (CMP) | `program.campaign_refs` | Optional |
| Program (PRG) | Message House (MHS) | `program.message_house_refs` | Optional |
| Content Asset (CNT) | Campaign (CMP) | `content_asset.campaign_refs` | Optional |
| Content Asset (CNT) | Message (MSG) | `content_asset.primary_message` | Optional |
| Content Asset (CNT) | Channel (CHN) | `content_asset.channel` | Optional |
| KPI (KPI) | Metric (MET) | `kpi.metric` | Required |
| KPI (KPI) | Campaign (CMP) | `kpi.linked_campaigns` | Optional |
| Market Force (MFR) | Need (NED) | `force.affected_needs` | Optional |
| Market Force (MFR) | Opportunity (OPP) | `force.creates_opportunities` | Optional |
| Opportunity (OPP) | Actor (ACT) | `opportunity.target_actors` | Optional |
| Opportunity (OPP) | Need (NED) | `opportunity.unmet_needs` | Optional |
| Opportunity (OPP) | Market Force (MFR) | `opportunity.enabling_forces` | Optional |
| Opportunity (OPP) | Evidence (EVD) | `opportunity.validated_by` | Optional |
| Competitor (CPR) | Need (NED) | `competitor.for_needs` / `need_fit[].need` | Optional |
| Ecosystem Player (EPL) | Competitor (CPR) | `ecosystem_player.also_competitor_ref` | Optional |
| Evidence (EVD) | any entity | `evidence.supports` | Optional |
| Evidence (EVD) | any entity | `evidence.contradicts` | Optional |
| Decision (DEC) | any entity | `decision.impacts` | Optional |
| Decision (DEC) | Risk (RSK) | `decision.risks` | Optional |
| Experiment (TST) | Metric (MET) | `experiment.success_metrics` | Optional |
| Experiment (TST) | Decision (DEC) | `experiment.decision_outcome` | Optional |
| Experiment (TST) | Evidence (EVD) | `experiment.produced_evidence` | Optional |
| Priority Stream (PRI) | Offering (OFF) | `priority_stream.offering_ref` | Optional |
| Priority Stream (PRI) | Opportunity (OPP) | `priority_stream.opportunity_ref` | Optional |
| any entity | Evidence (EVD) | `*.evidence_refs` | Optional |

### Traceability Flow (Market to Measurement)

```
Market Force --creates--> Opportunity --unmet_needs--> Need <--solves-- Offering
                               |                        |
                               v                        v
                          Positioning <---based_on-- Actor
                               |
                               v
                         Message House --pillar--> Message --at-stage--> Journey Stage
                               |                      |
                               v                      v
                           Campaign --uses--> Channel <---> Content Asset
                               |
                               v
                          KPI --tracks--> Metric
                               ^
                               |
                          Experiment --produces--> Evidence
```

---

## 9. Shared Enumerations

### Lifecycle Status

Used on brands, messages, channels, campaigns, programs, content: `draft`, `active`, `paused`, `deprecated`, `archived`.

### Priority

Used for impact, threat level, urgency: `critical`, `high`, `medium`, `low`.

### Evidence Level

Confidence backed by evidence quality: `hypothesis`, `weak-signal`, `moderate-evidence`, `strong-evidence`.

### Universal Phase

Normalized journey phase mapping across frameworks: `unaware`, `aware`, `engaged`, `committed`, `active`, `loyal`, `advocate`.

### Demand Intensity

Strength of buyer demand signal: `latent`, `emerging`, `moderate`, `strong`, `urgent`.

### Fulfillment Level

How well a need is served (Christensen JTBD spectrum): `unmet`, `poorly-met`, `adequately-met`, `well-met`, `over-served`.

### Buyer Readiness

Eugene Schwartz awareness stages: `unaware`, `problem-aware`, `solution-aware`, `product-aware`, `ready-to-buy`.

---

## 10. Optional Blueprint Interoperability

Brandvoice entities can link to blueprint schema entities via `blueprint_links`:

```yaml
blueprint_links:
  entities: [CN001, CMD005]
  rationale: "Message maps to Order concept and SubmitOrder command."
```

Supported blueprint prefixes: `CN`, `CMD`, `EVT`, `QRY`, `DOC`, `ACT`, `G`, `R`, `D`, `CAP`, `TC`, `EC`, `ER`, `SCR`, `UAC`, `UNV`, `TM`, `DPT`, `PRT`.

---

## 11. Framework Profiles

Profiles allow brandvoice models to declare framework overlays without making them mandatory:

```yaml
profiles:
  - name: sb7
    category: messaging
    status: active
    description: "StoryBrand BrandScript framework."
    applies_to: [strategy.brand_core, strategy.messaging]
```

Profile categories: `messaging`, `strategy`, `research`, `growth`, `planning`, `measurement`.
