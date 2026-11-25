# Brandvoice 1.9 schema atlas

Generated from the shipped YAML schemas. The schemas define validation; this reference lists their fields, definitions and references.

## Schema files

- [activation/campaigns.schema.yaml](../../schema/v1.9/activation/campaigns.schema.yaml)
- [activation/channels.schema.yaml](../../schema/v1.9/activation/channels.schema.yaml)
- [brandvoice.schema.yaml](../../schema/v1.9/brandvoice.schema.yaml)
- [governance/decisions.schema.yaml](../../schema/v1.9/governance/decisions.schema.yaml)
- [governance/evidence.schema.yaml](../../schema/v1.9/governance/evidence.schema.yaml)
- [governance/experiments.schema.yaml](../../schema/v1.9/governance/experiments.schema.yaml)
- [governance/measurement.schema.yaml](../../schema/v1.9/governance/measurement.schema.yaml)
- [market/competition.schema.yaml](../../schema/v1.9/market/competition.schema.yaml)
- [market/ecosystem.schema.yaml](../../schema/v1.9/market/ecosystem.schema.yaml)
- [market/landscape.schema.yaml](../../schema/v1.9/market/landscape.schema.yaml)
- [market/opportunities.schema.yaml](../../schema/v1.9/market/opportunities.schema.yaml)
- [metamodel.schema.yaml](../../schema/v1.9/metamodel.schema.yaml)
- [migration.schema.yaml](../../schema/v1.9/migration.schema.yaml)
- [strategy/brand-core.schema.yaml](../../schema/v1.9/strategy/brand-core.schema.yaml)
- [strategy/capacity.schema.yaml](../../schema/v1.9/strategy/capacity.schema.yaml)
- [strategy/market-product.schema.yaml](../../schema/v1.9/strategy/market-product.schema.yaml)
- [strategy/messaging.schema.yaml](../../schema/v1.9/strategy/messaging.schema.yaml)
- [strategy/visual-identity.schema.yaml](../../schema/v1.9/strategy/visual-identity.schema.yaml)

## activation/campaigns.schema.yaml

Brandvoice Activation - Campaigns

| JSON Pointer | Type / constraints | Reference |
|---|---|---|
| / | type: object; required: ["version"]; additionalProperties: false; description: Campaign execution model with message-channel mapping, content assets, funnel stages, and learning loops.  |  |
| /properties/version | description: Track changes to the content of this model file using semantic versioning. | ../metamodel.schema.yaml#/$defs/semver |
| /properties/schemaVersion | description: Declare which Brandvoice schema release this file targets. | ../metamodel.schema.yaml#/$defs/schema_version |
| /properties/scope | description: Set the local namespace used to distinguish identifiers across model scopes. | ../metamodel.schema.yaml#/$defs/context_prefix |
| /properties/tags | description: Add reusable labels that help readers find related records. | ../metamodel.schema.yaml#/$defs/tags |
| /properties/campaigns | type: array; description: Collect the time-bound initiatives that turn strategy into audience activity. |  |
| /properties/campaigns/items |  | #/$defs/campaign |
| /properties/programs | type: array; description: Always-on or multi-campaign initiatives that coordinate a shared strategic narrative over time. Rationale: not all communication work is a discrete campaign burst, and teams need a level above campaigns for coherent planning.  |  |
| /properties/programs/items |  | #/$defs/program |
| /properties/actions | type: array; description: Primitive Action instances used in campaign execution. |  |
| /properties/actions/items |  | ../strategy/messaging.schema.yaml#/$defs/action |
| /properties/outcomes | type: array; description: Primitive Outcome targets tracked at campaign level. |  |
| /properties/outcomes/items |  | ../strategy/messaging.schema.yaml#/$defs/outcome |
| /properties/content_assets | type: array; description: List the deliverables used to communicate the planned messages. |  |
| /properties/content_assets/items |  | #/$defs/content_asset |
| /properties/content_pillars | type: array; description: Recurring editorial themes used to build authority and maintain topic consistency across channels. Rationale: campaigns need a reusable content strategy layer between message architecture and individual assets.  |  |
| /properties/content_pillars/items |  | #/$defs/content_pillar |
| /$defs/program | type: object; required: ["id","name","objective"]; additionalProperties: false; description: Coordinate related campaigns and editorial work around a sustained objective. |  |
| /$defs/program/properties/id | description: Keep the identifier stable while its campaigns or content change. | ../metamodel.schema.yaml#/$defs/program_ref |
| /$defs/program/properties/name | type: string; description: Choose a name that will still fit across several campaign cycles. |  |
| /$defs/program/properties/objective | type: string; description: Strategic reason this program exists. State the sustained result coordinated campaigns and content should advance. |  |
| /$defs/program/properties/primary_idea | type: string; description: Unifying narrative or organizing idea across campaigns in this program. |  |
| /$defs/program/properties/opportunity_refs | type: array; description: Opportunities this program is designed to capture or educate. |  |
| /$defs/program/properties/opportunity_refs/items |  | ../metamodel.schema.yaml#/$defs/opportunity_ref |
| /$defs/program/properties/market_refs | type: array; description: Link the markets in which the program is intended to operate. |  |
| /$defs/program/properties/market_refs/items |  | ../metamodel.schema.yaml#/$defs/market_ref |
| /$defs/program/properties/message_house_refs | type: array; description: Link the message systems that keep the program's communication consistent. |  |
| /$defs/program/properties/message_house_refs/items |  | ../metamodel.schema.yaml#/$defs/message_house_ref |
| /$defs/program/properties/campaign_refs | type: array; description: Link campaigns that contribute to this sustained objective. |  |
| /$defs/program/properties/campaign_refs/items |  | ../metamodel.schema.yaml#/$defs/campaign_ref |
| /$defs/program/properties/content_pillar_refs | type: array; description: Link recurring themes that support the program across campaigns. |  |
| /$defs/program/properties/content_pillar_refs/items |  | ../metamodel.schema.yaml#/$defs/content_pillar_ref |
| /$defs/program/properties/owner | type: string; description: Name the person or role accountable for coordinating the program. |  |
| /$defs/program/properties/status | description: Record whether the program is in preparation, operation, suspension, or retirement. | ../metamodel.schema.yaml#/$defs/lifecycle_status |
| /$defs/program/properties/evidence_refs | description: Link the evidence records a reviewer can consult to check these claims. | ../metamodel.schema.yaml#/$defs/evidence_refs |
| /$defs/program/properties/tags | description: Add reusable labels that help readers find related records. | ../metamodel.schema.yaml#/$defs/tags |
| /$defs/campaign | type: object; required: ["id","name","objective","start_date"]; additionalProperties: false; description: Define a time-bound effort with a measurable objective and coordinated communication activity. |  |
| /$defs/campaign/properties/id | description: Keep this identifier stable when execution details or dates change. | ../metamodel.schema.yaml#/$defs/campaign_ref |
| /$defs/campaign/properties/name | type: string; description: Give the campaign a recognizable name for reporting and coordination. |  |
| /$defs/campaign/properties/program_ref | description: Optional parent program coordinating this campaign. | ../metamodel.schema.yaml#/$defs/program_ref |
| /$defs/campaign/properties/objective | type: string; description: State the observable result the campaign is intended to produce. |  |
| /$defs/campaign/properties/primary_idea | type: string; description: Central creative or communication idea for the campaign. Rationale: integrated campaigns work best when channels orbit one memorable idea.  |  |
| /$defs/campaign/properties/stage | type: string; enum: ["see","think","do","care","awareness","activation","retention","referral","revenue"]; description: Choose the audience stage that best frames the campaign objective. |  |
| /$defs/campaign/properties/universal_phases | type: array; description: Normalized journey phases for this campaign. Prefer this over the legacy stage enum for cross-schema queries.  |  |
| /$defs/campaign/properties/universal_phases/items |  | ../metamodel.schema.yaml#/$defs/universal_phase |
| /$defs/campaign/properties/journey_stages | type: array; description: Link the journey stages the campaign is intended to influence. |  |
| /$defs/campaign/properties/journey_stages/items |  | ../metamodel.schema.yaml#/$defs/journey_stage_ref |
| /$defs/campaign/properties/target_audiences | type: array; description: Link the audience segments selected to receive campaign communication. |  |
| /$defs/campaign/properties/target_audiences/items |  | ../metamodel.schema.yaml#/$defs/audience_ref |
| /$defs/campaign/properties/target_actors | type: array; description: Link the roles whose behavior the campaign aims to influence. |  |
| /$defs/campaign/properties/target_actors/items |  | ../metamodel.schema.yaml#/$defs/actor_ref |
| /$defs/campaign/properties/context_refs | type: array; description: Link the situations in which the campaign should reach those actors. |  |
| /$defs/campaign/properties/context_refs/items |  | ../metamodel.schema.yaml#/$defs/context_ref |
| /$defs/campaign/properties/competitor_refs | type: array; description: Link the alternatives the audience is likely to weigh during this campaign. |  |
| /$defs/campaign/properties/competitor_refs/items |  | ../metamodel.schema.yaml#/$defs/competitor_ref |
| /$defs/campaign/properties/market_refs | type: array; description: Markets this campaign is addressing or educating. |  |
| /$defs/campaign/properties/market_refs/items |  | ../metamodel.schema.yaml#/$defs/market_ref |
| /$defs/campaign/properties/opportunity_refs | type: array; description: Opportunities this campaign is intended to activate. |  |
| /$defs/campaign/properties/opportunity_refs/items |  | ../metamodel.schema.yaml#/$defs/opportunity_ref |
| /$defs/campaign/properties/message_refs | type: array; description: Link the individual messages the team plans to use in campaign materials. |  |
| /$defs/campaign/properties/message_refs/items |  | ../metamodel.schema.yaml#/$defs/message_ref |
| /$defs/campaign/properties/message_house_refs | type: array; description: Message houses guiding this campaign. |  |
| /$defs/campaign/properties/message_house_refs/items |  | ../metamodel.schema.yaml#/$defs/message_house_ref |
| /$defs/campaign/properties/channel_refs | type: array; description: Link the touchpoints selected to carry the campaign messages. |  |
| /$defs/campaign/properties/channel_refs/items |  | ../metamodel.schema.yaml#/$defs/channel_ref |
| /$defs/campaign/properties/action_refs | type: array; description: Link the audience behaviors the campaign asks people to take. |  |
| /$defs/campaign/properties/action_refs/items |  | ../metamodel.schema.yaml#/$defs/action_ref |
| /$defs/campaign/properties/outcome_refs | type: array; description: Link the results expected when the targeted audience acts. |  |
| /$defs/campaign/properties/outcome_refs/items |  | ../metamodel.schema.yaml#/$defs/outcome_ref |
| /$defs/campaign/properties/north_star | description: Choose the single KPI that best reflects campaign success. | ../metamodel.schema.yaml#/$defs/kpi_ref |
| /$defs/campaign/properties/guardrail_metrics | type: array; description: Link measures that would reveal an unacceptable side effect of campaign success. |  |
| /$defs/campaign/properties/guardrail_metrics/items |  | ../metamodel.schema.yaml#/$defs/metric_ref |
| /$defs/campaign/properties/pillar_refs | type: array; description: Content pillars this campaign activates. Link the recurring content themes this campaign uses. |  |
| /$defs/campaign/properties/pillar_refs/items |  | ../metamodel.schema.yaml#/$defs/content_pillar_ref |
| /$defs/campaign/properties/creative_brief | type: object; additionalProperties: false; description: Brief-level inputs used to align campaign production. Rationale: strategic campaign intent should be explicit, not reconstructed from refs.  |  |
| /$defs/campaign/properties/creative_brief/properties/problem | type: string; description: Market or buyer problem the campaign responds to. |  |
| /$defs/campaign/properties/creative_brief/properties/audience_insight | type: string; description: Core audience insight informing the creative approach. |  |
| /$defs/campaign/properties/creative_brief/properties/promise | type: string; description: Primary promise this campaign should reinforce. |  |
| /$defs/campaign/properties/creative_brief/properties/proof | type: string; description: Most important reason the promise is believable. |  |
| /$defs/campaign/properties/creative_brief/properties/call_to_action | type: string; description: Primary call to action across the campaign. |  |
| /$defs/campaign/properties/creative_brief/properties/constraints | type: array; description: Operational, regulatory, or brand constraints. State limits the creative team should respect when producing assets. |  |
| /$defs/campaign/properties/creative_brief/properties/constraints/items | type: string |  |
| /$defs/campaign/properties/budget | type: object; additionalProperties: false; description: Budget envelope and allocation hints for campaign planning. |  |
| /$defs/campaign/properties/budget/properties/currency | type: string; description: ISO 4217 currency code. Use the currency in which the campaign's planned spend is stated. |  |
| /$defs/campaign/properties/budget/properties/total | type: number; description: Total planned spend in the stated currency. |  |
| /$defs/campaign/properties/budget/properties/split_hint | type: object; additionalProperties: false; description: Optional channel-bucket allocation guidance. Describe how planned spend is divided among the media categories. |  |
| /$defs/campaign/properties/budget/properties/split_hint/properties/paid | type: number; description: Record the planned share or amount allocated to paid media. |  |
| /$defs/campaign/properties/budget/properties/split_hint/properties/owned | type: number; description: Record the planned share or amount allocated to owned media. |  |
| /$defs/campaign/properties/budget/properties/split_hint/properties/earned | type: number; description: Record the planned share or amount allocated to earned media. |  |
| /$defs/campaign/properties/budget/properties/split_hint/properties/shared | type: number; description: Record the planned share or amount allocated to shared media. |  |
| /$defs/campaign/properties/milestones | type: array; description: Key delivery checkpoints for integrated campaign execution. |  |
| /$defs/campaign/properties/milestones/items | type: object; required: ["date","name"]; additionalProperties: false |  |
| /$defs/campaign/properties/milestones/items/properties | description: {"description":"Explain what the milestone represents in the campaign schedule.","type":"string"} |  |
| /$defs/campaign/properties/milestones/items/properties/date | type: string; pattern: ^\d{4}-\d{2}-\d{2}$; description: Set the date on which the team expects to reach this checkpoint. |  |
| /$defs/campaign/properties/milestones/items/properties/name | type: string; description: Name the checkpoint by the work or result expected at that point. |  |
| /$defs/campaign/properties/milestones/items/properties/description | type: string; description: Explain what the milestone represents in the campaign schedule. |  |
| /$defs/campaign/properties/start_date | type: string; pattern: ^\d{4}-\d{2}-\d{2}$; description: Record the date planned for the beginning of campaign activity. |  |
| /$defs/campaign/properties/end_date | type: string; pattern: ^\d{4}-\d{2}-\d{2}$; description: Record the date planned for campaign activity to end. |  |
| /$defs/campaign/properties/status | description: Record the campaign's current lifecycle state so teams can coordinate execution. | ../metamodel.schema.yaml#/$defs/lifecycle_status |
| /$defs/campaign/properties/evidence_refs | description: Link the evidence records a reviewer can consult to check these claims. | ../metamodel.schema.yaml#/$defs/evidence_refs |
| /$defs/campaign/properties/blueprint_links | description: Link Blueprint elements that explain what enables or depends on campaign execution. | ../metamodel.schema.yaml#/$defs/optional_blueprint_links |
| /$defs/campaign/properties/tags | description: Add reusable labels that help readers find related records. | ../metamodel.schema.yaml#/$defs/tags |
| /$defs/content_asset | type: object; required: ["id","name","format"]; additionalProperties: false; description: Describe an individual deliverable and the communication job it performs. |  |
| /$defs/content_asset/properties/id | description: Keep this identifier stable when the deliverable is revised or reused. | ../metamodel.schema.yaml#/$defs/content_ref |
| /$defs/content_asset/properties/name | type: string; description: Name the deliverable so editors can distinguish it from related assets. |  |
| /$defs/content_asset/properties/program_ref | description: Optional program this asset belongs to. | ../metamodel.schema.yaml#/$defs/program_ref |
| /$defs/content_asset/properties/campaign_refs | type: array; description: Campaigns this content asset supports. Rationale: content-to-campaign pointer avoids duplicating CNT IDs across campaign entities and naturally handles many-to-many. |  |
| /$defs/content_asset/properties/campaign_refs/items |  | ../metamodel.schema.yaml#/$defs/campaign_ref |
| /$defs/content_asset/properties/format | type: string; enum: ["post","article","video","email","ad","landing-page","deck","webinar","case-study","tutorial","talk","other"]; description: Choose the medium that determines how the asset is produced and consumed. |  |
| /$defs/content_asset/properties/channel | description: Link the touchpoint where the audience is expected to encounter this asset. | ../metamodel.schema.yaml#/$defs/channel_ref |
| /$defs/content_asset/properties/primary_message | description: Link the main message the asset is intended to communicate. | ../metamodel.schema.yaml#/$defs/message_ref |
| /$defs/content_asset/properties/journey_stage | description: Link the journey stage for which this deliverable is designed. | ../metamodel.schema.yaml#/$defs/journey_stage_ref |
| /$defs/content_asset/properties/action | description: Link the modeled behavior the content invites the audience to perform. | ../metamodel.schema.yaml#/$defs/action_ref |
| /$defs/content_asset/properties/expected_outcomes | type: array; description: Link the results the asset is expected to help produce. |  |
| /$defs/content_asset/properties/expected_outcomes/items |  | ../metamodel.schema.yaml#/$defs/outcome_ref |
| /$defs/content_asset/properties/actor_refs | type: array; description: Target actors for this content. Link the roles whose needs and situation shape this asset. |  |
| /$defs/content_asset/properties/actor_refs/items |  | ../metamodel.schema.yaml#/$defs/actor_ref |
| /$defs/content_asset/properties/market_refs | type: array; description: Link the markets for which the asset is intended. |  |
| /$defs/content_asset/properties/market_refs/items |  | ../metamodel.schema.yaml#/$defs/market_ref |
| /$defs/content_asset/properties/pillar_refs | type: array; description: Editorial pillars this asset supports. Link the recurring editorial themes this asset develops. |  |
| /$defs/content_asset/properties/pillar_refs/items |  | ../metamodel.schema.yaml#/$defs/content_pillar_ref |
| /$defs/content_asset/properties/evidence_refs | description: Link the evidence records a reviewer can consult to check these claims. | ../metamodel.schema.yaml#/$defs/evidence_refs |
| /$defs/content_asset/properties/tone | type: array; description: Link the tone guidance that applies when writing or recording this asset. |  |
| /$defs/content_asset/properties/tone/items |  | ../metamodel.schema.yaml#/$defs/tone_ref |
| /$defs/content_asset/properties/cta | type: string; description: Write the instruction the audience will see or hear in the deliverable. |  |
| /$defs/content_asset/properties/published_at | type: string; pattern: ^\d{4}-\d{2}-\d{2}$; description: Record the date on which the asset became available to its audience. |  |
| /$defs/content_asset/properties/status | description: Record the asset's current lifecycle state so teams know its editorial availability. | ../metamodel.schema.yaml#/$defs/lifecycle_status |
| /$defs/content_asset/properties/tags | description: Add reusable labels that help readers find related records. | ../metamodel.schema.yaml#/$defs/tags |
| /$defs/content_pillar | type: object; required: ["id","name","angle"]; additionalProperties: false; description: Frame a recurring editorial theme that can guide multiple deliverables. |  |
| /$defs/content_pillar/properties/id | description: Keep the identifier stable across the programs and assets that use this theme. | ../metamodel.schema.yaml#/$defs/content_pillar_ref |
| /$defs/content_pillar/properties/name | type: string; description: Name the theme in words editors can recognize when planning content. |  |
| /$defs/content_pillar/properties/angle | type: string; description: Strategic lens or recurring point of view for this pillar. Rationale: authority is built through repeated angles, not only repeated formats.  |  |
| /$defs/content_pillar/properties/purpose | type: string; enum: ["awareness","consideration","demand","retention","advocacy","learning","community","partnership","other"]; description: Strategic intent for this pillar: what outcome is it designed to drive. |  |
| /$defs/content_pillar/properties/audience_refs | type: array; description: Link the defined audience segments this theme is intended to serve. |  |
| /$defs/content_pillar/properties/audience_refs/items |  | ../metamodel.schema.yaml#/$defs/audience_ref |
| /$defs/content_pillar/properties/actor_refs | type: array; description: Link the roles whose needs make this theme relevant. |  |
| /$defs/content_pillar/properties/actor_refs/items |  | ../metamodel.schema.yaml#/$defs/actor_ref |
| /$defs/content_pillar/properties/message_refs | type: array; description: Link the individual messages the theme can develop over time. |  |
| /$defs/content_pillar/properties/message_refs/items |  | ../metamodel.schema.yaml#/$defs/message_ref |
| /$defs/content_pillar/properties/message_house_refs | type: array; description: Link the message systems within which the theme should stay coherent. |  |
| /$defs/content_pillar/properties/message_house_refs/items |  | ../metamodel.schema.yaml#/$defs/message_house_ref |
| /$defs/content_pillar/properties/program_refs | type: array; description: Link the ongoing programs that use this theme in their editorial plans. |  |
| /$defs/content_pillar/properties/program_refs/items |  | ../metamodel.schema.yaml#/$defs/program_ref |
| /$defs/content_pillar/properties/status | description: Record whether the theme is proposed, in use, paused, or retired. | ../metamodel.schema.yaml#/$defs/lifecycle_status |
| /$defs/content_pillar/properties/evidence_refs | description: Link the evidence records a reviewer can consult to check these claims. | ../metamodel.schema.yaml#/$defs/evidence_refs |
| /$defs/content_pillar/properties/tags | description: Add reusable labels that help readers find related records. | ../metamodel.schema.yaml#/$defs/tags |

## activation/channels.schema.yaml

Brandvoice Activation - Channels

| JSON Pointer | Type / constraints | Reference |
|---|---|---|
| / | type: object; required: ["version"]; additionalProperties: false; description: Channel portfolio and channel policies for message distribution, media mix, and tone adaptation.  |  |
| /properties/version | description: Track changes to the content of this model file using semantic versioning. | ../metamodel.schema.yaml#/$defs/semver |
| /properties/schemaVersion | description: Declare which Brandvoice schema release this file targets. | ../metamodel.schema.yaml#/$defs/schema_version |
| /properties/scope | description: Set the local namespace used to distinguish identifiers across model scopes. | ../metamodel.schema.yaml#/$defs/context_prefix |
| /properties/tags | description: Add reusable labels that help readers find related records. | ../metamodel.schema.yaml#/$defs/tags |
| /properties/channels | type: array; description: List the touchpoints available to deliver messages and invite audience action. |  |
| /properties/channels/items |  | #/$defs/channel |
| /$defs/channel | type: object; required: ["id","name","media_type"]; additionalProperties: false; description: Describe a repeatable touchpoint and the audience purpose it serves. |  |
| /$defs/channel/properties/id | description: Keep this identifier stable when distribution or ownership details change. | ../metamodel.schema.yaml#/$defs/channel_ref |
| /$defs/channel/properties/name | type: string; description: Use the label the team recognizes when planning distribution. |  |
| /$defs/channel/properties/media_type | type: string; enum: ["owned","paid","earned","shared"]; description: Choose the category that reflects how the team gains access to the audience. |  |
| /$defs/channel/properties/audience_refs | type: array; description: Link the segments the team expects to reach through this touchpoint. |  |
| /$defs/channel/properties/audience_refs/items |  | ../metamodel.schema.yaml#/$defs/audience_ref |
| /$defs/channel/properties/actor_refs | type: array; description: Primitive-aligned targeting. Prefer this over audience_refs. |  |
| /$defs/channel/properties/actor_refs/items |  | ../metamodel.schema.yaml#/$defs/actor_ref |
| /$defs/channel/properties/context_refs | type: array; description: Link the situations in which this channel is relevant or usable. |  |
| /$defs/channel/properties/context_refs/items |  | ../metamodel.schema.yaml#/$defs/context_ref |
| /$defs/channel/properties/journey_stage_refs | type: array; description: Link the specific journey stages at which this touchpoint is useful. |  |
| /$defs/channel/properties/journey_stage_refs/items |  | ../metamodel.schema.yaml#/$defs/journey_stage_ref |
| /$defs/channel/properties/message_refs | type: array; description: Link messages intended for delivery through this touchpoint. |  |
| /$defs/channel/properties/message_refs/items |  | ../metamodel.schema.yaml#/$defs/message_ref |
| /$defs/channel/properties/tone_adaptation | type: string; description: How core voice is adapted for this channel. |  |
| /$defs/channel/properties/objective | type: string; enum: ["awareness","engagement","consideration","conversion","retention","advocacy"]; description: Choose the main audience result the channel is intended to support. |  |
| /$defs/channel/properties/universal_phases | type: array; description: Normalized journey phases this channel primarily serves. Prefer this over the legacy objective enum for cross-schema queries.  |  |
| /$defs/channel/properties/universal_phases/items |  | ../metamodel.schema.yaml#/$defs/universal_phase |
| /$defs/channel/properties/constraints | type: array; description: Describe practical limits that shape content, publishing, or audience reach. |  |
| /$defs/channel/properties/constraints/items | type: string |  |
| /$defs/channel/properties/status | description: Indicate whether this channel is being prepared, used, paused, or retired. | ../metamodel.schema.yaml#/$defs/lifecycle_status |
| /$defs/channel/properties/evidence_refs | description: Link the evidence records a reviewer can consult to check these claims. | ../metamodel.schema.yaml#/$defs/evidence_refs |
| /$defs/channel/properties/tags | description: Add reusable labels that help readers find related records. | ../metamodel.schema.yaml#/$defs/tags |

## brandvoice.schema.yaml

Brandvoice Meta-Schema

| JSON Pointer | Type / constraints | Reference |
|---|---|---|
| / | type: object; required: ["version","name"]; additionalProperties: false; description: Unified schema for modeling brand communication strategy, business and product strategy, activation, and governance over time. Designed as a standalone model with optional interoperability links to blueprint schema entities. Rationale: keep market-to-message execution, governance, and brand-system assets in one composable contract so teams can generate consistent narrative artifacts and audit strategic decisions over time.  |  |
| /properties | description: {"type":"string","description":"Brief summary of brand scope and market context."} |  |
| /properties/version | description: Brandvoice model content version. Increment this when the modeled content changes. | metamodel.schema.yaml#/$defs/semver |
| /properties/schemaVersion | description: Brandvoice schema version. Omit to assume latest. | metamodel.schema.yaml#/$defs/schema_version |
| /properties/name | type: string; description: Name of the modeled brand/system. |  |
| /properties/description | type: string; description: Brief summary of brand scope and market context. |  |
| /properties/scope | description: Optional modeling scope for portfolios or regional variants. | metamodel.schema.yaml#/$defs/context_prefix |
| /properties/tags | description: Add reusable labels that help readers find related records. | metamodel.schema.yaml#/$defs/tags |
| /properties/market | type: object; additionalProperties: {"$ref":"metamodel.schema.yaml#/$defs/file_ref_placeholder"}; description: External market reality the brand responds to. Sizing, forces, competitive landscape, opportunity mapping, and (v1.6.0+) ecosystem players - the cooperation-first counterpart to competition.  |  |
| /properties/market/properties/landscape | description: Choose this slot for market boundaries, sizing assumptions, segments, and forces. |  |
| /properties/market/properties/landscape/examples/0 |  | market/landscape.yaml |
| /properties/market/properties/landscape/oneOf/0 |  | market/landscape.schema.yaml |
| /properties/market/properties/landscape/oneOf/1 |  | metamodel.schema.yaml#/$defs/file_ref_placeholder |
| /properties/market/properties/competition | description: Use this layer for alternatives buyers weigh, including workarounds and the status quo. |  |
| /properties/market/properties/competition/oneOf/0 |  | market/competition.schema.yaml |
| /properties/market/properties/competition/oneOf/1 |  | metamodel.schema.yaml#/$defs/file_ref_placeholder |
| /properties/market/properties/opportunities | description: Use this layer for opportunities to test and for the maps that frame them. |  |
| /properties/market/properties/opportunities/oneOf/0 |  | market/opportunities.schema.yaml |
| /properties/market/properties/opportunities/oneOf/1 |  | metamodel.schema.yaml#/$defs/file_ref_placeholder |
| /properties/market/properties/ecosystem | description: Place prospective partners and routes to cooperation in this layer. |  |
| /properties/market/properties/ecosystem/oneOf/0 |  | market/ecosystem.schema.yaml |
| /properties/market/properties/ecosystem/oneOf/1 |  | metamodel.schema.yaml#/$defs/file_ref_placeholder |
| /properties/market/additionalProperties |  | metamodel.schema.yaml#/$defs/file_ref_placeholder |
| /properties/strategy | type: object; additionalProperties: {"$ref":"metamodel.schema.yaml#/$defs/file_ref_placeholder"}; description: Why and for whom the brand creates value, how it is positioned, and how verbal/visual identity standards keep execution consistent. Rationale: strategy should not only define what to say, but also how brand expression remains coherent across teams, portfolio brands, personal brands, and message systems.  |  |
| /properties/strategy/properties/brand_core | description: Use this layer for the brand identity and the principles governing its expression. |  |
| /properties/strategy/properties/brand_core/oneOf/0 |  | strategy/brand-core.schema.yaml |
| /properties/strategy/properties/brand_core/oneOf/1 |  | metamodel.schema.yaml#/$defs/file_ref_placeholder |
| /properties/strategy/properties/market_product | description: Use this layer for audience needs, offerings, and their strategic fit. |  |
| /properties/strategy/properties/market_product/oneOf/0 |  | strategy/market-product.schema.yaml |
| /properties/strategy/properties/market_product/oneOf/1 |  | metamodel.schema.yaml#/$defs/file_ref_placeholder |
| /properties/strategy/properties/messaging | description: Use this layer for the claims and messages that express the positioning. |  |
| /properties/strategy/properties/messaging/oneOf/0 |  | strategy/messaging.schema.yaml |
| /properties/strategy/properties/messaging/oneOf/1 |  | metamodel.schema.yaml#/$defs/file_ref_placeholder |
| /properties/strategy/properties/visual_identity | description: Use this layer for the assets and rules that maintain consistent visual expression. |  |
| /properties/strategy/properties/visual_identity/oneOf/0 |  | strategy/visual-identity.schema.yaml |
| /properties/strategy/properties/visual_identity/oneOf/1 |  | metamodel.schema.yaml#/$defs/file_ref_placeholder |
| /properties/strategy/additionalProperties |  | metamodel.schema.yaml#/$defs/file_ref_placeholder |
| /properties/activation | type: object; additionalProperties: {"$ref":"metamodel.schema.yaml#/$defs/file_ref_placeholder"}; description: Where and how strategy is executed through channels, programs, campaigns, and content. Rationale: execution needs both burst campaigns and always-on communication systems to stay aligned with strategy.  |  |
| /properties/activation/properties/channels | description: Use this layer to define where audiences encounter the brand and why. |  |
| /properties/activation/properties/channels/examples/0 |  | activation/channels.yaml |
| /properties/activation/properties/channels/oneOf/0 |  | activation/channels.schema.yaml |
| /properties/activation/properties/channels/oneOf/1 |  | metamodel.schema.yaml#/$defs/file_ref_placeholder |
| /properties/activation/properties/campaigns | description: Use this layer for programs, time-bound campaigns, and the assets that support them. |  |
| /properties/activation/properties/campaigns/oneOf/0 |  | activation/campaigns.schema.yaml |
| /properties/activation/properties/campaigns/oneOf/1 |  | metamodel.schema.yaml#/$defs/file_ref_placeholder |
| /properties/activation/additionalProperties |  | metamodel.schema.yaml#/$defs/file_ref_placeholder |
| /properties/governance | type: object; additionalProperties: {"$ref":"metamodel.schema.yaml#/$defs/file_ref_placeholder"}; description: Evidence, experimentation, and decision traceability for continuous evolution. |  |
| /properties/governance/properties/measurement | description: Use this layer for success indicators and the measures used to track them. |  |
| /properties/governance/properties/measurement/oneOf/0 |  | governance/measurement.schema.yaml |
| /properties/governance/properties/measurement/oneOf/1 |  | metamodel.schema.yaml#/$defs/file_ref_placeholder |
| /properties/governance/properties/decisions | description: Use this layer for choices whose rationale future reviewers should be able to recover. |  |
| /properties/governance/properties/decisions/oneOf/0 |  | governance/decisions.schema.yaml |
| /properties/governance/properties/decisions/oneOf/1 |  | metamodel.schema.yaml#/$defs/file_ref_placeholder |
| /properties/governance/properties/evidence | description: Use this layer for observations and sources that other model records can cite. |  |
| /properties/governance/properties/evidence/oneOf/0 |  | governance/evidence.schema.yaml |
| /properties/governance/properties/evidence/oneOf/1 |  | metamodel.schema.yaml#/$defs/file_ref_placeholder |
| /properties/governance/properties/experiments | description: Use this layer for planned and completed tests of strategic assumptions. |  |
| /properties/governance/properties/experiments/oneOf/0 |  | governance/experiments.schema.yaml |
| /properties/governance/properties/experiments/oneOf/1 |  | metamodel.schema.yaml#/$defs/file_ref_placeholder |
| /properties/governance/additionalProperties |  | metamodel.schema.yaml#/$defs/file_ref_placeholder |
| /properties/migrations | type: array; description: Ordered model evolution records. Supports ontology-level changes and campaign/message changes over time.  |  |
| /properties/migrations/items/oneOf/0 |  | migration.schema.yaml |
| /properties/migrations/items/oneOf/1 | type: object; required: ["file"]; additionalProperties: false |  |
| /properties/migrations/items/oneOf/1/properties/file | type: string; description: Relative path to migration file. Resolve this path from the directory of the root model file. |  |
| /properties/profiles | type: array; description: Optional framework overlays/patterns (for example SB7, JTBD, STP, AARRR, RACE). They guide usage without being mandatory sections.  |  |
| /properties/profiles/items |  | #/$defs/profile |
| /$defs/profile | type: object; required: ["name"]; additionalProperties: false; description: Describe a framework overlay that authors can adopt for selected parts of the model. |  |
| /$defs/profile/properties | pattern: {"type":"object","additionalProperties":true,"description":"Optional profile-specific structure and conventions."}; description: {"description":"Explain what decisions the framework guides and how the team applies it.","type":"string"} |  |
| /$defs/profile/properties/name | type: string; description: Profile name. Use the framework label the authoring team will recognize. |  |
| /$defs/profile/properties/category | type: string; enum: ["messaging","strategy","research","growth","planning","measurement"]; description: Choose the main authoring activity this framework helps the team carry out. |  |
| /$defs/profile/properties/status | type: string; enum: ["draft","active","deprecated"]; description: Show whether authors are evaluating, using, or retiring this overlay. |  |
| /$defs/profile/properties/description | type: string; description: Explain what decisions the framework guides and how the team applies it. |  |
| /$defs/profile/properties/applies_to | type: array; description: List of schema sections this profile applies to. |  |
| /$defs/profile/properties/applies_to/items | type: string |  |
| /$defs/profile/properties/pattern | type: object; additionalProperties: true; description: Optional profile-specific structure and conventions. |  |

## governance/decisions.schema.yaml

Brandvoice Governance - Decisions

| JSON Pointer | Type / constraints | Reference |
|---|---|---|
| / | type: object; required: ["version"]; additionalProperties: false; description: Decision log for strategic and communication choices. Stores rationale, alternatives, impacts, and links to measured outcomes.  |  |
| /properties/version | description: Record the version declared for this Brandvoice model file. | ../metamodel.schema.yaml#/$defs/semver |
| /properties/schemaVersion | description: Identify the Brandvoice schema revision used to author this file. | ../metamodel.schema.yaml#/$defs/schema_version |
| /properties/scope | description: Set the context prefix that identifies the namespace for this file. | ../metamodel.schema.yaml#/$defs/context_prefix |
| /properties/tags | description: Add short labels that help contributors group and find related records. | ../metamodel.schema.yaml#/$defs/tags |
| /properties/risks | type: array; description: List uncertainties that may affect brand strategy or its execution. |  |
| /properties/risks/items |  | #/$defs/risk |
| /properties/decisions | type: array; description: Preserve strategic choices and the rationale needed to revisit them later. |  |
| /properties/decisions/items |  | #/$defs/decision |
| /$defs/risk | type: object; required: ["id","title","likelihood","impact"]; additionalProperties: false; description: Record an uncertain event, its consequences, and the intended response. |  |
| /$defs/risk/properties/id | description: Assign a stable reference so other model records can link to this entry. | ../metamodel.schema.yaml#/$defs/risk_ref |
| /$defs/risk/properties/title | type: string; description: Name the uncertain event in terms a reviewer can recognize. |  |
| /$defs/risk/properties/likelihood | type: string; enum: ["low","medium","high"]; description: Estimate the chance of occurrence within the relevant operating context. |  |
| /$defs/risk/properties/impact | type: string; enum: ["low","medium","high","critical"]; description: Rate the likely consequence if the risk materializes. |  |
| /$defs/risk/properties/mitigation | type: string; description: Describe a step that reduces likelihood, exposure, or the cost of occurrence. |  |
| /$defs/risk/properties/status | type: string; enum: ["identified","mitigating","accepted","resolved"]; description: Record how the risk is currently being managed. |  |
| /$defs/risk/properties/affects | description: Link the strategies or execution elements exposed to this risk. | ../metamodel.schema.yaml#/$defs/impact_links |
| /$defs/risk/properties/evidence_refs | description: Link source records that support the claims or choices captured here. | ../metamodel.schema.yaml#/$defs/evidence_refs |
| /$defs/risk/properties/geo_scope | description: Optional geographic applicability of this risk. Use when the risk applies only to a specific region (e.g. a naming collision that only exists in one language market). See metamodel.geo_scope. Added in v1.4.0.  | ../metamodel.schema.yaml#/$defs/geo_scope |
| /$defs/risk/properties/tags | description: Add short labels that help contributors group and find related records. | ../metamodel.schema.yaml#/$defs/tags |
| /$defs/decision | type: object; required: ["id","title","status","date","rationale"]; additionalProperties: false; description: Preserve the choice, alternatives, and evidence that explain a strategic commitment. |  |
| /$defs/decision/properties/id | description: Assign a stable reference so other model records can link to this entry. | ../metamodel.schema.yaml#/$defs/decision_ref |
| /$defs/decision/properties/title | type: string; description: Use an action-oriented label that makes the choice easy to retrieve. |  |
| /$defs/decision/properties/status | type: string; enum: ["proposed","accepted","rejected","superseded","landed"]; description: Record the current review or delivery state of this choice. |  |
| /$defs/decision/properties/date | type: string; pattern: ^\d{4}-\d{2}-\d{2}$; description: Record the date associated with this decision log entry. |  |
| /$defs/decision/properties/rationale | type: object; required: ["problem","selected"]; additionalProperties: false; description: Capture the problem, options, and reasoning needed to understand the choice. |  |
| /$defs/decision/properties/rationale/properties/problem | type: string; description: State the condition that prompted a decision and whose work it affects. |  |
| /$defs/decision/properties/rationale/properties/alternatives | type: array; description: List the viable courses of action considered before selecting one. |  |
| /$defs/decision/properties/rationale/properties/alternatives/items | type: string |  |
| /$defs/decision/properties/rationale/properties/selected | type: string; description: State the option chosen in enough detail to recognize its implementation. |  |
| /$defs/decision/properties/rationale/properties/why | type: string; description: Explain the evidence and trade-offs that favored the selected option. |  |
| /$defs/decision/properties/impacts | description: Link the strategy or execution elements this choice directly changes. | ../metamodel.schema.yaml#/$defs/impact_links |
| /$defs/decision/properties/risks | type: array; description: Link risks that may arise from or affect this decision. |  |
| /$defs/decision/properties/risks/items |  | ../metamodel.schema.yaml#/$defs/risk_ref |
| /$defs/decision/properties/evidence_refs | description: Link source records that support the claims or choices captured here. | ../metamodel.schema.yaml#/$defs/evidence_refs |
| /$defs/decision/properties/supersedes | type: array; description: Link earlier decisions replaced by this choice so history remains traceable. |  |
| /$defs/decision/properties/supersedes/items |  | ../metamodel.schema.yaml#/$defs/decision_ref |
| /$defs/decision/properties/blueprint_links | description: Link Blueprint elements that implement or explain this Brandvoice record. | ../metamodel.schema.yaml#/$defs/optional_blueprint_links |
| /$defs/decision/properties/tags | description: Add short labels that help contributors group and find related records. | ../metamodel.schema.yaml#/$defs/tags |

## governance/evidence.schema.yaml

Brandvoice Governance - Evidence

| JSON Pointer | Type / constraints | Reference |
|---|---|---|
| / | type: object; required: ["version"]; additionalProperties: false; description: Traceable evidence records backing strategy and execution claims across entities, decisions, and experiments.  |  |
| /properties/version | description: Record the version declared for this Brandvoice model file. | ../metamodel.schema.yaml#/$defs/semver |
| /properties/schemaVersion | description: Identify the Brandvoice schema revision used to author this file. | ../metamodel.schema.yaml#/$defs/schema_version |
| /properties/scope | description: Set the context prefix that identifies the namespace for this file. | ../metamodel.schema.yaml#/$defs/context_prefix |
| /properties/tags | description: Add short labels that help contributors group and find related records. | ../metamodel.schema.yaml#/$defs/tags |
| /properties/evidence | type: array; description: Collect traceable observations and sources so claims can be reviewed. |  |
| /properties/evidence/items |  | #/$defs/evidence_record |
| /$defs/evidence_record | type: object; required: ["id","title","type","date"]; additionalProperties: false; description: Capture what a source shows, how it was obtained, and which claims it bears on. |  |
| /$defs/evidence_record/properties | type: {"examples":["interview"],"type":"string","enum":["assumption","interview","survey","analytics","experiment","observation","secondary-research","expert-opinion","benchmark","internal-analysis","market-data","market-signal","competitor-intelligence","primary-data","research","primary-research","primary-academic","thought-leadership","analyst-report"],"description":"Evidence source class. Rationale: distinguish externally observed signals from internally synthesized analysis for confidence weighting. Extended in v1.6.1: market-data, market-signal, competitor-intelligence, primary-data added for multi-brand portfolio evidence migration. Extended in v1.6.2: research, primary-research, primary-academic, thought-leadership, analyst-report - additional evidence-source credibility classes for portfolio and academic sourcing. Permissive author taxonomy; a future curation pass may consolidate the research/* family.\n"} |  |
| /$defs/evidence_record/properties/id | description: Assign a stable reference so other model records can link to this entry. | ../metamodel.schema.yaml#/$defs/evidence_ref |
| /$defs/evidence_record/properties/title | type: string; description: Name the observation or source so reviewers can identify it in citations. |  |
| /$defs/evidence_record/properties/type | type: string; enum: ["assumption","interview","survey","analytics","experiment","observation","secondary-research","expert-opinion","benchmark","internal-analysis","market-data","market-signal","competitor-intelligence","primary-data","research","primary-research","primary-academic","thought-leadership","analyst-report"]; description: Evidence source class. Rationale: distinguish externally observed signals from internally synthesized analysis for confidence weighting. Extended in v1.6.1: market-data, market-signal, competitor-intelligence, primary-data added for multi-brand portfolio evidence migration. Extended in v1.6.2: research, primary-research, primary-academic, thought-leadership, analyst-report - additional evidence-source credibility classes for portfolio and academic sourcing. Permissive author taxonomy; a future curation pass may consolidate the research/* family.  |  |
| /$defs/evidence_record/properties/date | type: string; pattern: ^\d{4}-\d{2}-\d{2}$; description: Record when the finding was observed or the source was published. |  |
| /$defs/evidence_record/properties/source | type: string; description: Human-readable source label for the evidence artifact or origin. |  |
| /$defs/evidence_record/properties/source_type | type: string; enum: ["first-party","third-party","internal","external","mixed","industry-report","thought-leadership","technology-report","analyst-report","market-data","competitor-website","own-website","self-assessment","third-party-validation","peer-reviewed","academic-classic","practitioner-credible","industry-analysis","industry-consortium","secondary-research","survey","internal-analysis","primary-data"]; description: Origin or format of the evidence source. Party-based values (first-party, third-party, internal, external, mixed) classify who produced it. Format-based values (industry-report, competitor-website, etc.) classify what kind of publication it is. Extended in v1.6.1 with format-based values. Extended in v1.6.2: peer-reviewed, academic-classic, practitioner-credible, industry-analysis, industry-consortium - additional source-credibility classes. Also secondary-research, survey, internal-analysis, primary-data - research-method values authors use to classify a source; permissive by intent, a future curation pass may split method (type) from origin (source_type).  |  |
| /$defs/evidence_record/properties/source_url | type: string; pattern: ^[a-z]+://.+$; description: Canonical URL for the source when one exists. |  |
| /$defs/evidence_record/properties/publisher | type: string; description: Organization, platform, or person that published the source. |  |
| /$defs/evidence_record/properties/method | type: string; description: Describe how observations were collected or how the source produced its findings. |  |
| /$defs/evidence_record/properties/sample_size | type: integer; description: Record the number of people or observations underlying the finding when known. |  |
| /$defs/evidence_record/properties/summary | type: string; description: State the relevant finding and any qualification reviewers need to interpret it. |  |
| /$defs/evidence_record/properties/confidence | description: State the evidence level warranted by the source and method. | ../metamodel.schema.yaml#/$defs/evidence_level |
| /$defs/evidence_record/properties/supports | type: array; description: Entity references this evidence supports. |  |
| /$defs/evidence_record/properties/supports/items |  | ../metamodel.schema.yaml#/$defs/any_entity_ref |
| /$defs/evidence_record/properties/contradicts | type: array; description: Entity references this evidence challenges. |  |
| /$defs/evidence_record/properties/contradicts/items |  | ../metamodel.schema.yaml#/$defs/any_entity_ref |
| /$defs/evidence_record/properties/superseded_by | type: array; description: Evidence records whose claims replace this record's claims. A record named here is newer evidence on the same subject; list several when the replacement is split across records. A record replaced only in part keeps its `supports` and states in its `summary` which part is replaced. Evidence-freshness checks classify a record with this field as superseded rather than expired or fresh. Omit the field while the record is current; an empty list is not allowed.  |  |
| /$defs/evidence_record/properties/superseded_by/items |  | ../metamodel.schema.yaml#/$defs/evidence_ref |
| /$defs/evidence_record/properties/related_experiments | type: array; description: Link experiments that produced or used this evidence record. |  |
| /$defs/evidence_record/properties/related_experiments/items |  | ../metamodel.schema.yaml#/$defs/test_ref |
| /$defs/evidence_record/properties/related_decisions | type: array; description: Link decisions whose rationale draws on this evidence. |  |
| /$defs/evidence_record/properties/related_decisions/items |  | ../metamodel.schema.yaml#/$defs/decision_ref |
| /$defs/evidence_record/properties/geo_scope | description: Optional geographic applicability of this evidence record. See metamodel.geo_scope. Added in v1.4.0 - when omitted, viewers treat the record as geographically untagged.  | ../metamodel.schema.yaml#/$defs/geo_scope |
| /$defs/evidence_record/properties/tags | description: Add short labels that help contributors group and find related records. | ../metamodel.schema.yaml#/$defs/tags |

## governance/experiments.schema.yaml

Brandvoice Governance - Experiments

| JSON Pointer | Type / constraints | Reference |
|---|---|---|
| / | type: object; required: ["version"]; additionalProperties: false; description: Experimentation and learning layer for message, channel, and campaign validation (for example A/B tests, copy tests, and concept validation).  |  |
| /properties/version | description: Record the version declared for this Brandvoice model file. | ../metamodel.schema.yaml#/$defs/semver |
| /properties/schemaVersion | description: Identify the Brandvoice schema revision used to author this file. | ../metamodel.schema.yaml#/$defs/schema_version |
| /properties/scope | description: Set the context prefix that identifies the namespace for this file. | ../metamodel.schema.yaml#/$defs/context_prefix |
| /properties/tags | description: Add short labels that help contributors group and find related records. | ../metamodel.schema.yaml#/$defs/tags |
| /properties/experiments | type: array; description: Record tests that inform choices about messages, channels, and campaigns. |  |
| /properties/experiments/items |  | #/$defs/experiment |
| /$defs/experiment | type: object; required: ["id","hypothesis","status"]; additionalProperties: false; description: Connect a testable hypothesis to its design, observations, and follow-up decision. |  |
| /$defs/experiment/properties/id | description: Assign a stable reference so other model records can link to this entry. | ../metamodel.schema.yaml#/$defs/test_ref |
| /$defs/experiment/properties/hypothesis | type: string; description: Predict a measurable response to a change under stated conditions. |  |
| /$defs/experiment/properties/method | type: string; enum: ["ab-test","multivariate","interview","survey","concept-test","incrementality","other"]; description: Select the method used to gather evidence for this hypothesis. |  |
| /$defs/experiment/properties/status | type: string; enum: ["planned","running","completed","cancelled"]; description: Record the current stage of test execution and review. |  |
| /$defs/experiment/properties/variants | type: array; description: Describe the treatments or control conditions being compared in the test. |  |
| /$defs/experiment/properties/variants/items | type: object; required: ["name"]; additionalProperties: false |  |
| /$defs/experiment/properties/variants/items/properties/name | type: string; description: Give the treatment a stable label used in result reporting. |  |
| /$defs/experiment/properties/variants/items/properties/message | description: Link the message copy shown to participants in this treatment. | ../metamodel.schema.yaml#/$defs/message_ref |
| /$defs/experiment/properties/variants/items/properties/channel | description: Link the delivery channel used by this treatment group. | ../metamodel.schema.yaml#/$defs/channel_ref |
| /$defs/experiment/properties/variants/items/properties/content | description: Link the content artifact presented as part of this treatment. | ../metamodel.schema.yaml#/$defs/content_ref |
| /$defs/experiment/properties/variants/items/properties/action | description: Link the behavior participants are invited to perform in this treatment. | ../metamodel.schema.yaml#/$defs/action_ref |
| /$defs/experiment/properties/success_metrics | type: array; description: Link the measures used to evaluate whether the treatment succeeded. |  |
| /$defs/experiment/properties/success_metrics/items |  | ../metamodel.schema.yaml#/$defs/metric_ref |
| /$defs/experiment/properties/expected_outcomes | type: array; description: Link the changes the test is designed to detect or inform. |  |
| /$defs/experiment/properties/expected_outcomes/items |  | ../metamodel.schema.yaml#/$defs/outcome_ref |
| /$defs/experiment/properties/context_refs | type: array; description: Link the circumstances under which the result should be interpreted. |  |
| /$defs/experiment/properties/context_refs/items |  | ../metamodel.schema.yaml#/$defs/context_ref |
| /$defs/experiment/properties/evidence_refs | description: Input evidence that informed the experiment design. | ../metamodel.schema.yaml#/$defs/evidence_refs |
| /$defs/experiment/properties/result_summary | type: string; description: Summarize the observation and its practical implication for reviewers. |  |
| /$defs/experiment/properties/result | type: object; additionalProperties: false; description: Structured experiment result for programmatic analysis. |  |
| /$defs/experiment/properties/result/properties/winner | type: string; description: Name of the winning variant (must match a variants[].name). |  |
| /$defs/experiment/properties/result/properties/effect_size | type: string; description: Observed effect (e.g., '+12% CTR', '-3pp bounce rate'). |  |
| /$defs/experiment/properties/result/properties/confidence | type: number; description: Statistical confidence (0-1, e.g., 0.95 for 95%). |  |
| /$defs/experiment/properties/result/properties/sample_size | type: integer; description: Total sample across all variants. |  |
| /$defs/experiment/properties/result/properties/conclusion | type: string; enum: ["winner-found","no-significant-difference","inconclusive","stopped-early"]; description: Classify the outcome using the evidence available at test close. |  |
| /$defs/experiment/properties/decision_outcome | description: Link the decision made after interpreting the results and limitations. | ../metamodel.schema.yaml#/$defs/decision_ref |
| /$defs/experiment/properties/produced_evidence | type: array; description: Evidence records generated by this experiment's results. |  |
| /$defs/experiment/properties/produced_evidence/items |  | ../metamodel.schema.yaml#/$defs/evidence_ref |
| /$defs/experiment/properties/tags | description: Add short labels that help contributors group and find related records. | ../metamodel.schema.yaml#/$defs/tags |

## governance/measurement.schema.yaml

Brandvoice Governance - Measurement

| JSON Pointer | Type / constraints | Reference |
|---|---|---|
| / | type: object; required: ["version"]; additionalProperties: false; description: Measurement layer for strategic and campaign outcomes. Supports NSM, KPIs, and operational metrics across acquisition, engagement, and retention.  |  |
| /properties/version | description: Record the version declared for this Brandvoice model file. | ../metamodel.schema.yaml#/$defs/semver |
| /properties/schemaVersion | description: Identify the Brandvoice schema revision used to author this file. | ../metamodel.schema.yaml#/$defs/schema_version |
| /properties/scope | description: Set the context prefix that identifies the namespace for this file. | ../metamodel.schema.yaml#/$defs/context_prefix |
| /properties/tags | description: Add short labels that help contributors group and find related records. | ../metamodel.schema.yaml#/$defs/tags |
| /properties/north_star_metric | description: Identify the KPI used as the main indicator of sustained customer value. | ../metamodel.schema.yaml#/$defs/kpi_ref |
| /properties/metrics | type: array; description: Define reusable measures before attaching them to performance targets. |  |
| /properties/metrics/items |  | #/$defs/metric |
| /properties/kpis | type: array; description: Record the targets used to judge progress against strategic outcomes. |  |
| /properties/kpis/items |  | #/$defs/kpi |
| /properties/outcomes | type: array; description: Primitive outcomes tied to measurable business impact. |  |
| /properties/outcomes/items |  | ../strategy/messaging.schema.yaml#/$defs/outcome |
| /$defs/metric | type: object; required: ["id","name","formula"]; additionalProperties: false; description: Define how a measure is calculated, sourced, and maintained over time. |  |
| /$defs/metric/properties/id | description: Assign a stable reference so other model records can link to this entry. | ../metamodel.schema.yaml#/$defs/metric_ref |
| /$defs/metric/properties/name | type: string; description: Name the measured quantity so it can be recognized in reports. |  |
| /$defs/metric/properties/formula | type: string; description: State the calculation with enough detail to reproduce the reported value. |  |
| /$defs/metric/properties/cadence | type: string; enum: ["real-time","daily","weekly","monthly","quarterly"]; description: Choose how often new observations should be calculated or reported. |  |
| /$defs/metric/properties/source | type: string; description: Identify the system or dataset that supplies the calculation inputs. |  |
| /$defs/metric/properties/owner | type: string; description: Name the role responsible for maintaining and explaining the measure. |  |
| /$defs/metric/properties/evidence_refs | description: Link source records that support the claims or choices captured here. | ../metamodel.schema.yaml#/$defs/evidence_refs |
| /$defs/metric/properties/tags | description: Add short labels that help contributors group and find related records. | ../metamodel.schema.yaml#/$defs/tags |
| /$defs/kpi | type: object; required: ["id","name","metric","target"]; additionalProperties: false; description: Associate a measure with a target and the outcomes it helps assess. |  |
| /$defs/kpi/properties/id | description: Assign a stable reference so other model records can link to this entry. | ../metamodel.schema.yaml#/$defs/kpi_ref |
| /$defs/kpi/properties/name | type: string; description: Name the performance objective so reviewers can locate it easily. |  |
| /$defs/kpi/properties/metric | description: Link the measure used to decide whether the target was met. | ../metamodel.schema.yaml#/$defs/metric_ref |
| /$defs/kpi/properties/target | type: string; description: Specify the desired value with a time horizon or review window. |  |
| /$defs/kpi/properties/stage | type: string; enum: ["awareness","acquisition","activation","engagement","retention","referral","revenue","strategic"]; description: Record the reporting stage in models that use this field. |  |
| /$defs/kpi/properties/universal_phase | description: Normalized journey phase for this KPI. Prefer this over the legacy stage enum for cross-schema queries.  | ../metamodel.schema.yaml#/$defs/universal_phase |
| /$defs/kpi/properties/linked_campaigns | type: array; description: Link campaign initiatives whose performance is assessed with this target. |  |
| /$defs/kpi/properties/linked_campaigns/items |  | ../metamodel.schema.yaml#/$defs/campaign_ref |
| /$defs/kpi/properties/linked_messages | type: array; description: Link messages whose effectiveness is assessed with this target. |  |
| /$defs/kpi/properties/linked_messages/items |  | ../metamodel.schema.yaml#/$defs/message_ref |
| /$defs/kpi/properties/linked_values | type: array; description: Link value propositions this target helps to assess. |  |
| /$defs/kpi/properties/linked_values/items |  | ../metamodel.schema.yaml#/$defs/value_ref |
| /$defs/kpi/properties/linked_outcomes | type: array; description: Link desired changes whose progress is tracked by this target. |  |
| /$defs/kpi/properties/linked_outcomes/items |  | ../metamodel.schema.yaml#/$defs/outcome_ref |
| /$defs/kpi/properties/evidence_refs | description: Link source records that support the claims or choices captured here. | ../metamodel.schema.yaml#/$defs/evidence_refs |
| /$defs/kpi/properties/tags | description: Add short labels that help contributors group and find related records. | ../metamodel.schema.yaml#/$defs/tags |

## market/competition.schema.yaml

Brandvoice Market - Competition

| JSON Pointer | Type / constraints | Reference |
|---|---|---|
| / | type: object; required: ["version"]; additionalProperties: false; description: Deep competitive intelligence model. Extended competitor profiles with offerings, pricing, need-fit analysis, target segments, and competitive timeline. Covers direct competitors, indirect alternatives, substitutes (manual processes, hiring, status quo), and potential entrants.  |  |
| /properties/version | description: Track changes to the content of this model file using semantic versioning. | ../metamodel.schema.yaml#/$defs/semver |
| /properties/schemaVersion | description: Declare which Brandvoice schema release this file targets. | ../metamodel.schema.yaml#/$defs/schema_version |
| /properties/scope | description: Set the local namespace used to distinguish identifiers across model scopes. | ../metamodel.schema.yaml#/$defs/context_prefix |
| /properties/tags | description: Add reusable labels that help readers find related records. | ../metamodel.schema.yaml#/$defs/tags |
| /properties/competitors | type: array; description: Extended competitor profiles. Uses the same CPR### IDs as strategy/market-product.schema.yaml. This file adds depth; the strategy file retains the lightweight version.  |  |
| /properties/competitors/examples/0/0 | type: substitute |  |
| /properties/competitors/items |  | #/$defs/competitor_profile |
| /$defs/competitor_profile | type: object; required: ["id","name","type"]; additionalProperties: false; description: Record an alternative buyers weigh and why it wins or loses in their situation. |  |
| /$defs/competitor_profile/properties | type: {"examples":["substitute"],"type":"string","enum":["direct","indirect","substitute","status-quo","potential-entrant"],"description":"direct = same category, same needs. indirect = different category, overlapping needs. substitute = non-product alternative (manual process, hiring, DIY). status-quo = doing nothing / current workaround. potential-entrant = not competing today but could enter.\n"}; description: {"type":"string","description":"Brief profile summary. Explain when buyers consider this alternative and what it helps them accomplish."} |  |
| /$defs/competitor_profile/properties/id | description: Keep this identifier stable when the alternative changes its name or positioning. | ../metamodel.schema.yaml#/$defs/competitor_ref |
| /$defs/competitor_profile/properties/name | type: string; description: Competitor name. For substitutes, use descriptive names: 'Manual spreadsheet tracking', 'Hiring a freelance designer', 'Internal team (status quo)'.  |  |
| /$defs/competitor_profile/properties/type | type: string; enum: ["direct","indirect","substitute","status-quo","potential-entrant"]; description: direct = same category, same needs. indirect = different category, overlapping needs. substitute = non-product alternative (manual process, hiring, DIY). status-quo = doing nothing / current workaround. potential-entrant = not competing today but could enter.  |  |
| /$defs/competitor_profile/properties/description | type: string; description: Brief profile summary. Explain when buyers consider this alternative and what it helps them accomplish. |  |
| /$defs/competitor_profile/properties/website | type: string; description: Link the public page a reviewer can use to identify the offering. |  |
| /$defs/competitor_profile/properties/founded | type: string; pattern: ^\d{4}$; description: Record the founding year when it is known and relevant to the profile. |  |
| /$defs/competitor_profile/properties/funding | type: string; description: Funding stage and amount (e.g., 'Series B, $45M'). |  |
| /$defs/competitor_profile/properties/business_model | type: string; description: How they make money (e.g., 'SaaS subscription', 'marketplace commission'). |  |
| /$defs/competitor_profile/properties/estimated_revenue | type: string; description: Revenue estimate if available (e.g., '$10-15M ARR'). |  |
| /$defs/competitor_profile/properties/estimated_users | type: string; description: User base estimate (e.g., '50K+ teams', '2M registered users'). |  |
| /$defs/competitor_profile/properties/growth_trajectory | type: string; enum: ["declining","flat","growing","fast-growing","hyper-growth","unknown"]; description: Classify the direction and pace of growth using the signals available to you. |  |
| /$defs/competitor_profile/properties/key_features | type: array; description: Core feature capabilities. List capabilities buyers are likely to evaluate when comparing their options. |  |
| /$defs/competitor_profile/properties/key_features/items | type: string |  |
| /$defs/competitor_profile/properties/differentiators | type: array; description: What makes them stand out vs. other competitors. |  |
| /$defs/competitor_profile/properties/differentiators/items | type: string |  |
| /$defs/competitor_profile/properties/pricing | description: Summarize what buyers give up or pay and how the competitor charges. | #/$defs/competitor_pricing |
| /$defs/competitor_profile/properties/target_actors | type: array; description: Actor types this competitor primarily targets. |  |
| /$defs/competitor_profile/properties/target_actors/items |  | ../metamodel.schema.yaml#/$defs/actor_ref |
| /$defs/competitor_profile/properties/target_markets | type: array; description: Link the defined markets in which this alternative competes for demand. |  |
| /$defs/competitor_profile/properties/target_markets/items |  | ../metamodel.schema.yaml#/$defs/market_ref |
| /$defs/competitor_profile/properties/need_fit | type: array; description: How well this competitor addresses specific needs. This is the core competitive analysis structure - it answers 'for NED001, how good is CPR002 and where do they fall short?'  |  |
| /$defs/competitor_profile/properties/need_fit/items |  | #/$defs/need_fit_assessment |
| /$defs/competitor_profile/properties/strengths | type: array; description: Describe advantages buyers can experience or observe when using this alternative. |  |
| /$defs/competitor_profile/properties/strengths/items | type: string |  |
| /$defs/competitor_profile/properties/weaknesses | type: array; description: Competitor weaknesses and exploitable gaps. Capture where buyers experience tradeoffs, friction, or missing capabilities. |  |
| /$defs/competitor_profile/properties/weaknesses/items/oneOf/0 | type: string; description: Free-form weakness description (backward compatible). |  |
| /$defs/competitor_profile/properties/weaknesses/items/oneOf/1 | type: object; required: ["description"]; additionalProperties: false |  |
| /$defs/competitor_profile/properties/weaknesses/items/oneOf/1/properties | description: {"type":"string","description":"What this weakness is."} |  |
| /$defs/competitor_profile/properties/weaknesses/items/oneOf/1/properties/description | type: string; description: What this weakness is. |  |
| /$defs/competitor_profile/properties/weaknesses/items/oneOf/1/properties/exploitable_by_refs | type: array; description: Our offerings that exploit this weakness. |  |
| /$defs/competitor_profile/properties/weaknesses/items/oneOf/1/properties/exploitable_by_refs/items |  | ../metamodel.schema.yaml#/$defs/offering_ref |
| /$defs/competitor_profile/properties/weaknesses/items/oneOf/1/properties/severity | type: string; enum: ["critical","high","medium","low"]; description: How significant this weakness is. |  |
| /$defs/competitor_profile/properties/adoption_model | type: string; description: How people adopt this substitute. For non-product alternatives: 'organic habit', 'word of mouth', 'necessity', 'employer mandated'. For products: 'freemium', 'sales-led', 'PLG'.  |  |
| /$defs/competitor_profile/properties/switching_cost | type: string; enum: ["none","low","moderate","high","prohibitive"]; description: Cost (time, money, effort) to switch away from this competitor. |  |
| /$defs/competitor_profile/properties/switching_barriers | type: array; description: Specific barriers to switching. Works for all types: 'data migration' (product), 'relationship trust' (freelancer), 'organizational inertia' (status quo), 'contractual lock-in' (product).  |  |
| /$defs/competitor_profile/properties/switching_barriers/items | type: string |  |
| /$defs/competitor_profile/properties/lock_in_mechanisms | type: array; description: How this competitor retains users (e.g., 'proprietary format', 'network effects'). |  |
| /$defs/competitor_profile/properties/lock_in_mechanisms/items | type: string |  |
| /$defs/competitor_profile/properties/positioning_statement | type: string; description: How they position themselves (their claim, not yours). |  |
| /$defs/competitor_profile/properties/messaging_themes | type: array; description: Key themes in their marketing (e.g., 'enterprise-grade', 'AI-powered', 'simple'). |  |
| /$defs/competitor_profile/properties/messaging_themes/items | type: string |  |
| /$defs/competitor_profile/properties/brand_perception | type: string; description: How the market perceives them (e.g., 'reliable but expensive', 'innovative but buggy'). |  |
| /$defs/competitor_profile/properties/competitive_moves | type: array; description: Chronological record of significant competitive actions. Enables tracking of competitor evolution and strategic shifts over time.  |  |
| /$defs/competitor_profile/properties/competitive_moves/items |  | #/$defs/competitive_move |
| /$defs/competitor_profile/properties/for_needs | type: array; description: Needs this competitor addresses (backward compat with lightweight version). |  |
| /$defs/competitor_profile/properties/for_needs/items |  | ../metamodel.schema.yaml#/$defs/need_ref |
| /$defs/competitor_profile/properties/position_map_refs | type: array; description: Link maps where readers can compare this alternative against others on shared axes. |  |
| /$defs/competitor_profile/properties/position_map_refs/items |  | ../metamodel.schema.yaml#/$defs/position_map_ref |
| /$defs/competitor_profile/properties/opportunity_refs | type: array; description: Opportunities this competitor threatens or could capture. |  |
| /$defs/competitor_profile/properties/opportunity_refs/items |  | ../metamodel.schema.yaml#/$defs/opportunity_ref |
| /$defs/competitor_profile/properties/threat_level | description: Overall competitive threat (critical/high/medium/low). | ../metamodel.schema.yaml#/$defs/priority |
| /$defs/competitor_profile/properties/monitored | type: boolean; description: Whether this competitor is actively monitored. |  |
| /$defs/competitor_profile/properties/observed_at | type: string; pattern: ^\d{4}-\d{2}-\d{2}$; description: When this profile was last validated. |  |
| /$defs/competitor_profile/properties/evidence_refs | description: Link the evidence records a reviewer can consult to check these claims. | ../metamodel.schema.yaml#/$defs/evidence_refs |
| /$defs/competitor_profile/properties/geo_scope | description: Optional geographic applicability of this competitor. Use to distinguish a global marketplace from a country-specific substitute. See metamodel.geo_scope. Added in v1.4.0.  | ../metamodel.schema.yaml#/$defs/geo_scope |
| /$defs/competitor_profile/properties/tags | description: Add reusable labels that help readers find related records. | ../metamodel.schema.yaml#/$defs/tags |
| /$defs/competitor_pricing | type: object; additionalProperties: false; description: Competitor pricing model and tiers. Document the charging basis and the date on which the terms were observed. |  |
| /$defs/competitor_pricing/properties/model | type: string; enum: ["free","freemium","flat-rate","per-seat","usage-based","tiered","enterprise","quote-based","one-time","marketplace","hybrid","non-monetary"]; description: Pricing model. Use 'non-monetary' for substitutes where cost is time/effort rather than money (e.g., manual process, hiring). Use 'enterprise' when pricing is negotiated portfolio-wide and not represented by public SKU tiers.  |  |
| /$defs/competitor_pricing/properties/currency | type: string; description: ISO 4217 code (e.g., 'USD'). Omit for non-monetary. |  |
| /$defs/competitor_pricing/properties/tiers | type: array; description: List the packages or rate bands buyers can actually choose among. |  |
| /$defs/competitor_pricing/properties/tiers/items |  | #/$defs/pricing_tier |
| /$defs/competitor_pricing/properties/non_monetary_cost | type: string; description: For substitutes: the real cost in non-monetary terms. E.g., 'Avg. 8 hours/week of manual work', 'Full-time hire at $65K/yr'.  |  |
| /$defs/competitor_pricing/properties/observed_at | type: string; pattern: ^\d{4}-\d{2}-\d{2}$; description: Date the pricing observation so reviewers can assess how current the terms are. |  |
| /$defs/competitor_pricing/properties/evidence_refs | description: Link the evidence records a reviewer can consult to check these claims. | ../metamodel.schema.yaml#/$defs/evidence_refs |
| /$defs/pricing_tier | type: object; required: ["name"]; additionalProperties: false; description: Describe a purchasable plan and the conditions attached to its price. |  |
| /$defs/pricing_tier/properties/name | type: string; description: Tier name (e.g., 'Free', 'Pro', 'Enterprise'). |  |
| /$defs/pricing_tier/properties/price | type: string; description: Display price (e.g., '$12/user/mo', '$99/mo flat'). |  |
| /$defs/pricing_tier/properties/price_numeric | type: number; description: Machine-readable monthly price per unit. |  |
| /$defs/pricing_tier/properties/billing_period | type: string; enum: ["monthly","annual","one-time","custom"]; description: Choose the interval or arrangement that governs when buyers pay. |  |
| /$defs/pricing_tier/properties/includes | type: array; description: Key features or limits in this tier. |  |
| /$defs/pricing_tier/properties/includes/items | type: string |  |
| /$defs/pricing_tier/properties/target_segment | type: string; description: Who this tier is designed for (e.g., 'solo users', 'teams of 10-50'). |  |
| /$defs/pricing_tier/properties/limitations | type: array; description: Notable restrictions (e.g., '5 projects max', 'no API access'). |  |
| /$defs/pricing_tier/properties/limitations/items | type: string |  |
| /$defs/need_fit_assessment | type: object; required: ["need","fulfillment"]; additionalProperties: false; description: Assess how well this alternative serves a specific need for the relevant actors. |  |
| /$defs/need_fit_assessment/properties/need | description: The need being assessed. Choose the need against which you are assessing this alternative. | ../metamodel.schema.yaml#/$defs/need_ref |
| /$defs/need_fit_assessment/properties/fulfillment | description: How well this competitor serves this need. | ../metamodel.schema.yaml#/$defs/fulfillment_level |
| /$defs/need_fit_assessment/properties/how | type: string; description: How they address the need (e.g., 'built-in Gantt charts', 'marketplace of freelancers', 'the customer does it manually').  |  |
| /$defs/need_fit_assessment/properties/gaps | type: array; description: Where the competitor falls short on this need. |  |
| /$defs/need_fit_assessment/properties/gaps/items | type: string |  |
| /$defs/need_fit_assessment/properties/friction | type: array; description: Pain points users experience when using this competitor for this need. |  |
| /$defs/need_fit_assessment/properties/friction/items | type: string |  |
| /$defs/need_fit_assessment/properties/actors_served | type: array; description: Which actor types they serve well for this need (may not be all). |  |
| /$defs/need_fit_assessment/properties/actors_served/items |  | ../metamodel.schema.yaml#/$defs/actor_ref |
| /$defs/need_fit_assessment/properties/evidence_refs | description: Link the evidence records a reviewer can consult to check these claims. | ../metamodel.schema.yaml#/$defs/evidence_refs |
| /$defs/need_fit_assessment/properties/observed_at | type: string; pattern: ^\d{4}-\d{2}-\d{2}$; description: Record when the fit assessment was made or last checked against evidence. |  |
| /$defs/competitive_move | type: object; required: ["date","move_type","summary"]; additionalProperties: false; description: Record a dated competitor action and explain whether it changes your strategic choices. |  |
| /$defs/competitive_move/properties/date | type: string; pattern: ^\d{4}-\d{2}-\d{2}$; description: Use the date the competitive move occurred or was announced. |  |
| /$defs/competitive_move/properties/move_type | type: string; enum: ["product-launch","feature-release","pricing-change","positioning-shift","market-expansion","market-exit","partnership","acquisition","funding-round","leadership-change","messaging-change","regulatory-response","other"]; description: Category of competitive action. Choose the category that best describes what changed in the market. |  |
| /$defs/competitive_move/properties/summary | type: string; description: What happened. State the observable change in terms reviewers can verify. |  |
| /$defs/competitive_move/properties/impact_assessment | type: string; description: How this move affects our competitive position. |  |
| /$defs/competitive_move/properties/severity | description: How much this move matters to us (critical/high/medium/low). | ../metamodel.schema.yaml#/$defs/priority |
| /$defs/competitive_move/properties/affected_needs | type: array; description: Needs affected by this move. Link the needs whose fulfillment or importance may change after this move. |  |
| /$defs/competitive_move/properties/affected_needs/items |  | ../metamodel.schema.yaml#/$defs/need_ref |
| /$defs/competitive_move/properties/affected_opportunities | type: array; description: Opportunities threatened or opened by this move. |  |
| /$defs/competitive_move/properties/affected_opportunities/items |  | ../metamodel.schema.yaml#/$defs/opportunity_ref |
| /$defs/competitive_move/properties/requires_response | type: boolean; description: Whether this move requires a strategic response from us. |  |
| /$defs/competitive_move/properties/response_ref | description: Decision record for our response to this move. | ../metamodel.schema.yaml#/$defs/decision_ref |
| /$defs/competitive_move/properties/source | type: string; description: Where this was observed (e.g., 'press release', 'Product Hunt', 'customer report'). |  |
| /$defs/competitive_move/properties/observed_at | type: string; pattern: ^\d{4}-\d{2}-\d{2}$; description: Record when the team observed or verified this move. |  |
| /$defs/competitive_move/properties/evidence_refs | description: Link the evidence records a reviewer can consult to check these claims. | ../metamodel.schema.yaml#/$defs/evidence_refs |

## market/ecosystem.schema.yaml

Brandvoice Market - Ecosystem Players

| JSON Pointer | Type / constraints | Reference |
|---|---|---|
| / | type: object; required: ["version"]; additionalProperties: false; description: Ecosystem player model (added in schema v1.6.0). First-class entity for referral partners, co-presenters, distribution channels, complementary experts, and coopetition peers that live in the brand's market but are modeled as *cooperators* rather than *competitors*. Rationale: competitor profiles (market/competition.yaml) frame players through threat_level, need_fit, weaknesses, and switching barriers - strategy artifacts that answer "how do we win against them?". This is the wrong frame for a training company we want to refer clients with, a podcast host we want as a guest, a distribution platform that reaches our audience, or a fellow expert in an adjacent specialization we could co-present with. Those relationships need a cooperation-first vocabulary: why partner with them, what relationship type, what collaboration ideas are concrete today, where are we in the relationship lifecycle. Entries that are simultaneously a competitor AND an ecosystem player (coopetition - e.g., a direct competitor who could also co-present at a conference) MAY link to the CPR side via `also_competitor_ref`. No automatic mirror is created on the competitor side; the reference is informational. File convention: market/ecosystem.yaml (co-located with landscape, competition, opportunities). Entities:   EPL### - ecosystem_player  |  |
| /properties/version | description: Track changes to the content of this model file using semantic versioning. | ../metamodel.schema.yaml#/$defs/semver |
| /properties/schemaVersion | description: Declare which Brandvoice schema release this file targets. | ../metamodel.schema.yaml#/$defs/schema_version |
| /properties/scope | description: Set the local namespace used to distinguish identifiers across model scopes. | ../metamodel.schema.yaml#/$defs/context_prefix |
| /properties/tags | description: Add reusable labels that help readers find related records. | ../metamodel.schema.yaml#/$defs/tags |
| /properties/ecosystem_players | type: array; description: Cooperation-oriented profiles of people, organizations, communities, and platforms in the brand's market. Each entry answers: who are they, how do we relate, what could we build together, and what is the state of the relationship today.  |  |
| /properties/ecosystem_players/examples/0/0 | type: community |  |
| /properties/ecosystem_players/items |  | #/$defs/ecosystem_player |
| /$defs/ecosystem_player | type: object; required: ["id","name","type","relationship_type"]; additionalProperties: false; description: A single cooperator in the brand's market. Not a competitor profile - those live in competition.schema.yaml. See `also_competitor_ref` for the coopetition case where an entry is simultaneously a competitor.  |  |
| /$defs/ecosystem_player/properties | type: {"examples":["community"],"type":"string","enum":["individual","organization","community","platform","publication","event"],"description":"What kind of entity this is. individual = named person; organization = company or formal entity; community = informal network; platform = distribution or content platform; publication = newsletter/blog/book; event = recurring conference, meetup, or summit.\n"}; description: {"type":"string","description":"Brief profile summary of who they are and what they do."} |  |
| /$defs/ecosystem_player/properties/id | description: Keep this identifier stable as the relationship progresses or changes owners. | ../metamodel.schema.yaml#/$defs/ecosystem_player_ref |
| /$defs/ecosystem_player/properties/name | type: string; description: Human or organization name (e.g., "Sławomir Sobótka / Bottega IT Minds", "Architecture Weekly", "DevTalk podcast").  |  |
| /$defs/ecosystem_player/properties/type | type: string; enum: ["individual","organization","community","platform","publication","event"]; description: What kind of entity this is. individual = named person; organization = company or formal entity; community = informal network; platform = distribution or content platform; publication = newsletter/blog/book; event = recurring conference, meetup, or summit.  |  |
| /$defs/ecosystem_player/properties/relationship_type | type: string; enum: ["referral-partner","co-presenter","distribution-channel","complementary-expert","coopetition","community-ally","conference-network","content-peer","podcast-host","mentor","other"]; description: Primary mode of cooperation. referral-partner = upstream/downstream client referrals; co-presenter = joint talks or workshops; distribution-channel = their platform reaches our audience at scale; complementary-expert = adjacent specialization that pairs with ours; coopetition = simultaneously competitor and cooperator (must set also_competitor_ref); community-ally = community with audience overlap; conference-network = fellow speaker circuit; content-peer = parallel content creator in the same domain; podcast-host = guest opportunity; mentor = source of expertise or introductions; other = free-form.  |  |
| /$defs/ecosystem_player/properties/cooperation_potential | type: string; description: Narrative description of why this relationship matters and what cooperation could look like. This is the free-text reasoning that survives from hand-authored ecosystem notes - the "HIGH PARTNER VALUE" paragraph. Rationale: a concrete enum covers the category, but the specific partnership hypothesis (e.g., "Bottega trains, we deliver; natural referral pipeline") is the strategic insight that triggers action.  |  |
| /$defs/ecosystem_player/properties/description | type: string; description: Brief profile summary of who they are and what they do. |  |
| /$defs/ecosystem_player/properties/website | type: string; pattern: ^[a-z]+://.+$; description: Link a public page where reviewers can confirm this player's activities. |  |
| /$defs/ecosystem_player/properties/also_competitor_ref | description: Optional link to a competitor profile (CPR###) in competition.yaml for entries that are simultaneously a competitor. Required when relationship_type is "coopetition". Rationale: avoids duplicating profile data when an entity genuinely plays both roles; lets tools walk the competitor↔ecosystem edge.  | ../metamodel.schema.yaml#/$defs/competitor_ref |
| /$defs/ecosystem_player/properties/target_actors | type: array; description: Actors this ecosystem player primarily reaches or influences. |  |
| /$defs/ecosystem_player/properties/target_actors/items |  | ../metamodel.schema.yaml#/$defs/actor_ref |
| /$defs/ecosystem_player/properties/target_markets | type: array; description: Markets this ecosystem player operates in. |  |
| /$defs/ecosystem_player/properties/target_markets/items |  | ../metamodel.schema.yaml#/$defs/market_ref |
| /$defs/ecosystem_player/properties/key_offerings | type: array; description: Notable products, services, events, or content this player owns. Free-text strings (not typed refs) - these are THEIR offerings, not ours.  |  |
| /$defs/ecosystem_player/properties/key_offerings/items | type: string |  |
| /$defs/ecosystem_player/properties/strengths | type: array; description: Why this player is worth cooperating with - reputation, reach, credibility, audience, expertise, or unique assets.  |  |
| /$defs/ecosystem_player/properties/strengths/items | type: string |  |
| /$defs/ecosystem_player/properties/collaboration_ideas | type: array; description: Concrete co-creation hypotheses: joint workshops, podcast episodes, co-authored articles, cross-referrals, bundled offerings. Rationale: separates strategic *intent* (relationship_type) from tactical *next actions* the team can actually book.  |  |
| /$defs/ecosystem_player/properties/collaboration_ideas/items | type: string |  |
| /$defs/ecosystem_player/properties/status | type: string; enum: ["prospective","active","engaged","paused","lapsed"]; description: Where this relationship sits in its lifecycle. prospective = not yet contacted; active = in regular contact; engaged = actively cooperating on something concrete; paused = temporarily inactive; lapsed = was active, now dormant.  |  |
| /$defs/ecosystem_player/properties/owner | type: string; description: Internal owner who manages this relationship (e.g., name of the founder, partnerships lead, or personal brand profile holder). Free-text; can be a PBP### id or a person's name.  |  |
| /$defs/ecosystem_player/properties/last_contact_at | type: string; pattern: ^\d{4}-\d{2}-\d{2}$; description: Most recent meaningful contact with this player. |  |
| /$defs/ecosystem_player/properties/observed_at | type: string; pattern: ^\d{4}-\d{2}-\d{2}$; description: When this profile was last validated. |  |
| /$defs/ecosystem_player/properties/geo_scope | description: Optional geographic applicability of the cooperation relationship. Use to distinguish a globally-reachable distribution channel from a country-specific referral partner. See metamodel.geo_scope.  | ../metamodel.schema.yaml#/$defs/geo_scope |
| /$defs/ecosystem_player/properties/evidence_refs | description: Link the evidence records a reviewer can consult to check these claims. | ../metamodel.schema.yaml#/$defs/evidence_refs |
| /$defs/ecosystem_player/properties/tags | description: Add reusable labels that help readers find related records. | ../metamodel.schema.yaml#/$defs/tags |

## market/landscape.schema.yaml

Brandvoice Market - Landscape

| JSON Pointer | Type / constraints | Reference |
|---|---|---|
| / | type: object; required: ["version"]; additionalProperties: false; description: Market definition, sizing (TAM/SAM/SOM), segmentation, and environmental forces that shape demand and competition. The descriptive foundation that strategy responds to.  |  |
| /properties/version | description: Track changes to the content of this model file using semantic versioning. | ../metamodel.schema.yaml#/$defs/semver |
| /properties/schemaVersion | description: Declare which Brandvoice schema release this file targets. | ../metamodel.schema.yaml#/$defs/schema_version |
| /properties/scope | description: Set the local namespace used to distinguish identifiers across model scopes. | ../metamodel.schema.yaml#/$defs/context_prefix |
| /properties/tags | description: Add reusable labels that help readers find related records. | ../metamodel.schema.yaml#/$defs/tags |
| /properties/markets | type: array; description: Extended market definitions with structured sizing and segmentation. |  |
| /properties/markets/items |  | #/$defs/market_definition |
| /properties/forces | type: array; description: Environmental forces shaping market dynamics. Record external developments that could change demand, buyer behavior, or competition. |  |
| /properties/forces/items |  | #/$defs/market_force |
| /$defs/market_definition | type: object; required: ["id","name","category"]; additionalProperties: false; description: Define the demand boundary used to compare segments, alternatives, and sizing estimates. |  |
| /$defs/market_definition/properties | description: {"description":"Explain which buyers and uses fall inside the defined market boundary.","type":"string"} |  |
| /$defs/market_definition/properties/id | description: Use a stable identifier so analyses can refer to the same market definition. | ../metamodel.schema.yaml#/$defs/market_ref |
| /$defs/market_definition/properties/name | type: string; description: Human-readable market label (e.g., 'US SMB project management SaaS'). |  |
| /$defs/market_definition/properties/category | type: string; description: Industry vertical or category name. Name the category buyers use to frame the alternatives they compare. |  |
| /$defs/market_definition/properties/description | type: string; description: Explain which buyers and uses fall inside the defined market boundary. |  |
| /$defs/market_definition/properties/maturity | type: string; enum: ["emerging","growing","mature","declining"]; description: Classify the market's development using observed demand and adoption patterns. |  |
| /$defs/market_definition/properties/growth_rate | type: string; description: Annual growth estimate (e.g., '12% CAGR 2024-2028'). |  |
| /$defs/market_definition/properties/sizing | type: object; additionalProperties: false; description: Market sizing across TAM/SAM/SOM tiers. Each tier can have multiple segments with independent sizing and assumptions.  |  |
| /$defs/market_definition/properties/sizing/properties/tam | description: Estimate all demand within the stated market boundary before reach constraints. | #/$defs/sizing_tier |
| /$defs/market_definition/properties/sizing/properties/sam | description: Estimate the portion of demand reachable under the current service model. | #/$defs/sizing_tier |
| /$defs/market_definition/properties/sizing/properties/som | description: Estimate the portion of reachable demand the team could realistically capture. | #/$defs/sizing_tier |
| /$defs/market_definition/properties/sizing/properties/methodology_notes | type: string; description: Overall sizing approach (top-down, bottom-up, triangulated). |  |
| /$defs/market_definition/properties/sizing/properties/base_year | type: string; pattern: ^\d{4}$; description: Year the sizing data reflects. Choose the year to which the market sizing inputs apply. |  |
| /$defs/market_definition/properties/sizing/properties/evidence_refs | description: Link the evidence records a reviewer can consult to check these claims. | ../metamodel.schema.yaml#/$defs/evidence_refs |
| /$defs/market_definition/properties/segments | type: array; description: Market segments within this market. Each segment can have its own sizing, actors, needs, and growth characteristics.  |  |
| /$defs/market_definition/properties/segments/items |  | #/$defs/market_segment |
| /$defs/market_definition/properties/key_competitors | type: array; description: Link the alternatives most relevant to buyers within this market. |  |
| /$defs/market_definition/properties/key_competitors/items |  | ../metamodel.schema.yaml#/$defs/competitor_ref |
| /$defs/market_definition/properties/actors | type: array; description: Link the roles whose demand or buying decisions shape this market. |  |
| /$defs/market_definition/properties/actors/items |  | ../metamodel.schema.yaml#/$defs/actor_ref |
| /$defs/market_definition/properties/contexts | type: array; description: Link the situations in which buyers recognize or act on this demand. |  |
| /$defs/market_definition/properties/contexts/items |  | ../metamodel.schema.yaml#/$defs/context_ref |
| /$defs/market_definition/properties/forces | type: array; description: Environmental forces affecting this market. Link the external developments shaping demand or competition in this market. |  |
| /$defs/market_definition/properties/forces/items |  | ../metamodel.schema.yaml#/$defs/market_force_ref |
| /$defs/market_definition/properties/position_maps | type: array; description: Competitive position maps for this market. |  |
| /$defs/market_definition/properties/position_maps/items |  | ../metamodel.schema.yaml#/$defs/position_map_ref |
| /$defs/market_definition/properties/opportunities | type: array; description: Identified opportunities within this market. Link the opportunities the team is considering within this market. |  |
| /$defs/market_definition/properties/opportunities/items |  | ../metamodel.schema.yaml#/$defs/opportunity_ref |
| /$defs/market_definition/properties/observed_at | type: string; pattern: ^\d{4}-\d{2}-\d{2}$; description: When this market definition was last validated. |  |
| /$defs/market_definition/properties/evidence_refs | description: Link the evidence records a reviewer can consult to check these claims. | ../metamodel.schema.yaml#/$defs/evidence_refs |
| /$defs/market_definition/properties/geo_scope | description: Optional geographic applicability of this market definition. See metamodel.geo_scope. Added in v1.4.0.  | ../metamodel.schema.yaml#/$defs/geo_scope |
| /$defs/market_definition/properties/tags | description: Add reusable labels that help readers find related records. | ../metamodel.schema.yaml#/$defs/tags |
| /$defs/sizing_tier | type: object; required: ["value"]; additionalProperties: false; description: Express one sizing estimate with its unit, assumptions, and evidentiary basis. |  |
| /$defs/sizing_tier/properties/value | type: string; description: Total size estimate (e.g., '$4.2B', '120M users'). |  |
| /$defs/sizing_tier/properties/value_numeric | type: number; description: Machine-readable value in base currency units. |  |
| /$defs/sizing_tier/properties/currency | type: string; description: ISO 4217 currency code (e.g., 'USD', 'EUR'). |  |
| /$defs/sizing_tier/properties/unit | type: string; enum: ["revenue","users","transactions","units","other"]; description: What the value measures. Choose what is counted so reviewers can compare estimates on the same basis. |  |
| /$defs/sizing_tier/properties/methodology | type: string; description: How this tier was calculated (e.g., 'Gartner 2025 × US SMB share'). |  |
| /$defs/sizing_tier/properties/constraints | type: array; description: Scope constraints (e.g., 'US only', 'companies <500 employees'). |  |
| /$defs/sizing_tier/properties/constraints/items | type: string |  |
| /$defs/sizing_tier/properties/assumptions | type: array; description: Key assumptions (e.g., '15% annual SaaS adoption growth'). |  |
| /$defs/sizing_tier/properties/assumptions/items | type: string |  |
| /$defs/sizing_tier/properties/segments | type: array; description: Breakdown of this tier into sub-segments. |  |
| /$defs/sizing_tier/properties/segments/items |  | #/$defs/sizing_segment |
| /$defs/sizing_tier/properties/confidence | description: Choose the evidence level warranted by the data and method behind the estimate. | ../metamodel.schema.yaml#/$defs/evidence_level |
| /$defs/sizing_tier/properties/evidence_refs | description: Link the evidence records a reviewer can consult to check these claims. | ../metamodel.schema.yaml#/$defs/evidence_refs |
| /$defs/sizing_segment | type: object; required: ["name","value"]; additionalProperties: false; description: Record a portion of a sizing estimate and explain its relationship to the parent total. |  |
| /$defs/sizing_segment/properties/name | type: string; description: Segment name (e.g., 'Real estate agents', 'Freelance designers'). |  |
| /$defs/sizing_segment/properties/value | type: string; description: Segment size estimate. Include a readable unit or range when presenting the segment estimate. |  |
| /$defs/sizing_segment/properties/value_numeric | type: number; description: Provide the amount on the same basis used for the parent estimate. |  |
| /$defs/sizing_segment/properties/share_of_parent | type: string; description: Percentage of parent tier (e.g., '23%'). |  |
| /$defs/sizing_segment/properties/actors | type: array; description: Actor types in this segment. Link the actor groups counted in this portion of the estimate. |  |
| /$defs/sizing_segment/properties/actors/items |  | ../metamodel.schema.yaml#/$defs/actor_ref |
| /$defs/sizing_segment/properties/needs | type: array; description: Primary needs of this segment. Link the needs whose demand is included in this sizing segment. |  |
| /$defs/sizing_segment/properties/needs/items |  | ../metamodel.schema.yaml#/$defs/need_ref |
| /$defs/sizing_segment/properties/growth_rate | type: string; description: State the change over a named period so it can be compared with other estimates. |  |
| /$defs/sizing_segment/properties/evidence_refs | description: Link the evidence records a reviewer can consult to check these claims. | ../metamodel.schema.yaml#/$defs/evidence_refs |
| /$defs/market_segment | type: object; required: ["name"]; additionalProperties: false; description: Describe a recognizable portion of market demand and why it merits separate analysis. |  |
| /$defs/market_segment/properties | description: {"description":"Explain what gives this group a distinct buying situation or demand pattern.","type":"string"} |  |
| /$defs/market_segment/properties/name | type: string; description: Name the group using a trait that distinguishes it from nearby segments. |  |
| /$defs/market_segment/properties/description | type: string; description: Explain what gives this group a distinct buying situation or demand pattern. |  |
| /$defs/market_segment/properties/segment_type | type: string; enum: ["geographic","vertical","firmographic","behavioral","use-case"]; description: Choose the main basis used to draw the segment boundary. |  |
| /$defs/market_segment/properties/actors | type: array; description: Link the roles whose needs or decisions characterize this segment. |  |
| /$defs/market_segment/properties/actors/items |  | ../metamodel.schema.yaml#/$defs/actor_ref |
| /$defs/market_segment/properties/needs | type: array; description: Link the needs that explain why the segment merits separate analysis. |  |
| /$defs/market_segment/properties/needs/items |  | ../metamodel.schema.yaml#/$defs/need_ref |
| /$defs/market_segment/properties/sizing | description: Optional segment-level sizing. Estimate this segment using the units and assumptions appropriate to its scope. | #/$defs/sizing_tier |
| /$defs/market_segment/properties/growth_rate | type: string; description: State how fast demand is changing and over what period. |  |
| /$defs/market_segment/properties/penetration | type: string; description: Current market penetration for this segment (e.g., '8% adoption'). |  |
| /$defs/market_segment/properties/evidence_refs | description: Link the evidence records a reviewer can consult to check these claims. | ../metamodel.schema.yaml#/$defs/evidence_refs |
| /$defs/market_segment/properties/tags | description: Add reusable labels that help readers find related records. | ../metamodel.schema.yaml#/$defs/tags |
| /$defs/market_force | type: object; required: ["id","name","force_type","direction"]; additionalProperties: false; description: Describe an external change and trace its effect on the market. |  |
| /$defs/market_force/properties | description: {"description":"Explain how the development affects buyers, sellers, or the conditions of competition.","type":"string"} |  |
| /$defs/market_force/properties/id | description: Keep this identifier stable as observations about the force accumulate. | ../metamodel.schema.yaml#/$defs/market_force_ref |
| /$defs/market_force/properties/name | type: string; description: Force name (e.g., 'AI adoption in SMB operations'). |  |
| /$defs/market_force/properties/description | type: string; description: Explain how the development affects buyers, sellers, or the conditions of competition. |  |
| /$defs/market_force/properties/force_type | type: string; enum: ["technological","economic","social","political","regulatory","environmental","industry","behavioral"]; description: Category of force. Aligns with PESTEL + industry/behavioral. |  |
| /$defs/market_force/properties/direction | type: string; enum: ["emerging","accelerating","stable","decelerating","reversing"]; description: Current trajectory of this force. Classify how the force is changing relative to previous observations. |  |
| /$defs/market_force/properties/impact | description: Assessed impact level (reuses priority enum: critical/high/medium/low). | ../metamodel.schema.yaml#/$defs/priority |
| /$defs/market_force/properties/time_horizon | type: string; enum: ["immediate","near-term","medium-term","long-term"]; description: When this force will peak in impact. immediate=0-6mo, near-term=6-18mo, medium-term=18mo-3yr, long-term=3yr+.  |  |
| /$defs/market_force/properties/affected_needs | type: array; description: Needs this force amplifies or diminishes. |  |
| /$defs/market_force/properties/affected_needs/items |  | ../metamodel.schema.yaml#/$defs/need_ref |
| /$defs/market_force/properties/affected_actors | type: array; description: Actors most impacted by this force. |  |
| /$defs/market_force/properties/affected_actors/items |  | ../metamodel.schema.yaml#/$defs/actor_ref |
| /$defs/market_force/properties/affected_markets | type: array; description: Link the markets in which the force has a plausible effect. |  |
| /$defs/market_force/properties/affected_markets/items |  | ../metamodel.schema.yaml#/$defs/market_ref |
| /$defs/market_force/properties/creates_opportunities | type: array; description: Opportunities enabled or amplified by this force. |  |
| /$defs/market_force/properties/creates_opportunities/items |  | ../metamodel.schema.yaml#/$defs/opportunity_ref |
| /$defs/market_force/properties/creates_threats | type: array; description: Threat descriptions created by this force. |  |
| /$defs/market_force/properties/creates_threats/items | type: string |  |
| /$defs/market_force/properties/observed_at | type: string; pattern: ^\d{4}-\d{2}-\d{2}$; description: Date the observation so later reviewers can reassess its relevance. |  |
| /$defs/market_force/properties/confidence | description: Classify the evidence supporting the force and its projected effect. | ../metamodel.schema.yaml#/$defs/evidence_level |
| /$defs/market_force/properties/evidence_refs | description: Link the evidence records a reviewer can consult to check these claims. | ../metamodel.schema.yaml#/$defs/evidence_refs |
| /$defs/market_force/properties/geo_scope | description: Optional geographic applicability of this market force. See metamodel.geo_scope. Added in v1.4.0.  | ../metamodel.schema.yaml#/$defs/geo_scope |
| /$defs/market_force/properties/tags | description: Add reusable labels that help readers find related records. | ../metamodel.schema.yaml#/$defs/tags |

## market/opportunities.schema.yaml

Brandvoice Market - Opportunities

| JSON Pointer | Type / constraints | Reference |
|---|---|---|
| / | type: object; required: ["version"]; additionalProperties: false; description: Strategic opportunities, competitive position maps, and white space analysis. The analytical layer that identifies where brand strategy should focus.  |  |
| /properties/version | description: Track changes to the content of this model file using semantic versioning. | ../metamodel.schema.yaml#/$defs/semver |
| /properties/schemaVersion | description: Declare which Brandvoice schema release this file targets. | ../metamodel.schema.yaml#/$defs/schema_version |
| /properties/scope | description: Set the local namespace used to distinguish identifiers across model scopes. | ../metamodel.schema.yaml#/$defs/context_prefix |
| /properties/tags | description: Add reusable labels that help readers find related records. | ../metamodel.schema.yaml#/$defs/tags |
| /properties/opportunities | type: array; description: Strategic opportunity theses backed by evidence. |  |
| /properties/opportunities/items |  | #/$defs/opportunity |
| /properties/position_maps | type: array; description: Competitive position maps with white space analysis. |  |
| /properties/position_maps/items |  | #/$defs/position_map |
| /$defs/opportunity | type: object; required: ["id","name","thesis","status"]; additionalProperties: false; description: Frame an opening as a testable thesis about demand and strategic fit. |  |
| /$defs/opportunity/properties/id | description: Keep the identifier stable as research changes the opportunity's assessment. | ../metamodel.schema.yaml#/$defs/opportunity_ref |
| /$defs/opportunity/properties/name | type: string; description: Short opportunity label. Name the opening in terms reviewers can recognize across research and planning. |  |
| /$defs/opportunity/properties/thesis | type: string; description: Full strategic thesis. Template: 'We believe [actor] has [need] that is [fulfillment level] because [gap]. Given [force], there is a window to [hypothesis].'  |  |
| /$defs/opportunity/properties/status | type: string; enum: ["identified","exploring","validating","validated","pursued","abandoned"]; description: Current state of opportunity investigation. Update the stage as the team investigates, validates, pursues, or abandons the opening. |  |
| /$defs/opportunity/properties/target_actors | type: array; description: Actor segments this opportunity targets. Link the actors expected to act on the opportunity. |  |
| /$defs/opportunity/properties/target_actors/items |  | ../metamodel.schema.yaml#/$defs/actor_ref |
| /$defs/opportunity/properties/unmet_needs | type: array; description: Needs that are underserved or unmet. |  |
| /$defs/opportunity/properties/unmet_needs/items |  | ../metamodel.schema.yaml#/$defs/need_ref |
| /$defs/opportunity/properties/demand_intensity | description: How strongly buyers signal demand in this space. | ../metamodel.schema.yaml#/$defs/demand_intensity |
| /$defs/opportunity/properties/buyer_readiness | description: Dominant awareness stage of buyers in this opportunity. | ../metamodel.schema.yaml#/$defs/buyer_readiness |
| /$defs/opportunity/properties/enabling_forces | type: array; description: Market forces that create or widen this opportunity. |  |
| /$defs/opportunity/properties/enabling_forces/items |  | ../metamodel.schema.yaml#/$defs/market_force_ref |
| /$defs/opportunity/properties/blocking_forces | type: array; description: Market forces that threaten or narrow this opportunity. |  |
| /$defs/opportunity/properties/blocking_forces/items |  | ../metamodel.schema.yaml#/$defs/market_force_ref |
| /$defs/opportunity/properties/time_horizon | type: string; enum: ["immediate","near-term","medium-term","long-term"]; description: Estimate when the opportunity is likely to become actionable. |  |
| /$defs/opportunity/properties/window_closes | type: string; description: What could close this window (e.g., 'competitor launch', 'regulation'). |  |
| /$defs/opportunity/properties/market_refs | type: array; description: Markets this opportunity exists within. Link the markets whose boundaries constrain the opportunity estimate. |  |
| /$defs/opportunity/properties/market_refs/items |  | ../metamodel.schema.yaml#/$defs/market_ref |
| /$defs/opportunity/properties/estimated_size | type: string; description: Opportunity size estimate (e.g., '20% of $800M SAM = $160M'). |  |
| /$defs/opportunity/properties/estimated_size_numeric | type: number; description: Machine-readable size in base currency units. |  |
| /$defs/opportunity/properties/current_gap | type: string; description: What's missing in how the market currently addresses this need. |  |
| /$defs/opportunity/properties/competitor_refs | type: array; description: Competitors that fail to address this opportunity (or don't exist). |  |
| /$defs/opportunity/properties/competitor_refs/items |  | ../metamodel.schema.yaml#/$defs/competitor_ref |
| /$defs/opportunity/properties/white_space_refs | type: array; description: Stable references to white space entries in related position maps. Rationale: durable IDs make strategic traceability safer than string labels.  |  |
| /$defs/opportunity/properties/white_space_refs/items |  | ../metamodel.schema.yaml#/$defs/white_space_ref |
| /$defs/opportunity/properties/position_map_refs | type: array; description: Position maps where this opportunity's white space is visible. |  |
| /$defs/opportunity/properties/position_map_refs/items |  | ../metamodel.schema.yaml#/$defs/position_map_ref |
| /$defs/opportunity/properties/addressed_by_offerings | type: array; description: Offerings that respond to this opportunity. |  |
| /$defs/opportunity/properties/addressed_by_offerings/items |  | ../metamodel.schema.yaml#/$defs/offering_ref |
| /$defs/opportunity/properties/addressed_by_positioning | type: array; description: Positioning statements built on this opportunity. |  |
| /$defs/opportunity/properties/addressed_by_positioning/items |  | ../metamodel.schema.yaml#/$defs/position_ref |
| /$defs/opportunity/properties/addressed_by_values | type: array; description: Value propositions targeting this opportunity. Link the value propositions intended to address the opening. |  |
| /$defs/opportunity/properties/addressed_by_values/items |  | ../metamodel.schema.yaml#/$defs/value_ref |
| /$defs/opportunity/properties/confidence | description: Choose the evidence level warranted by the research behind the thesis. | ../metamodel.schema.yaml#/$defs/evidence_level |
| /$defs/opportunity/properties/validated_by | type: array; description: Evidence supporting this opportunity. List evidence records that materially support the testable thesis. |  |
| /$defs/opportunity/properties/validated_by/items |  | ../metamodel.schema.yaml#/$defs/evidence_ref |
| /$defs/opportunity/properties/invalidated_by | type: array; description: Evidence challenging this opportunity. List evidence records that contradict the thesis or one of its assumptions. |  |
| /$defs/opportunity/properties/invalidated_by/items |  | ../metamodel.schema.yaml#/$defs/evidence_ref |
| /$defs/opportunity/properties/related_experiments | type: array; description: Experiments designed to validate or invalidate this opportunity. |  |
| /$defs/opportunity/properties/related_experiments/items |  | ../metamodel.schema.yaml#/$defs/test_ref |
| /$defs/opportunity/properties/observed_at | type: string; pattern: ^\d{4}-\d{2}-\d{2}$; description: When this opportunity was first identified. |  |
| /$defs/opportunity/properties/evidence_refs | description: Link the evidence records a reviewer can consult to check these claims. | ../metamodel.schema.yaml#/$defs/evidence_refs |
| /$defs/opportunity/properties/geo_scope | description: Optional geographic applicability of this opportunity. See metamodel.geo_scope. Added in v1.4.0.  | ../metamodel.schema.yaml#/$defs/geo_scope |
| /$defs/opportunity/properties/tags | description: Add reusable labels that help readers find related records. | ../metamodel.schema.yaml#/$defs/tags |
| /$defs/position_map | type: object; required: ["id","name","axes"]; additionalProperties: false; description: Compare alternatives on buyer-relevant dimensions and record gaps worth investigating. |  |
| /$defs/position_map/properties | description: {"description":"Explain the comparison question the map should help readers answer.","type":"string"} |  |
| /$defs/position_map/properties/id | description: Keep the map identifier stable when evidence changes placements or axes. | ../metamodel.schema.yaml#/$defs/position_map_ref |
| /$defs/position_map/properties/name | type: string; description: Map title (e.g., 'SMB PM Tools: Price vs. Automation Depth'). |  |
| /$defs/position_map/properties/description | type: string; description: Explain the comparison question the map should help readers answer. |  |
| /$defs/position_map/properties/market_refs | type: array; description: Link the markets in which these comparisons are meaningful. |  |
| /$defs/position_map/properties/market_refs/items |  | ../metamodel.schema.yaml#/$defs/market_ref |
| /$defs/position_map/properties/axes | type: array; description: Choose at least two dimensions buyers can use to evaluate alternatives. |  |
| /$defs/position_map/properties/axes/items |  | #/$defs/map_axis |
| /$defs/position_map/properties/placements | type: array; description: Place the relevant alternatives on the axes defined for this map. |  |
| /$defs/position_map/properties/placements/items |  | #/$defs/map_placement |
| /$defs/position_map/properties/white_spaces | type: array; description: Record regions where buyers may lack suitable options. |  |
| /$defs/position_map/properties/white_spaces/items |  | #/$defs/white_space |
| /$defs/position_map/properties/observed_at | type: string; pattern: ^\d{4}-\d{2}-\d{2}$; description: When this map was created or last validated. |  |
| /$defs/position_map/properties/evidence_refs | description: Link the evidence records a reviewer can consult to check these claims. | ../metamodel.schema.yaml#/$defs/evidence_refs |
| /$defs/position_map/properties/tags | description: Add reusable labels that help readers find related records. | ../metamodel.schema.yaml#/$defs/tags |
| /$defs/map_axis | type: object; required: ["name","low_label","high_label"]; additionalProperties: false; description: Define a comparison dimension with interpretable endpoints for evaluating alternatives. |  |
| /$defs/map_axis/properties/name | type: string; description: Axis name (e.g., 'Price', 'Feature Depth', 'Ease of Use'). |  |
| /$defs/map_axis/properties/low_label | type: string; description: Label for the low end (e.g., 'Free/Low-cost'). |  |
| /$defs/map_axis/properties/high_label | type: string; description: Label for the high end (e.g., 'Enterprise pricing'). |  |
| /$defs/map_axis/properties/buyer_importance | description: How much buyers weight this dimension in decisions. | ../metamodel.schema.yaml#/$defs/priority |
| /$defs/map_axis/properties/evidence_refs | description: Evidence that buyers evaluate on this axis. | ../metamodel.schema.yaml#/$defs/evidence_refs |
| /$defs/map_placement | type: object; required: ["entity","coordinates"]; additionalProperties: false; description: Locate one entity using the dimensions defined by the parent map. |  |
| /$defs/map_placement/properties/entity | type: string; description: The entity being placed. Use BRD### for own brand, CPR### for competitors. Accepts any valid brand_ref or competitor_ref.  |  |
| /$defs/map_placement/properties/label | type: string; description: Optional display label if different from entity name. |  |
| /$defs/map_placement/properties/coordinates | type: object; additionalProperties: true; description: Position on each axis. Keys are axis names, values are 0-100. Example: { 'Price': 25, 'Feature Depth': 80 }  |  |
| /$defs/map_placement/properties/movement | type: object; additionalProperties: false; description: Optional trend - where this entity is heading. |  |
| /$defs/map_placement/properties/movement/properties/direction | type: object; additionalProperties: true; description: Per-axis movement direction. Keys are axis names, values are 'increasing', 'stable', or 'decreasing'.  |  |
| /$defs/map_placement/properties/movement/properties/velocity | type: string; enum: ["slow","moderate","fast"]; description: Classify how quickly the placement appears to be changing. |  |
| /$defs/map_placement/properties/observed_at | type: string; pattern: ^\d{4}-\d{2}-\d{2}$; description: Record the date represented by the available placement evidence. |  |
| /$defs/map_placement/properties/evidence_refs | description: Link the evidence records a reviewer can consult to check these claims. | ../metamodel.schema.yaml#/$defs/evidence_refs |
| /$defs/white_space | type: object; required: ["id","name","region"]; additionalProperties: false; description: Describe a mapped gap and the buyer signals that warrant investigating it. |  |
| /$defs/white_space/properties | description: {"type":"string","description":"Why this gap exists and why it matters."} |  |
| /$defs/white_space/properties/id | description: Stable identifier for this white space region. | ../metamodel.schema.yaml#/$defs/white_space_ref |
| /$defs/white_space/properties/name | type: string; description: White space label (e.g., 'Affordable + Advanced Automation'). |  |
| /$defs/white_space/properties/description | type: string; description: Why this gap exists and why it matters. |  |
| /$defs/white_space/properties/region | type: object; additionalProperties: true; description: Coordinate ranges defining this white space on the map. Keys are axis names, values are objects with min/max (0-100). Example: { 'Price': { min: 10, max: 40 }, 'Automation': { min: 60, max: 90 } }  |  |
| /$defs/white_space/properties/demand_signal | type: string; description: Evidence of buyer interest in this region (e.g., 'search volume for affordable AI tools'). |  |
| /$defs/white_space/properties/demand_intensity | description: Classify the strength of demand for options in this region. | ../metamodel.schema.yaml#/$defs/demand_intensity |
| /$defs/white_space/properties/buyer_readiness | description: Dominant awareness level of buyers attracted to this space. | ../metamodel.schema.yaml#/$defs/buyer_readiness |
| /$defs/white_space/properties/unmet_needs | type: array; description: Needs that would be served by filling this space. |  |
| /$defs/white_space/properties/unmet_needs/items |  | ../metamodel.schema.yaml#/$defs/need_ref |
| /$defs/white_space/properties/target_actors | type: array; description: Actor segments most attracted to this region. |  |
| /$defs/white_space/properties/target_actors/items |  | ../metamodel.schema.yaml#/$defs/actor_ref |
| /$defs/white_space/properties/willingness_to_pay | type: object; additionalProperties: false; description: Buyer spending potential in this white space. Record the price evidence and assumptions behind the assessment of buyer willingness. |  |
| /$defs/white_space/properties/willingness_to_pay/properties/estimate | type: string; description: Price range estimate (e.g., '$50-100/mo', '$500-2000/yr'). |  |
| /$defs/white_space/properties/willingness_to_pay/properties/estimate_numeric_low | type: number; description: Low end in base currency units (monthly). |  |
| /$defs/white_space/properties/willingness_to_pay/properties/estimate_numeric_high | type: number; description: High end in base currency units (monthly). |  |
| /$defs/white_space/properties/willingness_to_pay/properties/basis | type: string; description: How this was estimated (e.g., 'competitor pricing + survey data'). |  |
| /$defs/white_space/properties/willingness_to_pay/properties/price_sensitivity | type: string; enum: ["very-sensitive","sensitive","moderate","low-sensitivity","price-insensitive"]; description: Classify how readily buyers in this region change choices when prices change. |  |
| /$defs/white_space/properties/willingness_to_pay/properties/confidence | description: Choose the evidence level warranted by the price research. | ../metamodel.schema.yaml#/$defs/evidence_level |
| /$defs/white_space/properties/willingness_to_pay/properties/evidence_refs | description: Link the evidence records a reviewer can consult to check these claims. | ../metamodel.schema.yaml#/$defs/evidence_refs |
| /$defs/white_space/properties/estimated_size | type: string; description: Revenue or volume potential of this white space. |  |
| /$defs/white_space/properties/estimated_size_numeric | type: number; description: Provide the numeric estimate on the basis stated in the readable size estimate. |  |
| /$defs/white_space/properties/related_opportunities | type: array; description: Link the opportunity theses that propose ways to address this gap. |  |
| /$defs/white_space/properties/related_opportunities/items |  | ../metamodel.schema.yaml#/$defs/opportunity_ref |
| /$defs/white_space/properties/competitor_adjacents | type: array; description: Competitors closest to this region who might expand into it. |  |
| /$defs/white_space/properties/competitor_adjacents/items |  | ../metamodel.schema.yaml#/$defs/competitor_ref |
| /$defs/white_space/properties/entry_barriers | type: array; description: What makes it hard to fill this gap (e.g., 'technical complexity', 'regulation'). |  |
| /$defs/white_space/properties/entry_barriers/items | type: string |  |
| /$defs/white_space/properties/evidence_refs | description: Link the evidence records a reviewer can consult to check these claims. | ../metamodel.schema.yaml#/$defs/evidence_refs |

## metamodel.schema.yaml

Brandvoice Metamodel

| JSON Pointer | Type / constraints | Reference |
|---|---|---|
| / | description: Cross-cutting definitions for brandvoice schemas. Provides typed IDs, versioning, shared refs, optional links to blueprint entities, and common traceability patterns for strategy, activation, and governance planes.  |  |
| /$defs/semver | type: string; pattern: ^\d+\.\d+\.\d+$; description: Semantic version string (MAJOR.MINOR.PATCH). |  |
| /$defs/schema_version | type: string; enum: ["1.1.0","1.3.0","1.4.0","1.5.0","1.6.0","1.6.1","1.6.2","1.7.0","1.8.0","1.9.0","1.9.1","1.9.2","1.9.3"]; description: Brandvoice schema version constant for the v1 suite. v1.3.0 includes viewer-oriented empathy, SWOT, and VPC enrichments (formerly described under v1.2.0), plus brand_scripts (BSC) for multiple StoryBrand / narrative backbones per brand and optional brand_script_ref on messages. v1.4.0 adds an optional `geo_scope` object (see `$defs/geo_scope`) on market-level entities - evidence, markets, competitors, forces, opportunities, risks - so multi-region portfolios can tag provenance and applicability without losing backward compatibility. v1.5.0 adds capacity planning entities: `priority_stream (PRI###)` for revenue stream prioritization and `roadmap_phase (RMP###)` for quarterly roadmap phases, both modeled in `strategy/capacity-priorities.yaml`. v1.6.0 adds `ecosystem_player (EPL###)` in `market/ecosystem.yaml` - a first-class entity for referral partners, co-presenters, distribution channels, complementary experts, and coopetition peers. Distinct from competitor (CPR): competitors frame competitive threat and need-fit, ecosystem players frame cooperation intent, relationship status, and collaboration ideas. Entries that are both (e.g., a direct competitor who could also co-present) link to the CPR side via `also_competitor_ref`. v1.6.2 accepts `BSC` ids in `any_entity_ref`, widens the evidence `type` and `source_type` vocabularies and adds the `x-gdsm.modeling_guidance` ledger. v1.7.0 adds three optional fields: `superseded_by` on an evidence record (the evidence records that replace its claims), and `status` (active, beta, deprioritized, sunset) and `superseded_by` (the offerings that replace it) on an offering. v1.8.0: a brand-core file requires only `version`, so a file holding only tone, verbal, asset or profile entries validates on its own. v1.9.0 adds five optional fields: `target_audiences` and `competitors` on an offering, `evidence_level` and `description` on an audience, and `evidence_level` on a persona. v1.9.1 recommends five story framework names for `narrative_backbone.framework`; the field stays a free string.  |  |
| /$defs/tags | type: array; description: Free-form tags for filtering and grouping. |  |
| /$defs/tags/items | type: string |  |
| /$defs/context_prefix | type: string; pattern: ^[a-z][a-z0-9-]*$; description: Scope prefix in kebab-case for multi-brand or multi-market modeling. |  |
| /$defs/brand_ref | type: string; pattern: ^([a-z][a-z0-9-]*\.)?BRD\d{3}$; description: Brand identity reference. Identify the brand that owns the strategy or assets being modeled. |  |
| /$defs/brand_script_ref | type: string; pattern: ^([a-z][a-z0-9-]*\.)?BSC\d{3}$; description: Brand narrative script reference (StoryBrand / SB7-style backbone or other framework rows scoped to one brand). Rationale: one BRD can own multiple scripts for different audiences.  |  |
| /$defs/audience_ref | type: string; pattern: ^([a-z][a-z0-9-]*\.)?AUD\d{3}$; description: Audience segment reference. Identify the audience segment chosen for a communication decision. |  |
| /$defs/persona_ref | type: string; pattern: ^([a-z][a-z0-9-]*\.)?PER\d{3}$; description: Persona reference. Identify the research-based profile used to represent a recurring audience pattern. |  |
| /$defs/job_ref | type: string; pattern: ^([a-z][a-z0-9-]*\.)?JOB\d{3}$; description: Jobs-to-be-done reference. Identify the progress someone seeks in a particular situation. |  |
| /$defs/value_ref | type: string; pattern: ^([a-z][a-z0-9-]*\.)?VAL\d{3}$; description: Value proposition reference. Identify the promise of value that addresses the linked audience needs. |  |
| /$defs/position_ref | type: string; pattern: ^([a-z][a-z0-9-]*\.)?POS\d{3}$; description: Positioning reference. Identify the strategic positioning used to frame the brand against alternatives. |  |
| /$defs/message_ref | type: string; pattern: ^([a-z][a-z0-9-]*\.)?MSG\d{3}$; description: Message reference. Identify the individual message selected to convey a claim. |  |
| /$defs/proof_ref | type: string; pattern: ^([a-z][a-z0-9-]*\.)?PRF\d{3}$; description: Proof point reference. Identify the proof point readers can consult to substantiate a claim. |  |
| /$defs/tone_ref | type: string; pattern: ^([a-z][a-z0-9-]*\.)?TON\d{3}$; description: Tone guideline reference. Identify the guidance used to adapt expression to the audience or situation. |  |
| /$defs/verbal_guideline_ref | type: string; pattern: ^([a-z][a-z0-9-]*\.)?VRB\d{3}$; description: Verbal guideline reference. Identify the reusable writing rule relevant to this expression. |  |
| /$defs/asset_ref | type: string; pattern: ^([a-z][a-z0-9-]*\.)?AST\d{3}$; description: Distinctive brand asset reference. Identify the distinctive element used to make the brand recognizable. |  |
| /$defs/archetype_ref | type: string; pattern: ^([a-z][a-z0-9-]*\.)?ARC\d{3}$; description: Brand archetype reference. Identify the archetype guiding recognizable brand behavior and expression. |  |
| /$defs/model_ref | type: string; pattern: ^([a-z][a-z0-9-]*\.)?BMD\d{3}$; description: Business model strategy element reference. Identify the business model element that explains how value is created or captured. |  |
| /$defs/channel_ref | type: string; pattern: ^([a-z][a-z0-9-]*\.)?CHN\d{3}$; description: Channel reference. Identify the touchpoint through which an audience encounters the brand. |  |
| /$defs/campaign_ref | type: string; pattern: ^([a-z][a-z0-9-]*\.)?CMP\d{3}$; description: Campaign reference. Identify the campaign coordinating activity around a defined objective. |  |
| /$defs/content_ref | type: string; pattern: ^([a-z][a-z0-9-]*\.)?CNT\d{3}$; description: Content asset reference. Identify the deliverable that carries a message in a specified format. |  |
| /$defs/actor_ref | type: string; pattern: ^([a-z][a-z0-9-]*\.)?ACT\d{3}$; description: Actor reference. Identify the role whose behavior or needs matter to the record. |  |
| /$defs/need_ref | type: string; pattern: ^([a-z][a-z0-9-]*\.)?NED\d{3}$; description: Need reference. Identify the problem or desired outcome that motivates the actor. |  |
| /$defs/offering_ref | type: string; pattern: ^([a-z][a-z0-9-]*\.)?OFF\d{3}$; description: Offering reference. Identify the product or service intended to meet a need. |  |
| /$defs/journey_stage_ref | type: string; pattern: ^([a-z][a-z0-9-]*\.)?JSG\d{3}$; description: Journey stage reference. Identify the step in the audience experience where the activity belongs. |  |
| /$defs/action_ref | type: string; pattern: ^([a-z][a-z0-9-]*\.)?ACN\d{3}$; description: Action reference. Identify the behavior an audience member is invited or expected to take. |  |
| /$defs/outcome_ref | type: string; pattern: ^([a-z][a-z0-9-]*\.)?OUT\d{3}$; description: Outcome reference. Identify the intended result associated with an action or activity. |  |
| /$defs/competitor_ref | type: string; pattern: ^([a-z][a-z0-9-]*\.)?CPR\d{3}$; description: Competitor reference. Identify the alternative buyers might choose in the decision being modeled. |  |
| /$defs/context_ref | type: string; pattern: ^([a-z][a-z0-9-]*\.)?CTX\d{3}$; description: Context reference. Identify the situation that shapes an actor's needs or choices. |  |
| /$defs/decision_ref | type: string; pattern: ^([a-z][a-z0-9-]*\.)?DEC\d{3}$; description: Governance decision reference. Identify the decision record containing the rationale for a choice. |  |
| /$defs/evidence_ref | type: string; pattern: ^([a-z][a-z0-9-]*\.)?EVD\d{3}$; description: Evidence record reference. Identify the observation or source record that supports or challenges a claim. |  |
| /$defs/test_ref | type: string; pattern: ^([a-z][a-z0-9-]*\.)?TST\d{3}$; description: Experiment or test reference. Identify the experiment used to check an assumption about the strategy. |  |
| /$defs/metric_ref | type: string; pattern: ^([a-z][a-z0-9-]*\.)?MET\d{3}$; description: Metric reference. Identify the measure used to track a specific observable quantity. |  |
| /$defs/kpi_ref | type: string; pattern: ^([a-z][a-z0-9-]*\.)?KPI\d{3}$; description: KPI reference. Identify the indicator used to judge progress toward a stated objective. |  |
| /$defs/risk_ref | type: string; pattern: ^([a-z][a-z0-9-]*\.)?RSK\d{3}$; description: Risk reference. Identify the uncertain event or condition that could affect the strategy. |  |
| /$defs/migration_ref | type: string; pattern: ^([a-z][a-z0-9-]*\.)?MIG\d{3}$; description: Migration reference. Identify the change record that explains how the model evolved. |  |
| /$defs/personal_brand_profile_ref | type: string; pattern: ^([a-z][a-z0-9-]*\.)?PBP\d{3}$; description: Personal brand profile reference. Identify the profile that guides how an individual presents their brand. |  |
| /$defs/message_house_ref | type: string; pattern: ^([a-z][a-z0-9-]*\.)?MHS\d{3}$; description: Message house reference. Identify the framework that organizes a central message and its supporting pillars. |  |
| /$defs/message_pillar_ref | type: string; pattern: ^([a-z][a-z0-9-]*\.)?MPL\d{3}$; description: Message pillar reference. Identify a supporting argument within its parent message house. |  |
| /$defs/program_ref | type: string; pattern: ^([a-z][a-z0-9-]*\.)?PRG\d{3}$; description: Activation program reference. Identify the sustained initiative that coordinates related campaigns and content. |  |
| /$defs/content_pillar_ref | type: string; pattern: ^([a-z][a-z0-9-]*\.)?CPL\d{3}$; description: Content pillar reference. Identify the recurring editorial theme to which a content asset contributes. |  |
| /$defs/market_ref | type: string; pattern: ^([a-z][a-z0-9-]*\.)?MKT\d{3}$; description: Market reference. Identify the defined market whose buyers and boundaries frame the analysis. |  |
| /$defs/market_force_ref | type: string; pattern: ^([a-z][a-z0-9-]*\.)?MFR\d{3}$; description: Market force reference. Identify the external change shaping demand, competition, or market conditions. |  |
| /$defs/opportunity_ref | type: string; pattern: ^([a-z][a-z0-9-]*\.)?OPP\d{3}$; description: Opportunity reference. Identify the candidate opening whose demand and strategic fit are being assessed. |  |
| /$defs/position_map_ref | type: string; pattern: ^([a-z][a-z0-9-]*\.)?PMP\d{3}$; description: Position map reference. Identify the comparison map that defines the axes used to place alternatives. |  |
| /$defs/white_space_ref | type: string; pattern: ^([a-z][a-z0-9-]*\.)?WSP\d{3}$; description: Position-map white space reference. Identify the region within a position map where demand may be underserved. |  |
| /$defs/priority_stream_ref | type: string; pattern: ^([a-z][a-z0-9-]*\.)?PRI\d{3}$; description: Priority revenue stream reference (added v1.5.0). |  |
| /$defs/roadmap_phase_ref | type: string; pattern: ^([a-z][a-z0-9-]*\.)?RMP\d{3}$; description: Roadmap phase reference (added v1.5.0). |  |
| /$defs/ecosystem_player_ref | type: string; pattern: ^([a-z][a-z0-9-]*\.)?EPL\d{3}$; description: Ecosystem player reference (added v1.6.0). Points to a referral partner, co-presenter, distribution channel, complementary expert, or coopetition peer defined in `market/ecosystem.yaml`. See `$defs/ecosystem_player_ref` in `market/ecosystem.schema.yaml` for the full entity shape.  |  |
| /$defs/file_ref_placeholder | type: object; required: ["$ref"]; additionalProperties: false; description: Composition placeholder used in root brandvoice.yaml plane slots to include a separate YAML file's content at that position. The referenced file is loaded and validated separately against its own plane schema by the per-file validator. Root-level schema only verifies that the wiring is a well-formed single-key `$ref` object.  |  |
| /$defs/file_ref_placeholder/properties |  | [object Object] |
| /$defs/file_ref_placeholder/properties/$ref | type: string; description: Relative path to the plane content file (e.g., 'market/landscape.yaml'). |  |
| /$defs/any_entity_ref | type: string; pattern: ^([a-z][a-z0-9-]*\.)?(BRD&#124;BSC&#124;AUD&#124;PER&#124;JOB&#124;VAL&#124;POS&#124;MSG&#124;PRF&#124;TON&#124;VRB&#124;AST&#124;ARC&#124;BMD&#124;CHN&#124;CMP&#124;CNT&#124;ACT&#124;NED&#124;OFF&#124;JSG&#124;ACN&#124;OUT&#124;CPR&#124;CTX&#124;DEC&#124;TST&#124;MET&#124;KPI&#124;RSK&#124;MIG&#124;PBP&#124;MHS&#124;MPL&#124;PRG&#124;CPL&#124;EVD&#124;MKT&#124;OPP&#124;MFR&#124;PMP&#124;WSP&#124;PRI&#124;RMP&#124;EPL)\d{3}$; description: Reference to any entity in the brandvoice schema. Union of all typed ID prefixes. MAINTENANCE: update this pattern when adding new entity types.  |  |
| /$defs/blueprint_ref | type: string; pattern: ^([a-z][a-z0-9-]*\.)?(CN&#124;CMD&#124;EVT&#124;QRY&#124;DOC&#124;ACT&#124;G&#124;R&#124;D&#124;CAP&#124;TC&#124;EC&#124;ER&#124;SCR&#124;UAC&#124;UNV&#124;TM&#124;DPT&#124;PRT)\d{3}$; description: Optional reference to blueprint entity identifiers. |  |
| /$defs/optional_blueprint_links | type: object; additionalProperties: false; description: Optional links to blueprint entities for integration. |  |
| /$defs/optional_blueprint_links/properties/entities | type: array; description: List the Blueprint identifiers tied to this Brandvoice element. |  |
| /$defs/optional_blueprint_links/properties/entities/items |  | #/$defs/blueprint_ref |
| /$defs/optional_blueprint_links/properties/rationale | type: string; description: Why this brandvoice element links to blueprint entities. |  |
| /$defs/evidence_refs | type: array; description: References to supporting evidence records. |  |
| /$defs/evidence_refs/items |  | #/$defs/evidence_ref |
| /$defs/empathy_map_item | type: object; required: ["statement"]; additionalProperties: false; description: Single observation within an empathy-map quadrant. The statement captures a concrete thought, feeling, signal, pain, or gain associated with the persona. Intensity is optional and supports viewer prioritization.  |  |
| /$defs/empathy_map_item/properties/statement | type: string; description: Empathy observation or quote. Capture one concrete observation in the relevant quadrant. |  |
| /$defs/empathy_map_item/properties/intensity | type: string; enum: ["low","medium","high","critical"]; description: Optional signal strength for visualization or prioritization. |  |
| /$defs/empathy_map_item/properties/evidence_refs | description: Link the evidence records a reviewer can consult to check these claims. | #/$defs/evidence_refs |
| /$defs/empathy_map | type: object; additionalProperties: false; description: Structured empathy map for a persona. All quadrants are optional. Semantics are intentionally distinct from persona.goals and persona.barriers: gains capture value received from a solution, while pains capture current frustrations in the persona's world.  |  |
| /$defs/empathy_map/properties/thinks | type: array; description: Record the questions or assumptions that occupy the persona during the experience. |  |
| /$defs/empathy_map/properties/thinks/items |  | #/$defs/empathy_map_item |
| /$defs/empathy_map/properties/feels | type: array; description: Capture emotions the persona experiences in the relevant situation. |  |
| /$defs/empathy_map/properties/feels/items |  | #/$defs/empathy_map_item |
| /$defs/empathy_map/properties/sees | type: array; description: Record the options, signals, or surroundings the persona notices. |  |
| /$defs/empathy_map/properties/sees/items |  | #/$defs/empathy_map_item |
| /$defs/empathy_map/properties/hears | type: array; description: Capture what other people or channels tell the persona. |  |
| /$defs/empathy_map/properties/hears/items |  | #/$defs/empathy_map_item |
| /$defs/empathy_map/properties/says_and_does | type: array; description: Record what the persona expresses or does in observable behavior. |  |
| /$defs/empathy_map/properties/says_and_does/items |  | #/$defs/empathy_map_item |
| /$defs/empathy_map/properties/pains | type: array; description: Capture current frustrations that make the experience harder for the persona. |  |
| /$defs/empathy_map/properties/pains/items |  | #/$defs/empathy_map_item |
| /$defs/empathy_map/properties/gains | type: array; description: Capture the value the persona receives when the solution works for them. |  |
| /$defs/empathy_map/properties/gains/items |  | #/$defs/empathy_map_item |
| /$defs/swot_item | type: object; required: ["statement"]; additionalProperties: false; description: Single SWOT statement for strengths or weaknesses. |  |
| /$defs/swot_item/properties/statement | type: string; description: Describe one internal condition that affects the brand strategy. |  |
| /$defs/swot_item/properties/evidence_refs | description: Link the evidence records a reviewer can consult to check these claims. | #/$defs/evidence_refs |
| /$defs/swot_opportunity_item | type: object; required: ["statement"]; additionalProperties: false; description: SWOT opportunity statement with optional canonical opportunity linkage. |  |
| /$defs/swot_opportunity_item/properties/statement | type: string; description: Describe an external development that the brand could act on. |  |
| /$defs/swot_opportunity_item/properties/opportunity_ref | description: Link the detailed opportunity record if the model already tracks it. | #/$defs/opportunity_ref |
| /$defs/swot_opportunity_item/properties/evidence_refs | description: Link the evidence records a reviewer can consult to check these claims. | #/$defs/evidence_refs |
| /$defs/swot_threat_item | type: object; required: ["statement"]; additionalProperties: false; description: SWOT threat statement with optional canonical risk linkage. |  |
| /$defs/swot_threat_item/properties/statement | type: string; description: Describe an external development that could harm the brand strategy. |  |
| /$defs/swot_threat_item/properties/risk_ref | description: Link the risk record that tracks the exposure described here. | #/$defs/risk_ref |
| /$defs/swot_threat_item/properties/evidence_refs | description: Link the evidence records a reviewer can consult to check these claims. | #/$defs/evidence_refs |
| /$defs/swot | type: object; additionalProperties: false; description: SWOT snapshot for a brand. Strengths and weaknesses describe internal factors; opportunities and threats describe external factors.  |  |
| /$defs/swot/properties/strengths | type: array; description: Record capabilities or resources the brand can draw on. |  |
| /$defs/swot/properties/strengths/items |  | #/$defs/swot_item |
| /$defs/swot/properties/weaknesses | type: array; description: Record internal limitations that make strategic work harder. |  |
| /$defs/swot/properties/weaknesses/items |  | #/$defs/swot_item |
| /$defs/swot/properties/opportunities | type: array; description: Record favorable external conditions that could support a strategic move. |  |
| /$defs/swot/properties/opportunities/items |  | #/$defs/swot_opportunity_item |
| /$defs/swot/properties/threats | type: array; description: Record external conditions that could undermine the current strategy. |  |
| /$defs/swot/properties/threats/items |  | #/$defs/swot_threat_item |
| /$defs/vpc_pain_reliever | type: object; required: ["need_ref","mechanism"]; additionalProperties: false; description: Structured pain reliever linking a value proposition to a specific need with an explanation of how the pain is reduced.  |  |
| /$defs/vpc_pain_reliever/properties/need_ref | description: Identify the need behind the frustration this mechanism reduces. | #/$defs/need_ref |
| /$defs/vpc_pain_reliever/properties/mechanism | type: string; description: Explain which step becomes easier and how the offering makes that happen. |  |
| /$defs/vpc_pain_reliever/properties/evidence_refs | description: Link the evidence records a reviewer can consult to check these claims. | #/$defs/evidence_refs |
| /$defs/vpc_gain_creator | type: object; required: ["need_ref","mechanism"]; additionalProperties: false; description: Structured gain creator linking a value proposition to a specific need with an explanation of how the gain is created.  |  |
| /$defs/vpc_gain_creator/properties/need_ref | description: Identify the need addressed by the added value this mechanism creates. | #/$defs/need_ref |
| /$defs/vpc_gain_creator/properties/mechanism | type: string; description: Explain what useful result the offering makes possible for the actor. |  |
| /$defs/vpc_gain_creator/properties/evidence_refs | description: Link the evidence records a reviewer can consult to check these claims. | #/$defs/evidence_refs |
| /$defs/impact_links | type: object; additionalProperties: false; description: Cross-entity impact references for traceability. |  |
| /$defs/impact_links/properties/actors | type: array; description: List the roles whose behavior or responsibilities may change. |  |
| /$defs/impact_links/properties/actors/items |  | #/$defs/actor_ref |
| /$defs/impact_links/properties/needs | type: array; description: List the needs whose importance or fulfillment may change. |  |
| /$defs/impact_links/properties/needs/items |  | #/$defs/need_ref |
| /$defs/impact_links/properties/offerings | type: array; description: List the products or services whose fit or delivery may change. |  |
| /$defs/impact_links/properties/offerings/items |  | #/$defs/offering_ref |
| /$defs/impact_links/properties/channels | type: array; description: List the touchpoints where the audience experience may change. |  |
| /$defs/impact_links/properties/channels/items |  | #/$defs/channel_ref |
| /$defs/impact_links/properties/journey_stages | type: array; description: List the points in the audience journey affected by the change. |  |
| /$defs/impact_links/properties/journey_stages/items |  | #/$defs/journey_stage_ref |
| /$defs/impact_links/properties/actions | type: array; description: List the audience behaviors encouraged or affected by the change. |  |
| /$defs/impact_links/properties/actions/items |  | #/$defs/action_ref |
| /$defs/impact_links/properties/outcomes | type: array; description: List the expected results that may need to be reassessed. |  |
| /$defs/impact_links/properties/outcomes/items |  | #/$defs/outcome_ref |
| /$defs/impact_links/properties/competitors | type: array; description: List the alternatives whose relevance to buyer decisions may change. |  |
| /$defs/impact_links/properties/competitors/items |  | #/$defs/competitor_ref |
| /$defs/impact_links/properties/contexts | type: array; description: List the situations that should be revisited when assessing the change. |  |
| /$defs/impact_links/properties/contexts/items |  | #/$defs/context_ref |
| /$defs/impact_links/properties/markets | type: array; description: List the markets where assumptions or responses may need revision. |  |
| /$defs/impact_links/properties/markets/items |  | #/$defs/market_ref |
| /$defs/impact_links/properties/audiences | type: array; description: List the audience segments affected by the change in strategy. |  |
| /$defs/impact_links/properties/audiences/items |  | #/$defs/audience_ref |
| /$defs/impact_links/properties/values | type: array; description: List the value propositions whose relevance or credibility may change. |  |
| /$defs/impact_links/properties/values/items |  | #/$defs/value_ref |
| /$defs/impact_links/properties/positioning | type: array; description: List the strategic positions that may need re-evaluation. |  |
| /$defs/impact_links/properties/positioning/items |  | #/$defs/position_ref |
| /$defs/impact_links/properties/messages | type: array; description: List the individual messages that may need to be revised. |  |
| /$defs/impact_links/properties/messages/items |  | #/$defs/message_ref |
| /$defs/impact_links/properties/campaigns | type: array; description: List the campaigns that may need an execution adjustment. |  |
| /$defs/impact_links/properties/campaigns/items |  | #/$defs/campaign_ref |
| /$defs/impact_links/properties/kpis | type: array; description: List the indicators whose interpretation or targets may need review. |  |
| /$defs/impact_links/properties/kpis/items |  | #/$defs/kpi_ref |
| /$defs/impact_links/properties/evidence | type: array; description: List the evidence records relevant to reviewing the claimed impact. |  |
| /$defs/impact_links/properties/evidence/items |  | #/$defs/evidence_ref |
| /$defs/impact_links/properties/verbal_guidelines | type: array; description: List the writing conventions that may need an update. |  |
| /$defs/impact_links/properties/verbal_guidelines/items |  | #/$defs/verbal_guideline_ref |
| /$defs/impact_links/properties/ecosystem_players | type: array; description: List the partners or peers whose relationship may be affected. |  |
| /$defs/impact_links/properties/ecosystem_players/items |  | #/$defs/ecosystem_player_ref |
| /$defs/priority | type: string; enum: ["critical","high","medium","low"]; description: Relative importance for planning and execution. |  |
| /$defs/lifecycle_status | type: string; enum: ["draft","active","paused","deprecated","archived"]; description: Lifecycle status of an entity. Indicate whether the record is in preparation, use, suspension, or retirement. |  |
| /$defs/evidence_level | type: string; enum: ["hypothesis","weak-signal","moderate-evidence","strong-evidence"]; description: Confidence level backed by evidence quality. |  |
| /$defs/market_sizing_tier | type: string; enum: ["tam","sam","som"]; description: Market sizing tier. TAM = Total Addressable Market (entire demand universe), SAM = Serviceable Addressable Market (reachable with current model), SOM = Serviceable Obtainable Market (realistic near-term capture).  |  |
| /$defs/demand_intensity | type: string; enum: ["latent","emerging","moderate","strong","urgent"]; description: Strength of buyer demand signal. latent = need exists but buyers don't actively seek solutions, urgent = buyers actively spending to solve now.  |  |
| /$defs/fulfillment_level | type: string; enum: ["unmet","poorly-met","adequately-met","well-met","over-served"]; description: How well a need is currently being served in the market. Based on Christensen's jobs-to-be-done satisfaction spectrum.  |  |
| /$defs/buyer_readiness | type: string; enum: ["unaware","problem-aware","solution-aware","product-aware","ready-to-buy"]; description: Eugene Schwartz awareness stages. Indicates how ready buyers in a segment or white space are to purchase.  |  |
| /$defs/universal_phase | type: string; enum: ["unaware","aware","engaged","committed","active","loyal","advocate"]; description: Normalized journey phase. Maps across frameworks: unaware (pre-funnel), aware (AARRR:acquisition, AIDA:attention, RACE:reach, STDC:see), engaged (AARRR:activation, AIDA:interest, RACE:act, STDC:think), committed (AIDA:desire, RACE:convert, STDC:do), active (AARRR:retention, RACE:convert), loyal (AARRR:revenue, RACE:engage, STDC:care), advocate (AARRR:referral, RACE:engage, STDC:care).  |  |
| /$defs/geo_scope | type: object; required: ["level"]; additionalProperties: false; description: Geographic applicability of a market-level record (evidence, market, competitor, force, opportunity, risk). `level` is the coarse scope the viewer uses for filtering and badges. When `level = country`, the `countries` array names one or more ISO 3166-1 alpha-2 codes - this is how PL-only, DE-only, and multi-country national scopes are expressed. `region_label` carries informal human labels ("DACH", "Nordics", "Pomorze", "Benelux"). Omit the whole block when the record has no meaningful geographic constraint - such records are treated as "untagged" by the viewer (never silently assumed to be any particular region). Added in schema v1.4.0.  |  |
| /$defs/geo_scope/properties/level | type: string; enum: ["local","country","europe","global"]; description: local   - city / voivodeship / metro (pair with `region_label`). country - one or more specific countries (REQUIRES `countries`). europe  - EU / EEA / UK / wider Europe. global  - worldwide.  |  |
| /$defs/geo_scope/properties/countries | type: array; description: ISO 3166-1 alpha-2 country codes (e.g. PL, DE, FR, NL, GB, US). Required when `level = country`; optional otherwise (e.g. to narrow a `europe`-level record to the 2-3 countries it really covers).  |  |
| /$defs/geo_scope/properties/countries/items | type: string; pattern: ^[A-Z]{2}$ |  |
| /$defs/geo_scope/properties/region_label | type: string; description: Informal human label for the scope: "DACH", "Nordics", "Pomorze", "Benelux", etc. Pairs well with `local` and `europe` to give a human-readable chip in the viewer.  |  |
| /$defs/geo_scope/properties/notes | type: string; description: Rationale or caveats for the geographic tag. |  |
| /$defs/geo_scope/allOf/0/if | required: ["level"] |  |
| /$defs/geo_scope/allOf/0/if/properties/level | const: country |  |
| /$defs/geo_scope/allOf/0/then | required: ["countries"] |  |

## migration.schema.yaml

Brandvoice Migration Schema

| JSON Pointer | Type / constraints | Reference |
|---|---|---|
| / | type: object; required: ["migration","changes"]; additionalProperties: false; description: Ordered model changes for brandvoice evolution. Supports both ontology-level structure changes and communication-level campaign/message evolution.  |  |
| /properties/schemaVersion | description: Declare which Brandvoice schema release this file targets. | metamodel.schema.yaml#/$defs/schema_version |
| /properties/migration | type: object; required: ["id","name","date","status","change_scope"]; additionalProperties: false; description: Identify the change record and explain why the model is evolving. |  |
| /properties/migration/properties | description: {"description":"Summarize the change and the effect readers should expect in the model.","type":"string"} |  |
| /properties/migration/properties/id | description: Keep this identifier stable so later records can cite the change. | metamodel.schema.yaml#/$defs/migration_ref |
| /properties/migration/properties/name | type: string; pattern: ^[a-z0-9-]+$; description: Use a short slug that makes this change recognizable in file listings. |  |
| /properties/migration/properties/date | type: string; pattern: ^\d{4}-\d{2}-\d{2}$; description: Record the date associated with the migration record. |  |
| /properties/migration/properties/status | type: string; enum: ["draft","pending","applied","rolled-back"]; description: Distinguish work under discussion, work queued for application, and changes already applied or rolled back. |  |
| /properties/migration/properties/change_scope | type: string; enum: ["ontology","communication","mixed"]; description: ontology=structure/model semantics, communication=campaign/message updates. |  |
| /properties/migration/properties/intent | type: string; enum: ["discover","refine","reclassify","invalidate","pivot","expand","consolidate","measure"]; description: Semantic intent behind this migration. Captures WHY the change was made at a strategic level, complementing the mechanical change kinds (add/modify/deprecate) that describe WHAT changed.  |  |
| /properties/migration/properties/description | type: string; description: Summarize the change and the effect readers should expect in the model. |  |
| /properties/migration/properties/evidence_refs | description: Link the evidence records a reviewer can consult to check these claims. | metamodel.schema.yaml#/$defs/evidence_refs |
| /properties/migration/properties/related_decisions | type: array; description: Link the recorded decisions that explain or authorize the change. |  |
| /properties/migration/properties/related_decisions/items |  | metamodel.schema.yaml#/$defs/decision_ref |
| /properties/migration/properties/tags | description: Add reusable labels that help readers find related records. | metamodel.schema.yaml#/$defs/tags |
| /properties/changes | type: object; additionalProperties: false; description: Group the proposed edits by the part of the model each edit affects. |  |
| /properties/changes/properties/entities | type: array; description: Use these entries to record changes to an entity as a whole. |  |
| /properties/changes/properties/entities/items |  | #/$defs/entity_change |
| /properties/changes/properties/properties | type: array; description: Use these entries for edits to named fields on existing entities. |  |
| /properties/changes/properties/properties/items |  | #/$defs/property_change |
| /properties/changes/properties/relationships | type: array; description: Use these entries for links added, removed, redirected, or otherwise changed between entities. |  |
| /properties/changes/properties/relationships/items |  | #/$defs/relationship_change |
| /properties/changes/properties/content_timeline | type: array; description: Communication-level content and campaign lifecycle changes. |  |
| /properties/changes/properties/content_timeline/items |  | #/$defs/content_change |
| /$defs/entity_change | type: object; required: ["kind","entity_type","target"]; additionalProperties: false; description: Record a whole entity change with enough context to review its effect. |  |
| /$defs/entity_change/properties/kind | type: string; enum: ["add","modify","deprecate","remove","split","merge"]; description: Choose how the record changes across the model revisions. |  |
| /$defs/entity_change/properties/entity_type | type: string; enum: ["actor","action","asset","audience","brand","brand-script","business-model","campaign","channel","competitor","content","context","decision","evidence","experiment","job","journey-stage","kpi","market","market-force","message","metric","need","offering","opportunity","outcome","persona","position-map","positioning","proof","risk","tone","value","verbal-guideline","personal-brand-profile","message-house","message-pillar","program","content-pillar","white-space"]; description: Name the entity kind so reviewers can locate the owning layer. |  |
| /$defs/entity_change/properties/target | type: string; description: Identify the affected entity with its stable model identifier. |  |
| /$defs/entity_change/properties/before | type: object; description: Capture the earlier entity values relevant to reviewing this change. |  |
| /$defs/entity_change/properties/after | type: object; description: Capture the entity values expected after the change is applied. |  |
| /$defs/entity_change/properties/reason | type: string; description: Explain why the entity needs this change and what prompted it. |  |
| /$defs/property_change | type: object; required: ["kind","target","property"]; additionalProperties: false; description: Record an edit to a named field without restating the whole entity. |  |
| /$defs/property_change/properties/kind | type: string; enum: ["set","unset","rename","append","remove-item"]; description: Distinguish replacement, removal, renaming, and collection membership edits. |  |
| /$defs/property_change/properties/target | type: string; description: Identify the entity whose field is being changed. |  |
| /$defs/property_change/properties/property | type: string; description: Name the field on the target record that the edit applies to. |  |
| /$defs/property_change/properties/value | description: Supply the replacement value or the item involved in a collection edit. |  |
| /$defs/property_change/properties/old_value | description: Capture the previous value when reviewers need it to compare versions. |  |
| /$defs/property_change/properties/new_name | type: string; description: Supply the replacement field name for a rename operation. |  |
| /$defs/property_change/properties/reason | type: string; description: Explain why this field needs to change for this entity. |  |
| /$defs/relationship_change | type: object; required: ["kind","subject","predicate","object"]; additionalProperties: false; description: Record a change to a directed relationship between model entities. |  |
| /$defs/relationship_change/properties/kind | type: string; enum: ["add","remove","redirect","modify"]; description: Choose the operation that describes what happens to the link. |  |
| /$defs/relationship_change/properties/subject | type: string; description: Identify the source entity from which the relationship is recorded. |  |
| /$defs/relationship_change/properties/predicate | type: string; description: Name the relationship so the same pair can have distinct links. |  |
| /$defs/relationship_change/properties/object | type: string; description: Identify the relationship target, using the previous target when redirecting a link. |  |
| /$defs/relationship_change/properties/new_object | type: string; description: Provide the replacement target entity when the relationship is redirected. |  |
| /$defs/relationship_change/properties/reason | type: string; description: Explain why the link changes and what modeling decision it represents. |  |
| /$defs/content_change | type: object; required: ["target","change","effective_date"]; additionalProperties: false; description: Record when a change to a message, campaign, or content asset takes effect. |  |
| /$defs/content_change/properties/target | description: Use a typed identifier for the communication record affected by the change. |  |
| /$defs/content_change/properties/target/oneOf/0 |  | metamodel.schema.yaml#/$defs/message_ref |
| /$defs/content_change/properties/target/oneOf/1 |  | metamodel.schema.yaml#/$defs/campaign_ref |
| /$defs/content_change/properties/target/oneOf/2 |  | metamodel.schema.yaml#/$defs/content_ref |
| /$defs/content_change/properties/change | type: string; enum: ["launch","pause","resume","retire","rewrite","resegment","retarget","repurpose"]; description: Choose the event that best describes the change in communication execution. |  |
| /$defs/content_change/properties/effective_date | type: string; pattern: ^\d{4}-\d{2}-\d{2}$; description: Record when the change becomes effective in the communication timeline. |  |
| /$defs/content_change/properties/reason | type: string; description: Explain the audience, timing, or execution consideration behind this change. |  |

## strategy/brand-core.schema.yaml

Brandvoice Strategy - Brand Core

| JSON Pointer | Type / constraints | Reference |
|---|---|---|
| / | type: object; required: ["version"]; additionalProperties: false; description: Core brand identity, narrative backbone, tone system, and distinctive assets. These elements keep communication coherent across channels and campaigns. Rationale: encode durable brand intent and verbal behavior so execution can scale without relying on tacit founder knowledge. Each brand-core file requires only `version`; brands, tone guidelines, verbal identity, distinctive assets and personal profiles may sit in separate files.  |  |
| /properties/version | description: Record the version declared for this Brandvoice model file. | ../metamodel.schema.yaml#/$defs/semver |
| /properties/schemaVersion | description: Identify the Brandvoice schema revision used to author this file. | ../metamodel.schema.yaml#/$defs/schema_version |
| /properties/scope | description: Set the context prefix that identifies the namespace for this file. | ../metamodel.schema.yaml#/$defs/context_prefix |
| /properties/tags | description: Add short labels that help contributors group and find related records. | ../metamodel.schema.yaml#/$defs/tags |
| /properties/brands | type: array; description: Record the distinct brand identities that guide strategy and expression. |  |
| /properties/brands/items |  | #/$defs/brand |
| /properties/brand_scripts | type: array; description: One or more narrative backbones (e.g. StoryBrand BrandScripts) per brand, keyed by brand_ref. Rationale: multiple materially different audiences require separate SB7-level stories while the brand remains a single guide identity on BRD.  |  |
| /properties/brand_scripts/items |  | #/$defs/brand_script |
| /properties/archetypes | type: array; description: Document behavioral archetypes that give writers a consistent character to portray. |  |
| /properties/archetypes/items |  | #/$defs/archetype |
| /properties/tone_guidelines | type: array; description: Collect writing behaviors and calibrations for use across communication contexts. |  |
| /properties/tone_guidelines/items |  | #/$defs/tone |
| /properties/verbal_guidelines | type: array; description: Practical writing system rules (terminology, inclusivity, and syntax). Rationale: teams need explicit lexical guidance, not only abstract tone labels, to produce consistent copy in high-volume operations.  |  |
| /properties/verbal_guidelines/items |  | #/$defs/verbal_guideline |
| /properties/distinctive_assets | type: array; description: Inventory recurring cues that help people recognize the brand across touchpoints. |  |
| /properties/distinctive_assets/items |  | #/$defs/asset |
| /properties/personal_brand_profiles | type: array; description: Optional founder, executive, or expert overlays that describe how an individual communicates within or alongside the broader brand system. Rationale: personal brands often carry the ideas, authority, and relationship capital that organizational messaging alone cannot express.  |  |
| /properties/personal_brand_profiles/items |  | #/$defs/personal_brand_profile |
| /$defs/narrative_backbone | type: object; additionalProperties: false; description: Shared narrative field bundle for brand-level and brand_script-level storytelling.  |  |
| /$defs/narrative_backbone/properties/framework | type: string; description: Name of the story framework this narrative follows. Recommended values: `sb7`, `freytag`, `pixar`, `hero_journey` and `three_act`. Any other name, such as a house framework, is valid. Rationale: a shared name makes interpretation and review deterministic even when teams use different story structures.  |  |
| /$defs/narrative_backbone/properties/hero | type: string; description: Who the story centers on (usually customer). |  |
| /$defs/narrative_backbone/properties/audience_role | type: string; description: How the audience participates in the story (hero, witness, co-builder, movement member). |  |
| /$defs/narrative_backbone/properties/problem | type: string; description: Describe the obstacle the audience experiences before it can make progress. |  |
| /$defs/narrative_backbone/properties/guide | type: string; description: Explain how the brand earns permission to help the audience act. |  |
| /$defs/narrative_backbone/properties/plan | type: string; description: Outline the sequence the audience can follow to resolve the problem. |  |
| /$defs/narrative_backbone/properties/call_to_action | type: string; description: Name the practical next step the story asks the audience to take. |  |
| /$defs/narrative_backbone/properties/success | type: string; description: Show the audience what an improved situation looks like in practice. |  |
| /$defs/narrative_backbone/properties/failure | type: string; description: Describe the credible cost of leaving the audience problem unresolved. |  |
| /$defs/narrative_backbone/properties/core_tension | type: string; description: Central tension the brand helps resolve. Rationale: strong narratives are organized around conflict, not only claims. |  |
| /$defs/narrative_backbone/properties/transformation | type: string; description: Change in identity, capability, or status the audience experiences. |  |
| /$defs/narrative_backbone/properties/proof_basis | type: string; description: Why the story is believable in the real world (evidence, experience, credibility, or operating proof). |  |
| /$defs/narrative_backbone/properties/pattern_blocks | type: object; additionalProperties: true; description: Framework-specific extensions for narrative systems that need additional structure. Rationale: keeps the core narrative validated while still allowing controlled specialization.  |  |
| /$defs/brand_script | type: object; required: ["id","name","brand_ref","narrative"]; additionalProperties: false; description: Organize a reusable story for one brand and its intended audience. |  |
| /$defs/brand_script/properties/id | description: Assign a stable reference so other model records can link to this entry. | ../metamodel.schema.yaml#/$defs/brand_script_ref |
| /$defs/brand_script/properties/name | type: string; description: Label for this script (e.g. segment or persona story name). |  |
| /$defs/brand_script/properties/brand_ref | description: Brand this narrative script belongs to. | ../metamodel.schema.yaml#/$defs/brand_ref |
| /$defs/brand_script/properties/narrative | description: Framework-specific story fields (SB7-like by convention). Canonical copy for this script; BRD.narrative may mirror the default script for backward compatibility.  | #/$defs/narrative_backbone |
| /$defs/brand_script/properties/primary_audience_refs | type: array; description: Audience segments this script primarily targets. |  |
| /$defs/brand_script/properties/primary_audience_refs/items |  | ../metamodel.schema.yaml#/$defs/audience_ref |
| /$defs/brand_script/properties/primary_persona_refs | type: array; description: Personas this script primarily targets. |  |
| /$defs/brand_script/properties/primary_persona_refs/items |  | ../metamodel.schema.yaml#/$defs/persona_ref |
| /$defs/brand_script/properties/is_default | type: boolean; description: When multiple scripts exist for one brand, marks the script that should be used as the umbrella or primary story unless a message or UI selects another.  |  |
| /$defs/brand_script/properties/status | description: Record the lifecycle state that governs how contributors should use this entry. | ../metamodel.schema.yaml#/$defs/lifecycle_status |
| /$defs/brand_script/properties/evidence_refs | description: Link source records that support the claims or choices captured here. | ../metamodel.schema.yaml#/$defs/evidence_refs |
| /$defs/brand_script/properties/tags | description: Add short labels that help contributors group and find related records. | ../metamodel.schema.yaml#/$defs/tags |
| /$defs/brand | type: object; required: ["id","name","promise","purpose"]; additionalProperties: false; description: Describe the strategic intent and portfolio relationships that govern one recognizable brand. |  |
| /$defs/brand/properties/id | description: Assign a stable reference so other model records can link to this entry. | ../metamodel.schema.yaml#/$defs/brand_ref |
| /$defs/brand/properties/name | type: string; description: Use the name by which audiences recognize this brand. |  |
| /$defs/brand/properties/brand_role | type: string; enum: ["organization","product","service","portfolio","personal","initiative"]; description: Strategic role of this brand in the portfolio. Rationale: clarifies whether the modeled brand is the parent system, a sub-brand, or a person-led identity with different communication obligations.  |  |
| /$defs/brand/properties/architecture_role | type: string; enum: ["master-brand","endorsed-brand","sub-brand","standalone-brand","ingredient-brand"]; description: Portfolio architecture role. Rationale: helps teams model branded house, house of brands, and endorsement patterns without relying on narrative interpretation alone.  |  |
| /$defs/brand/properties/purpose | type: string; description: Why the brand exists beyond revenue. Rationale: anchors strategic coherence. |  |
| /$defs/brand/properties/vision | type: string; description: Future state the brand aims to help create. Rationale: helps teams evaluate whether initiatives reinforce long-term direction.  |  |
| /$defs/brand/properties/promise | type: string; description: Primary value promise to customers. Rationale: clarifies the minimum outcome every message and experience should reinforce.  |  |
| /$defs/brand/properties/values | type: array; description: Core decision principles. Rationale: translates brand intent into practical decision filters for content and product teams.  |  |
| /$defs/brand/properties/values/items | type: string |  |
| /$defs/brand/properties/personality | type: array; description: Stable personality traits. |  |
| /$defs/brand/properties/personality/items | type: string |  |
| /$defs/brand/properties/narrative | description: Optional legacy or denormalized narrative backbone on the brand row. When brand_scripts exist, the default script's narrative should match this field for consumers that only read BRD.  |  |
| /$defs/brand/properties/narrative/allOf/0 |  | #/$defs/narrative_backbone |
| /$defs/brand/properties/archetypes | type: array; description: Link the character models that guide this brand's behavior. |  |
| /$defs/brand/properties/archetypes/items |  | ../metamodel.schema.yaml#/$defs/archetype_ref |
| /$defs/brand/properties/tone_refs | type: array; description: Link the writing profiles that express this brand's voice. |  |
| /$defs/brand/properties/tone_refs/items |  | ../metamodel.schema.yaml#/$defs/tone_ref |
| /$defs/brand/properties/asset_refs | type: array; description: Link the distinctive cues approved for recurring brand expression. |  |
| /$defs/brand/properties/asset_refs/items |  | ../metamodel.schema.yaml#/$defs/asset_ref |
| /$defs/brand/properties/market_refs | type: array; description: Identify the markets in which this brand has chosen to operate. |  |
| /$defs/brand/properties/market_refs/items |  | ../metamodel.schema.yaml#/$defs/market_ref |
| /$defs/brand/properties/parent_brand_ref | description: Optional parent or endorsing brand. Rationale: gives portfolio structure explicit graph edges for brand architecture analysis.  | ../metamodel.schema.yaml#/$defs/brand_ref |
| /$defs/brand/properties/child_brand_refs | type: array; description: Optional child or sub-brand references for portfolio navigation. |  |
| /$defs/brand/properties/child_brand_refs/items |  | ../metamodel.schema.yaml#/$defs/brand_ref |
| /$defs/brand/properties/positioning_refs | type: array; description: Positioning statements this brand operationalizes. |  |
| /$defs/brand/properties/positioning_refs/items |  | ../metamodel.schema.yaml#/$defs/position_ref |
| /$defs/brand/properties/pursuing_opportunities | type: array; description: Strategic opportunities this brand is built to capture. |  |
| /$defs/brand/properties/pursuing_opportunities/items |  | ../metamodel.schema.yaml#/$defs/opportunity_ref |
| /$defs/brand/properties/swot | description: Optional SWOT snapshot for this brand. Opportunities may link to OPP entities and threats may link to RSK entities when they exist.  | ../metamodel.schema.yaml#/$defs/swot |
| /$defs/brand/properties/evidence_refs | description: Link source records that support the claims or choices captured here. | ../metamodel.schema.yaml#/$defs/evidence_refs |
| /$defs/brand/properties/status | description: Record the lifecycle state that governs how contributors should use this entry. | ../metamodel.schema.yaml#/$defs/lifecycle_status |
| /$defs/brand/properties/blueprint_links | description: Link Blueprint elements that implement or explain this Brandvoice record. | ../metamodel.schema.yaml#/$defs/optional_blueprint_links |
| /$defs/brand/properties/tags | description: Add short labels that help contributors group and find related records. | ../metamodel.schema.yaml#/$defs/tags |
| /$defs/archetype | type: object; required: ["id","name","description"]; additionalProperties: false; description: Describe a recognizable character pattern and guard against its exaggerated expression. |  |
| /$defs/archetype/properties | description: {"description":"Describe the motives and behavior this character pattern contributes to the brand.","type":"string"} |  |
| /$defs/archetype/properties/id | description: Assign a stable reference so other model records can link to this entry. | ../metamodel.schema.yaml#/$defs/archetype_ref |
| /$defs/archetype/properties/name | type: string; description: Choose a name contributors can recall when making a communication choice. |  |
| /$defs/archetype/properties/description | type: string; description: Describe the motives and behavior this character pattern contributes to the brand. |  |
| /$defs/archetype/properties/anti_patterns | type: array; description: List ways the archetype can become exaggerated or misapplied in practice. |  |
| /$defs/archetype/properties/anti_patterns/items | type: string |  |
| /$defs/archetype/properties/tags | description: Add short labels that help contributors group and find related records. | ../metamodel.schema.yaml#/$defs/tags |
| /$defs/tone | type: object; required: ["id","label","do","avoid","dimensions"]; additionalProperties: false; description: Define observable writing behaviors and how they shift with audience circumstances. |  |
| /$defs/tone/properties/id | description: Assign a stable reference so other model records can link to this entry. | ../metamodel.schema.yaml#/$defs/tone_ref |
| /$defs/tone/properties/label | type: string; description: Name this profile so writers can choose it quickly for an assignment. |  |
| /$defs/tone/properties/do | type: array; description: Recommended writing behaviors. Rationale: convert tone intent into execution rules. |  |
| /$defs/tone/properties/do/items | type: string |  |
| /$defs/tone/properties/avoid | type: array; description: Disallowed writing behaviors. Rationale: prevent drift and off-brand voice. |  |
| /$defs/tone/properties/avoid/items | type: string |  |
| /$defs/tone/properties/dimensions | type: object; required: ["humor","formality","respect","enthusiasm"]; additionalProperties: false; description: Quantitative tone profile using four widely used UX tone dimensions. Rationale: numeric calibration makes review and testing less subjective across channels; required for radar visualization.  |  |
| /$defs/tone/properties/dimensions/properties/humor | type: integer; description: -2 serious ... +2 funny |  |
| /$defs/tone/properties/dimensions/properties/formality | type: integer; description: -2 casual ... +2 formal |  |
| /$defs/tone/properties/dimensions/properties/respect | type: integer; description: -2 irreverent ... +2 respectful |  |
| /$defs/tone/properties/dimensions/properties/enthusiasm | type: integer; description: -2 matter-of-fact ... +2 enthusiastic |  |
| /$defs/tone/properties/context_notes | type: array; description: Record exceptions where the situation calls for a deliberate adjustment. |  |
| /$defs/tone/properties/context_notes/items | type: object; required: ["context","adaptation"]; additionalProperties: false |  |
| /$defs/tone/properties/context_notes/items/properties/context | type: string; description: Identify the situation or reader state that triggers the adjustment. |  |
| /$defs/tone/properties/context_notes/items/properties/adaptation | type: string; description: Explain how the wording should change when that situation occurs. |  |
| /$defs/tone/properties/tags | description: Add short labels that help contributors group and find related records. | ../metamodel.schema.yaml#/$defs/tags |
| /$defs/verbal_guideline | type: object; required: ["id","name","rationale"]; additionalProperties: false; description: Capture terminology and copy conventions that contributors can apply during writing and review. |  |
| /$defs/verbal_guideline/properties/id | description: Dedicated verbal-guideline identifier. Rationale: keeps lexical and copy-system governance distinct from tonal guidance.  | ../metamodel.schema.yaml#/$defs/verbal_guideline_ref |
| /$defs/verbal_guideline/properties/name | type: string; description: Name the writing convention contributors should look up during editing. |  |
| /$defs/verbal_guideline/properties/rationale | type: string; description: Why this rule exists and what risk it mitigates. |  |
| /$defs/verbal_guideline/properties/preferred_terms | type: array; description: Preferred wording map for consistent terminology. |  |
| /$defs/verbal_guideline/properties/preferred_terms/items | type: object; required: ["term","use_instead_of"]; additionalProperties: false |  |
| /$defs/verbal_guideline/properties/preferred_terms/items/properties/term | type: string; description: Give the approved wording that should appear in published copy. |  |
| /$defs/verbal_guideline/properties/preferred_terms/items/properties/use_instead_of | type: array; description: List interchangeable expressions the author should replace with the approved term. |  |
| /$defs/verbal_guideline/properties/preferred_terms/items/properties/use_instead_of/items | type: string |  |
| /$defs/verbal_guideline/properties/preferred_terms/items/properties/notes | type: string; description: Explain where the preferred wording applies or when an exception is appropriate. |  |
| /$defs/verbal_guideline/properties/banned_terms | type: array; description: Terms to avoid because they are vague, exclusionary, or misleading. |  |
| /$defs/verbal_guideline/properties/banned_terms/items | type: object; required: ["term","reason"]; additionalProperties: false |  |
| /$defs/verbal_guideline/properties/banned_terms/items/properties/term | type: string; description: Give the exact expression a reviewer should flag in copy. |  |
| /$defs/verbal_guideline/properties/banned_terms/items/properties/reason | type: string; description: Explain the harm or ambiguity introduced by using this expression. |  |
| /$defs/verbal_guideline/properties/banned_terms/items/properties/replacement | type: string; description: Give an alternative authors can use while preserving the intended meaning. |  |
| /$defs/verbal_guideline/properties/inclusivity_rules | type: array; description: Inclusivity and accessibility language expectations. Rationale: codifies respectful communication standards at authoring time.  |  |
| /$defs/verbal_guideline/properties/inclusivity_rules/items | type: string |  |
| /$defs/verbal_guideline/properties/grammar_rules | type: array; description: Grammar and mechanics constraints for consistency. |  |
| /$defs/verbal_guideline/properties/grammar_rules/items | type: string |  |
| /$defs/verbal_guideline/properties/examples | type: array; description: On-brand vs off-brand examples for practical onboarding. |  |
| /$defs/verbal_guideline/properties/examples/items | type: object; required: ["context","on_brand"]; additionalProperties: false |  |
| /$defs/verbal_guideline/properties/examples/items/properties/context | type: string; description: Identify the situation shared by the two wording samples. |  |
| /$defs/verbal_guideline/properties/examples/items/properties/on_brand | type: string; description: Show usable wording that follows the rule in the stated context. |  |
| /$defs/verbal_guideline/properties/examples/items/properties/off_brand | type: string; description: Show wording that violates the rule in the same context. |  |
| /$defs/verbal_guideline/properties/evidence_refs | description: Link source records that support the claims or choices captured here. | ../metamodel.schema.yaml#/$defs/evidence_refs |
| /$defs/verbal_guideline/properties/tags | description: Add short labels that help contributors group and find related records. | ../metamodel.schema.yaml#/$defs/tags |
| /$defs/personal_brand_profile | type: object; required: ["id","name","subject_brand_ref","signature_ideas"]; additionalProperties: false; description: Define how an individual expresses expertise while preserving the parent brand's commitments. |  |
| /$defs/personal_brand_profile/properties/id | description: Assign a stable reference so other model records can link to this entry. | ../metamodel.schema.yaml#/$defs/personal_brand_profile_ref |
| /$defs/personal_brand_profile/properties/name | type: string; description: Profile label for the individual voice system. |  |
| /$defs/personal_brand_profile/properties/subject_brand_ref | description: Brand this personal profile belongs to or extends. Rationale: links founder/expert expression back to the parent brand system.  | ../metamodel.schema.yaml#/$defs/brand_ref |
| /$defs/personal_brand_profile/properties/primary_actor_ref | description: Optional actor record representing the person operationally. | ../metamodel.schema.yaml#/$defs/actor_ref |
| /$defs/personal_brand_profile/properties/role_in_system | type: string; enum: ["founder","executive","operator","evangelist","creator","analyst","advisor","community-lead"]; description: Communication role this person plays in the brand system. |  |
| /$defs/personal_brand_profile/properties/audience_refs | type: array; description: Audience segments this personal brand is primarily designed to influence. |  |
| /$defs/personal_brand_profile/properties/audience_refs/items |  | ../metamodel.schema.yaml#/$defs/audience_ref |
| /$defs/personal_brand_profile/properties/signature_ideas | type: array; description: Repeatable ideas the person should become known for. Rationale: personal-brand authority compounds through recurring idea ownership.  |  |
| /$defs/personal_brand_profile/properties/signature_ideas/items | type: string |  |
| /$defs/personal_brand_profile/properties/authority_sources | type: array; description: Structured credibility anchors for this profile. |  |
| /$defs/personal_brand_profile/properties/authority_sources/items |  | #/$defs/authority_source |
| /$defs/personal_brand_profile/properties/relationship_contract | type: string; description: How the person should relate to the audience (teacher, peer, provocateur, translator, etc.). |  |
| /$defs/personal_brand_profile/properties/boundaries | type: array; description: Guardrails clarifying what the personal brand should or should not own. Rationale: prevents conflict between person-led and org-led messaging.  |  |
| /$defs/personal_brand_profile/properties/boundaries/items | type: string |  |
| /$defs/personal_brand_profile/properties/linked_messages | type: array; description: Link reusable messages through which the individual expresses their signature ideas. |  |
| /$defs/personal_brand_profile/properties/linked_messages/items |  | ../metamodel.schema.yaml#/$defs/message_ref |
| /$defs/personal_brand_profile/properties/evidence_refs | description: Link source records that support the claims or choices captured here. | ../metamodel.schema.yaml#/$defs/evidence_refs |
| /$defs/personal_brand_profile/properties/tags | description: Add short labels that help contributors group and find related records. | ../metamodel.schema.yaml#/$defs/tags |
| /$defs/authority_source | type: object; required: ["type","name"]; additionalProperties: false; description: Describe the experience or recognition that makes an individual credible on a specific topic. |  |
| /$defs/authority_source/properties | type: {"type":"string","enum":["role","experience","credential","publication","speaking","case-study","community","media","award","other"],"description":"Why this person is believable on the ideas they communicate."} |  |
| /$defs/authority_source/properties/type | type: string; enum: ["role","experience","credential","publication","speaking","case-study","community","media","award","other"]; description: Why this person is believable on the ideas they communicate. |  |
| /$defs/authority_source/properties/name | type: string; description: Name the specific credential, publication, activity, or other credibility anchor. |  |
| /$defs/authority_source/properties/topic | type: string; description: State the subject this source gives the person standing to discuss. |  |
| /$defs/authority_source/properties/issuer | type: string; description: Name the organization or body responsible for this recognition or artifact. |  |
| /$defs/authority_source/properties/year | type: integer; description: Give the year the credential was awarded or the artifact was published. |  |
| /$defs/authority_source/properties/url | type: string; pattern: ^[a-z]+://.+$; description: Canonical URL for this authority source when one exists. |  |
| /$defs/authority_source/properties/notes | type: string; description: Explain the source's relevance and any limits on the claims it supports. |  |
| /$defs/authority_source/properties/counters_competitor_refs | type: array; description: Competitor positioning claims this authority source directly counters. |  |
| /$defs/authority_source/properties/counters_competitor_refs/items |  | ../metamodel.schema.yaml#/$defs/competitor_ref |
| /$defs/asset | type: object; required: ["id","name","type"]; additionalProperties: false; description: Document a recognizable cue and the situations where repeated use builds brand recall. |  |
| /$defs/asset/properties | type: {"description":"Choose the form through which people encounter and recall this cue.","examples":["verbal"],"type":"string","enum":["verbal","visual","sonic","mnemonic"]} |  |
| /$defs/asset/properties/id | description: Assign a stable reference so other model records can link to this entry. | ../metamodel.schema.yaml#/$defs/asset_ref |
| /$defs/asset/properties/name | type: string; description: Use a label contributors can recognize when choosing brand assets. |  |
| /$defs/asset/properties/type | type: string; enum: ["verbal","visual","sonic","mnemonic"]; description: Choose the form through which people encounter and recall this cue. |  |
| /$defs/asset/properties/cue | type: string; description: The recognizable marker used for memory structures. |  |
| /$defs/asset/properties/category_entry_points | type: array; description: Usage contexts where this asset should trigger recall. |  |
| /$defs/asset/properties/category_entry_points/items | type: string |  |
| /$defs/asset/properties/evidence_level | description: Record how strongly the available evidence supports this assertion. | ../metamodel.schema.yaml#/$defs/evidence_level |
| /$defs/asset/properties/tags | description: Add short labels that help contributors group and find related records. | ../metamodel.schema.yaml#/$defs/tags |

## strategy/capacity.schema.yaml

Brandvoice Strategy - Capacity & Roadmap

| JSON Pointer | Type / constraints | Reference |
|---|---|---|
| / | type: object; additionalProperties: false; description: Schema for capacity planning and quarterly roadmap modeling. Introduced in schema v1.5.0 to support solo and small-team brandvoice models where revenue stream prioritization and phased delivery are first-class concerns. File convention: strategy/capacity-priorities.yaml Entities:   PRI### - priority_stream  (revenue / service stream with priority, rationale, and refs)   RMP### - roadmap_phase    (quarterly or milestone phase with goals, budget, KPI)  Non-entity block:   capacity_model - scalar config object (total_working_days_per_year, allocations).                    Not extracted as a graph entity; used for dashboard / viewer context.  |  |
| /$defs/priority_stream | type: object; required: ["id","name","priority"]; additionalProperties: false; description: A prioritized revenue or service stream. Captures strategic rationale, time investment, revenue estimate, and links to offerings and opportunities.  |  |
| /$defs/priority_stream/properties/id | type: string; pattern: ^([a-z][a-z0-9-]*\.)?PRI\d{3,}$; description: Typed entity ID, e.g. PRI001. |  |
| /$defs/priority_stream/properties/name | type: string; description: Human-readable stream name. |  |
| /$defs/priority_stream/properties/priority | type: integer; description: Rank within the plan (1 = highest priority). |  |
| /$defs/priority_stream/properties/rationale | type: string; description: Why this stream is prioritized at this rank. |  |
| /$defs/priority_stream/properties/time_investment | type: string; description: Estimated time cost (free text, e.g. '10 dni'). |  |
| /$defs/priority_stream/properties/revenue_estimate | type: string; description: Expected annual revenue range (free text). |  |
| /$defs/priority_stream/properties/strategic_value | type: string; description: Qualitative strategic importance label. |  |
| /$defs/priority_stream/properties/timing | type: string; description: Expected launch or milestone timing (free text). |  |
| /$defs/priority_stream/properties/dependencies | type: array; description: Prerequisite conditions or tasks before launch. |  |
| /$defs/priority_stream/properties/dependencies/items | type: string |  |
| /$defs/priority_stream/properties/offering_ref | description: Link the offering that this stream is expected to deliver. | ../metamodel.schema.yaml#/$defs/offering_ref |
| /$defs/priority_stream/properties/opportunity_ref | description: Link the opportunity that makes this investment worth prioritizing. | ../metamodel.schema.yaml#/$defs/opportunity_ref |
| /$defs/priority_stream/properties/evidence_refs | description: Link source records that support the claims or choices captured here. | ../metamodel.schema.yaml#/$defs/evidence_refs |
| /$defs/priority_stream/properties/tags | description: Add short labels that help contributors group and find related records. | ../metamodel.schema.yaml#/$defs/tags |
| /$defs/roadmap_phase | type: object; required: ["id","name"]; additionalProperties: false; description: A quarterly or milestone-bounded delivery phase. Groups goals, budget allocation, and success KPIs into a single traceable entity.  |  |
| /$defs/roadmap_phase/properties/id | type: string; pattern: ^([a-z][a-z0-9-]*\.)?RMP\d{3,}$; description: Typed entity ID, e.g. RMP001. |  |
| /$defs/roadmap_phase/properties/name | type: string; description: Short phase label, e.g. 'Q2 2026: FUNDAMENT'. |  |
| /$defs/roadmap_phase/properties/period | type: string; description: Human-readable calendar span, e.g. 'kwiecień-czerwiec 2026'. |  |
| /$defs/roadmap_phase/properties/goals | type: array; description: Concrete deliverables targeted in this phase. |  |
| /$defs/roadmap_phase/properties/goals/items | type: string |  |
| /$defs/roadmap_phase/properties/budget | type: string; description: Estimated spend for the phase (free text). |  |
| /$defs/roadmap_phase/properties/kpi | type: string; description: Primary success metric(s) for the phase. |  |
| /$defs/roadmap_phase/properties/evidence_refs | description: Link source records that support the claims or choices captured here. | ../metamodel.schema.yaml#/$defs/evidence_refs |
| /$defs/roadmap_phase/properties/tags | description: Add short labels that help contributors group and find related records. | ../metamodel.schema.yaml#/$defs/tags |
| /$defs/capacity_model | type: object; additionalProperties: true; description: Non-entity configuration block describing working-day allocation for a solo or small-team model. All properties are free-form integers or strings. Not extracted as a graph entity - used for dashboard and viewer context only.  |  |
| /$defs/capacity_model/properties/total_working_days_per_year | type: integer; description: Enter the annual pool of working days before deducting reserved time. |  |
| /$defs/capacity_model/properties/reserved_for_administration | type: integer; description: Estimate annual days for work such as scheduling, finance, and reporting. |  |
| /$defs/capacity_model/properties/reserved_for_marketing_content | type: integer; description: Estimate annual days needed for outreach and producing marketing materials. |  |
| /$defs/capacity_model/properties/reserved_for_preparation | type: integer; description: Estimate annual days spent preparing materials and settings for delivery. |  |
| /$defs/capacity_model/properties/note | type: string; description: Explain the assumptions or seasonal constraints behind the allocation. |  |
| /properties/version | type: string; description: Record the version declared for this capacity planning file. |  |
| /properties/schemaVersion | description: Identify the Brandvoice schema revision used to author this file. | ../metamodel.schema.yaml#/$defs/schema_version |
| /properties/capacity_model | description: Summarize annual working days and reservations before assigning time to delivery streams. | #/$defs/capacity_model |
| /properties/priority_streams | type: array; description: Prioritized revenue or service streams (PRI### entities). |  |
| /properties/priority_streams/items |  | #/$defs/priority_stream |
| /properties/roadmap | type: array; description: Sequential delivery phases (RMP### entities). |  |
| /properties/roadmap/items |  | #/$defs/roadmap_phase |
| /properties/operational_risks | type: array; description: Operational risks specific to this capacity plan. Items follow the same shape as governance/decisions.yaml risks (RSK### IDs). Extracted by the core as 'risk' entities, same as governance-plane risks.  |  |
| /properties/operational_risks/items | type: object; required: ["id","name"]; additionalProperties: true |  |
| /properties/operational_risks/items/properties/id | type: string; pattern: ^([a-z][a-z0-9-]*\.)?RSK\d{3,}$; description: Assign a stable identifier so capacity reviews can cite the same risk. |  |
| /properties/operational_risks/items/properties/name | type: string; description: Name the event that could reduce available delivery capacity. |  |
| /properties/operational_risks/items/properties/probability | type: string; enum: ["low","medium","high"]; description: Estimate how likely the event is within this capacity plan. |  |
| /properties/operational_risks/items/properties/impact | type: string; enum: ["low","medium","high","critical"]; description: Rate the effect on delivery if this capacity risk occurs. |  |
| /properties/operational_risks/items/properties/mitigation | type: string; description: Describe the action that lowers the probability or protects the delivery schedule. |  |
| /properties/operational_risks/items/properties/evidence_refs | description: Link source records that support the claims or choices captured here. | ../metamodel.schema.yaml#/$defs/evidence_refs |

## strategy/market-product.schema.yaml

Brandvoice Strategy - Market and Product

| JSON Pointer | Type / constraints | Reference |
|---|---|---|
| / | type: object; required: ["version"]; additionalProperties: false; description: Customer and market understanding plus business and product strategy entities. Supports JTBD, segmentation, positioning, and business model structures. Core primitive entities are modeled directly here: Actor, Need, Offering, Competitor, and Context.  |  |
| /properties/version | description: Record the version declared for this Brandvoice model file. | ../metamodel.schema.yaml#/$defs/semver |
| /properties/schemaVersion | description: Identify the Brandvoice schema revision used to author this file. | ../metamodel.schema.yaml#/$defs/schema_version |
| /properties/scope | description: Set the context prefix that identifies the namespace for this file. | ../metamodel.schema.yaml#/$defs/context_prefix |
| /properties/tags | description: Add short labels that help contributors group and find related records. | ../metamodel.schema.yaml#/$defs/tags |
| /properties/actors | type: array; description: Core primitive: who participates in buying/using/influencing. |  |
| /properties/actors/items |  | #/$defs/actor |
| /properties/needs | type: array; description: Core primitive: customer needs/problems/progress criteria. |  |
| /properties/needs/items |  | #/$defs/need |
| /properties/offerings | type: array; description: Core primitive: what is offered to satisfy needs. |  |
| /properties/offerings/items |  | #/$defs/offering |
| /properties/competitors | type: array; description: Core primitive: alternatives in the competitive frame. |  |
| /properties/competitors/items |  | #/$defs/competitor |
| /properties/contexts | type: array; description: Core primitive: situational context shaping demand and decisions. |  |
| /properties/contexts/items |  | #/$defs/context |
| /properties/market_refs | type: array; description: Canonical market definitions this strategy depends on. Rationale: market entities are owned by the market plane and referenced from strategy to avoid duplicate or diverging `MKT###` records.  |  |
| /properties/market_refs/items |  | ../metamodel.schema.yaml#/$defs/market_ref |
| /properties/audiences | type: array; description: Legacy alias: audience segment. Prefer actors. |  |
| /properties/audiences/items |  | #/$defs/audience |
| /properties/personas | type: array; description: Collect evidence-backed or hypothetical portraits that guide offer and communication choices. |  |
| /properties/personas/items |  | #/$defs/persona |
| /properties/jobs | type: array; description: Record the progress people seek under circumstances that make them act. |  |
| /properties/jobs/items |  | #/$defs/job |
| /properties/value_propositions | type: array; description: Connect each offer's value to the pains and gains of its audience. |  |
| /properties/value_propositions/items |  | #/$defs/value_proposition |
| /properties/positioning | type: array; description: Record how the brand wants buyers to compare it with alternatives. |  |
| /properties/positioning/items |  | #/$defs/positioning |
| /properties/business_model | type: array; description: Optional BMC/Lean Canvas style elements. |  |
| /properties/business_model/items |  | #/$defs/business_model_element |
| /$defs/actor | type: object; required: ["id","name","role"]; additionalProperties: false; description: Describe a participant in buying, using, influencing, or delivering an offering. |  |
| /$defs/actor/properties | description: {"type":"string","description":"Freeform context about who this actor is and why they matter."} |  |
| /$defs/actor/properties/id | description: Assign a stable reference so other model records can link to this entry. | ../metamodel.schema.yaml#/$defs/actor_ref |
| /$defs/actor/properties/name | type: string; description: Use a recognizable role label that can apply across real participants. |  |
| /$defs/actor/properties/description | type: string; description: Freeform context about who this actor is and why they matter. |  |
| /$defs/actor/properties/role | type: string; enum: ["buyer","user","influencer","champion","approver","gatekeeper","partner","internal"]; description: Classify this participant by their part in adoption or delivery. |  |
| /$defs/actor/properties/characteristics | type: array; description: Record observable attributes that explain how this participant behaves or decides. |  |
| /$defs/actor/properties/characteristics/items | type: string |  |
| /$defs/actor/properties/priority | description: Rank the actor's relevance to the strategy before allocating attention. | ../metamodel.schema.yaml#/$defs/priority |
| /$defs/actor/properties/evidence_refs | description: Link source records that support the claims or choices captured here. | ../metamodel.schema.yaml#/$defs/evidence_refs |
| /$defs/actor/properties/tags | description: Add short labels that help contributors group and find related records. | ../metamodel.schema.yaml#/$defs/tags |
| /$defs/need | type: object; required: ["id","statement","actors"]; additionalProperties: false; description: State the progress or problem that creates demand and record how it is served today. |  |
| /$defs/need/properties/id | description: Assign a stable reference so other model records can link to this entry. | ../metamodel.schema.yaml#/$defs/need_ref |
| /$defs/need/properties/statement | type: string; description: State the problem in terms a person experiencing it would recognize. |  |
| /$defs/need/properties/actors | type: array; description: Link the participants who experience or express this need. |  |
| /$defs/need/properties/actors/items |  | ../metamodel.schema.yaml#/$defs/actor_ref |
| /$defs/need/properties/need_type | type: string; enum: ["functional","emotional","social","economic"]; description: Classify the main kind of progress people need from a solution. |  |
| /$defs/need/properties/urgency | type: string; enum: ["low","medium","high","critical"]; description: Rate how quickly the affected people need this problem resolved. |  |
| /$defs/need/properties/evidence_level | description: Record how strongly the available evidence supports this assertion. | ../metamodel.schema.yaml#/$defs/evidence_level |
| /$defs/need/properties/evidence_refs | description: Link source records that support the claims or choices captured here. | ../metamodel.schema.yaml#/$defs/evidence_refs |
| /$defs/need/properties/context_refs | type: array; description: Link the situations that make this need salient or change its urgency. |  |
| /$defs/need/properties/context_refs/items |  | ../metamodel.schema.yaml#/$defs/context_ref |
| /$defs/need/properties/current_fulfillment | type: array; description: How this need is currently met in the market. Models the demand landscape: what exists today, how satisfied buyers are, and what friction prevents switching.  |  |
| /$defs/need/properties/current_fulfillment/items | type: object; required: ["served_by","fulfillment"]; additionalProperties: false |  |
| /$defs/need/properties/current_fulfillment/items/properties/served_by | type: string; description: What currently serves this need. Use CPR### for known competitors or freeform text for categories (e.g., 'manual spreadsheets', 'hiring freelancers').  |  |
| /$defs/need/properties/current_fulfillment/items/properties/fulfillment | description: Rate how well this alternative meets the need in practice. | ../metamodel.schema.yaml#/$defs/fulfillment_level |
| /$defs/need/properties/current_fulfillment/items/properties/friction_points | type: array; description: Pain points with the current solution. |  |
| /$defs/need/properties/current_fulfillment/items/properties/friction_points/items | type: string |  |
| /$defs/need/properties/current_fulfillment/items/properties/switching_barriers | type: array; description: What prevents switching (e.g., 'data lock-in', 'team inertia', 'contractual'). |  |
| /$defs/need/properties/current_fulfillment/items/properties/switching_barriers/items | type: string |  |
| /$defs/need/properties/current_fulfillment/items/properties/willingness_to_switch | type: string; enum: ["resistant","reluctant","open","eager","desperate"]; description: Record how ready people using this alternative are to change. |  |
| /$defs/need/properties/current_fulfillment/items/properties/observed_at | type: string; pattern: ^\d{4}-\d{2}-\d{2}$; description: Date the observation so reviewers can judge whether the finding is still current. |  |
| /$defs/need/properties/current_fulfillment/items/properties/evidence_refs | description: Link source records that support the claims or choices captured here. | ../metamodel.schema.yaml#/$defs/evidence_refs |
| /$defs/need/properties/tags | description: Add short labels that help contributors group and find related records. | ../metamodel.schema.yaml#/$defs/tags |
| /$defs/offering | type: object; required: ["id","name","value_statement"]; additionalProperties: false; description: Describe a product or service, whom it serves, and the alternatives buyers consider. |  |
| /$defs/offering/properties/id | description: Assign a stable reference so other model records can link to this entry. | ../metamodel.schema.yaml#/$defs/offering_ref |
| /$defs/offering/properties/name | type: string; description: Use the product or service name that buyers can recognize. |  |
| /$defs/offering/properties/value_statement | type: string; description: Summarize the practical benefit the buyer should expect from using this offering. |  |
| /$defs/offering/properties/status | type: string; enum: ["active","beta","deprioritized","sunset"]; description: Where the offering stands in its lifecycle. `active`: offered to new buyers and delivered. `beta`: offered to selected buyers while it is still being shaped. `deprioritized`: still available, no longer promoted or invested in. `sunset`: still delivered to existing buyers, no longer offered to new ones. When the field is absent the status is not stated; it is not read as `active`.  |  |
| /$defs/offering/properties/superseded_by | type: array; description: Offerings that replace this one for the buyers and needs it served. Usually paired with `status: deprioritized` or `status: sunset`; list several when the replacement is split across offerings. Omit the field while nothing replaces the offering; an empty list is not allowed.  |  |
| /$defs/offering/properties/superseded_by/items |  | ../metamodel.schema.yaml#/$defs/offering_ref |
| /$defs/offering/properties/capabilities | type: array; description: Concrete product or service capabilities grounded in evidence. Each entry describes a specific, verifiable capability - not aspirational language. Used to bridge product reality into brand strategy and website content.  |  |
| /$defs/offering/properties/capabilities/items | type: string |  |
| /$defs/offering/properties/solves_needs | type: array; description: Link the needs this offering directly helps people meet. |  |
| /$defs/offering/properties/solves_needs/items |  | ../metamodel.schema.yaml#/$defs/need_ref |
| /$defs/offering/properties/target_audiences | type: array; description: Audiences this offering targets, in one list. The list does not mark a target as current or potential: read that from each audience's `evidence_level`, where `hypothesis` marks a segment still to be tested. Value propositions state what the offering promises each audience. Omit the field while no audience is named; an empty list is not allowed.  |  |
| /$defs/offering/properties/target_audiences/items |  | ../metamodel.schema.yaml#/$defs/audience_ref |
| /$defs/offering/properties/competitors | type: array; description: Competitors and alternatives a buyer weighs against this offering, including substitutes and the status quo (a competitor of type `substitute` or `status-quo`). A positioning states which of them its claim is made against. Omit the field while none is named; an empty list is not allowed.  |  |
| /$defs/offering/properties/competitors/items |  | ../metamodel.schema.yaml#/$defs/competitor_ref |
| /$defs/offering/properties/market_refs | type: array; description: Identify the markets where this offering is relevant or available. |  |
| /$defs/offering/properties/market_refs/items |  | ../metamodel.schema.yaml#/$defs/market_ref |
| /$defs/offering/properties/addresses_opportunities | type: array; description: Opportunities this offering was built to capture. |  |
| /$defs/offering/properties/addresses_opportunities/items |  | ../metamodel.schema.yaml#/$defs/opportunity_ref |
| /$defs/offering/properties/brand_ref | description: Brand this offering belongs to in a multi-brand portfolio. When set, scoped views can filter offerings per brand; omit for shared offerings.  | ../metamodel.schema.yaml#/$defs/brand_ref |
| /$defs/offering/properties/proof_points | type: array; description: Link proof that substantiates what the offering can deliver. |  |
| /$defs/offering/properties/proof_points/items |  | ../metamodel.schema.yaml#/$defs/proof_ref |
| /$defs/offering/properties/evidence_refs | description: Link source records that support the claims or choices captured here. | ../metamodel.schema.yaml#/$defs/evidence_refs |
| /$defs/offering/properties/linked_business_model | type: array; description: Link the business model elements that explain how this offering operates. |  |
| /$defs/offering/properties/linked_business_model/items |  | ../metamodel.schema.yaml#/$defs/model_ref |
| /$defs/offering/properties/blueprint_links | description: Link Blueprint elements that implement or explain this Brandvoice record. | ../metamodel.schema.yaml#/$defs/optional_blueprint_links |
| /$defs/offering/properties/tags | description: Add short labels that help contributors group and find related records. | ../metamodel.schema.yaml#/$defs/tags |
| /$defs/competitor | type: object; required: ["id","name","type"]; additionalProperties: false; description: Describe an alternative buyers weigh for the same need, including established workarounds. |  |
| /$defs/competitor/properties | type: {"description":"Classify how the alternative competes for the buyer's decision.","examples":["status-quo"],"type":"string","enum":["direct","indirect","substitute","status-quo"]} |  |
| /$defs/competitor/properties/id | description: Assign a stable reference so other model records can link to this entry. | ../metamodel.schema.yaml#/$defs/competitor_ref |
| /$defs/competitor/properties/name | type: string; description: Choose a label recognizable to buyers who consider this alternative. |  |
| /$defs/competitor/properties/type | type: string; enum: ["direct","indirect","substitute","status-quo"]; description: Classify how the alternative competes for the buyer's decision. |  |
| /$defs/competitor/properties/strengths | type: array; description: Explain why a buyer would keep or choose this alternative. |  |
| /$defs/competitor/properties/strengths/items | type: string |  |
| /$defs/competitor/properties/weaknesses | type: array; description: Identify observed limitations that matter in the buyer's situation. |  |
| /$defs/competitor/properties/weaknesses/items | type: string |  |
| /$defs/competitor/properties/for_needs | type: array; description: Link the needs that buyers try to meet with this alternative. |  |
| /$defs/competitor/properties/for_needs/items |  | ../metamodel.schema.yaml#/$defs/need_ref |
| /$defs/competitor/properties/position_map_refs | type: array; description: Position maps featuring this competitor. |  |
| /$defs/competitor/properties/position_map_refs/items |  | ../metamodel.schema.yaml#/$defs/position_map_ref |
| /$defs/competitor/properties/opportunity_refs | type: array; description: Opportunities this competitor threatens or could capture. |  |
| /$defs/competitor/properties/opportunity_refs/items |  | ../metamodel.schema.yaml#/$defs/opportunity_ref |
| /$defs/competitor/properties/threat_level | description: Overall competitive threat level. | ../metamodel.schema.yaml#/$defs/priority |
| /$defs/competitor/properties/evidence_refs | description: Link source records that support the claims or choices captured here. | ../metamodel.schema.yaml#/$defs/evidence_refs |
| /$defs/competitor/properties/geo_scope | description: Optional geographic applicability. Strategy-plane competitor profiles are lightweight; prefer putting detailed geo on the market/competition.schema.yaml profile of the same CPR### ID. See metamodel.geo_scope. Added in v1.4.0.  | ../metamodel.schema.yaml#/$defs/geo_scope |
| /$defs/competitor/properties/tags | description: Add short labels that help contributors group and find related records. | ../metamodel.schema.yaml#/$defs/tags |
| /$defs/context | type: object; required: ["id","name","trigger"]; additionalProperties: false; description: Describe circumstances that change demand, available choices, or the way buyers evaluate them. |  |
| /$defs/context/properties/id | description: Assign a stable reference so other model records can link to this entry. | ../metamodel.schema.yaml#/$defs/context_ref |
| /$defs/context/properties/name | type: string; description: Name a recurring situation contributors can use when linking demand evidence. |  |
| /$defs/context/properties/trigger | type: string; description: Specify the event that makes the buyer seek progress now. |  |
| /$defs/context/properties/constraints | type: array; description: Describe what limits the choices available to participants in this situation. |  |
| /$defs/context/properties/constraints/items | type: string |  |
| /$defs/context/properties/market_conditions | type: array; description: Record external conditions that shape the options available in this situation. |  |
| /$defs/context/properties/market_conditions/items | type: string |  |
| /$defs/context/properties/evidence_refs | description: Link source records that support the claims or choices captured here. | ../metamodel.schema.yaml#/$defs/evidence_refs |
| /$defs/context/properties/tags | description: Add short labels that help contributors group and find related records. | ../metamodel.schema.yaml#/$defs/tags |
| /$defs/audience | type: object; required: ["id","name","need"]; additionalProperties: false; description: Group people by a relevant segmentation basis and identify their shared need. |  |
| /$defs/audience/properties | description: {"type":"string","description":"Free context about the audience: why it matters, what is still unknown and how it will be tested. Keep the need itself in `need`.\n","examples":["Raised by two agencies in support threads; interviews will test willingness to pay."]} |  |
| /$defs/audience/properties/id | description: Assign a stable reference so other model records can link to this entry. | ../metamodel.schema.yaml#/$defs/audience_ref |
| /$defs/audience/properties/name | type: string; description: Use a segment label contributors can recognize across strategy and activation. |  |
| /$defs/audience/properties/need | type: string; description: Summarize the shared need that makes these people a useful segment. |  |
| /$defs/audience/properties/description | type: string; description: Free context about the audience: why it matters, what is still unknown and how it will be tested. Keep the need itself in `need`.  |  |
| /$defs/audience/properties/actor | description: Optional bridge to the canonical Actor primitive. Rationale: keeps legacy audience views aligned with actor-centric strategy models.  | ../metamodel.schema.yaml#/$defs/actor_ref |
| /$defs/audience/properties/segment_type | type: string; enum: ["demographic","behavioral","psychographic","firmographic","intent"]; description: Select the basis used to draw the boundaries of this segment. |  |
| /$defs/audience/properties/priority | description: Rank this segment's importance for allocation or validation effort. | ../metamodel.schema.yaml#/$defs/priority |
| /$defs/audience/properties/evidence_level | description: How well evidence supports this audience as a real segment. `hypothesis` marks a segment still to be tested. When absent, the level is not stated.  | ../metamodel.schema.yaml#/$defs/evidence_level |
| /$defs/audience/properties/evidence_refs | description: Link source records that support the claims or choices captured here. | ../metamodel.schema.yaml#/$defs/evidence_refs |
| /$defs/audience/properties/blueprint_links | description: Link Blueprint elements that implement or explain this Brandvoice record. | ../metamodel.schema.yaml#/$defs/optional_blueprint_links |
| /$defs/audience/properties/brand_ref | description: Optional brand this audience primarily belongs to in a portfolio. When set, scoped views (e.g. SB7 persona lists) can filter to this brand; omit for shared segments.  | ../metamodel.schema.yaml#/$defs/brand_ref |
| /$defs/audience/properties/tags | description: Add short labels that help contributors group and find related records. | ../metamodel.schema.yaml#/$defs/tags |
| /$defs/persona | type: object; required: ["id","name","audience"]; additionalProperties: false; description: Describe a representative individual whose goals and decision criteria inform design and messaging. |  |
| /$defs/persona/properties/id | description: Assign a stable reference so other model records can link to this entry. | ../metamodel.schema.yaml#/$defs/persona_ref |
| /$defs/persona/properties/name | type: string; description: Give the portrait a recognizable label for use in discussions. |  |
| /$defs/persona/properties/audience | description: Link the segment this individual is intended to represent. | ../metamodel.schema.yaml#/$defs/audience_ref |
| /$defs/persona/properties/actor | description: Optional bridge to primitive Actor. | ../metamodel.schema.yaml#/$defs/actor_ref |
| /$defs/persona/properties/goals | type: array; description: Describe what the individual wants to achieve in their own situation. |  |
| /$defs/persona/properties/goals/items | type: string |  |
| /$defs/persona/properties/barriers | type: array; description: Describe what keeps this individual from progressing or trying a new approach. |  |
| /$defs/persona/properties/barriers/items | type: string |  |
| /$defs/persona/properties/decision_criteria | type: array; description: Record the tests this individual uses to decide whether an option fits. |  |
| /$defs/persona/properties/decision_criteria/items | type: string |  |
| /$defs/persona/properties/empathy_map | description: Optional structured empathy map for this persona. Coexists with goals, barriers, and decision_criteria, which keep their existing semantics.  | ../metamodel.schema.yaml#/$defs/empathy_map |
| /$defs/persona/properties/evidence_level | description: How well evidence supports this persona as a portrait of real buyers. `hypothesis` marks a persona not yet checked against interviews or data. When absent, the level is not stated.  | ../metamodel.schema.yaml#/$defs/evidence_level |
| /$defs/persona/properties/evidence_refs | description: Link source records that support the claims or choices captured here. | ../metamodel.schema.yaml#/$defs/evidence_refs |
| /$defs/persona/properties/brand_ref | description: Optional brand this persona primarily supports. When set, SB7 and other scoped views can list personas per brand; omit if the persona applies across the portfolio.  | ../metamodel.schema.yaml#/$defs/brand_ref |
| /$defs/persona/properties/tags | description: Add short labels that help contributors group and find related records. | ../metamodel.schema.yaml#/$defs/tags |
| /$defs/job | type: object; required: ["id","statement","audience"]; additionalProperties: false; description: Describe progress a person seeks that can be served by competing approaches. |  |
| /$defs/job/properties/id | description: Assign a stable reference so other model records can link to this entry. | ../metamodel.schema.yaml#/$defs/job_ref |
| /$defs/job/properties/statement | type: string; description: Express the desired progress from the person's perspective and relevant circumstances. |  |
| /$defs/job/properties/audience | description: Link the audience whose recurring circumstances give rise to this job. | ../metamodel.schema.yaml#/$defs/audience_ref |
| /$defs/job/properties/need | description: Optional bridge to primitive Need. | ../metamodel.schema.yaml#/$defs/need_ref |
| /$defs/job/properties/job_type | type: string; enum: ["functional","emotional","social"]; description: Classify the primary progress the person seeks to make. |  |
| /$defs/job/properties/current_alternatives | type: array; description: List the approaches people currently use to make this progress. |  |
| /$defs/job/properties/current_alternatives/items | type: string |  |
| /$defs/job/properties/desired_outcome | type: string; description: Describe how the person would know the job was successfully done. |  |
| /$defs/job/properties/evidence_level | description: Record how strongly the available evidence supports this assertion. | ../metamodel.schema.yaml#/$defs/evidence_level |
| /$defs/job/properties/evidence_refs | description: Link source records that support the claims or choices captured here. | ../metamodel.schema.yaml#/$defs/evidence_refs |
| /$defs/job/properties/tags | description: Add short labels that help contributors group and find related records. | ../metamodel.schema.yaml#/$defs/tags |
| /$defs/value_proposition | type: object; required: ["id","audience","value_statement"]; additionalProperties: false; description: Explain why an audience should choose an offering for the progress it seeks. |  |
| /$defs/value_proposition/properties/id | description: Assign a stable reference so other model records can link to this entry. | ../metamodel.schema.yaml#/$defs/value_ref |
| /$defs/value_proposition/properties/offering | description: Optional bridge to primitive Offering. | ../metamodel.schema.yaml#/$defs/offering_ref |
| /$defs/value_proposition/properties/audience | description: Link the audience for whom this value proposition is intended. | ../metamodel.schema.yaml#/$defs/audience_ref |
| /$defs/value_proposition/properties/value_statement | type: string; description: Phrase the benefit as a result the audience cares about. |  |
| /$defs/value_proposition/properties/pains_addressed | type: array; description: Identify existing frustrations the offer is designed to reduce. |  |
| /$defs/value_proposition/properties/pains_addressed/items | type: string |  |
| /$defs/value_proposition/properties/gains_created | type: array; description: Describe improvements the offer enables once the audience adopts it. |  |
| /$defs/value_proposition/properties/gains_created/items | type: string |  |
| /$defs/value_proposition/properties/pain_relievers | type: array; description: Structured pain relievers with explicit need linkage. Coexists with flat pains_addressed strings for lightweight capture.  |  |
| /$defs/value_proposition/properties/pain_relievers/items |  | ../metamodel.schema.yaml#/$defs/vpc_pain_reliever |
| /$defs/value_proposition/properties/gain_creators | type: array; description: Structured gain creators with explicit need linkage. Coexists with flat gains_created strings for lightweight capture.  |  |
| /$defs/value_proposition/properties/gain_creators/items |  | ../metamodel.schema.yaml#/$defs/vpc_gain_creator |
| /$defs/value_proposition/properties/jobs_supported | type: array; description: Link the jobs this value proposition helps the audience perform. |  |
| /$defs/value_proposition/properties/jobs_supported/items |  | ../metamodel.schema.yaml#/$defs/job_ref |
| /$defs/value_proposition/properties/proof_points | type: array; description: Link proof that supports the benefits claimed for this audience. |  |
| /$defs/value_proposition/properties/proof_points/items |  | ../metamodel.schema.yaml#/$defs/proof_ref |
| /$defs/value_proposition/properties/addresses_opportunities | type: array; description: Opportunities this value proposition targets. |  |
| /$defs/value_proposition/properties/addresses_opportunities/items |  | ../metamodel.schema.yaml#/$defs/opportunity_ref |
| /$defs/value_proposition/properties/evidence_refs | description: Link source records that support the claims or choices captured here. | ../metamodel.schema.yaml#/$defs/evidence_refs |
| /$defs/value_proposition/properties/tags | description: Add short labels that help contributors group and find related records. | ../metamodel.schema.yaml#/$defs/tags |
| /$defs/positioning | type: object; required: ["id","market_category","differentiated_claim"]; additionalProperties: false; description: Define the market frame, differentiated claim, and proof that should shape buyer comparisons. |  |
| /$defs/positioning/properties/id | description: Assign a stable reference so other model records can link to this entry. | ../metamodel.schema.yaml#/$defs/position_ref |
| /$defs/positioning/properties/brand_ref | description: Brand this positioning belongs to in a portfolio or endorsed-brand system. | ../metamodel.schema.yaml#/$defs/brand_ref |
| /$defs/positioning/properties/market_category | type: string; description: Category label used publicly or internally to frame competition. |  |
| /$defs/positioning/properties/category_strategy | type: object; additionalProperties: false; description: Structured category framing choices. Rationale: category strategy is often distinct from the differentiated claim and should be reviewable as its own modeling concern.  |  |
| /$defs/positioning/properties/category_strategy/properties/frame_of_reference | type: string; description: What the buyer should compare this offer against. |  |
| /$defs/positioning/properties/category_strategy/properties/category_definition | type: string; description: How the category is defined in brand language. |  |
| /$defs/positioning/properties/category_strategy/properties/category_move | type: string; enum: ["enter","redefine","create","defend","bridge"]; description: Strategic move relative to the category. |  |
| /$defs/positioning/properties/category_strategy/properties/story | type: string; description: Why this category frame matters for buyer interpretation. |  |
| /$defs/positioning/properties/target_audiences | type: array; description: Link the audiences whose buyer comparisons this positioning is intended to shape. |  |
| /$defs/positioning/properties/target_audiences/items |  | ../metamodel.schema.yaml#/$defs/audience_ref |
| /$defs/positioning/properties/market_refs | type: array; description: Identify the markets in which this positioning should apply. |  |
| /$defs/positioning/properties/market_refs/items |  | ../metamodel.schema.yaml#/$defs/market_ref |
| /$defs/positioning/properties/based_on_opportunities | type: array; description: Opportunities that justify this positioning. |  |
| /$defs/positioning/properties/based_on_opportunities/items |  | ../metamodel.schema.yaml#/$defs/opportunity_ref |
| /$defs/positioning/properties/differentiated_claim | type: string; description: State the relevant benefit buyers should associate with this brand over alternatives. |  |
| /$defs/positioning/properties/alternatives | type: array; description: Name the comparison options buyers recognize, including unmodeled workarounds. |  |
| /$defs/positioning/properties/alternatives/items | type: string |  |
| /$defs/positioning/properties/competitors | type: array; description: Link the modeled alternatives against which the claim must hold. |  |
| /$defs/positioning/properties/competitors/items |  | ../metamodel.schema.yaml#/$defs/competitor_ref |
| /$defs/positioning/properties/position_map_refs | type: array; description: Position maps where this positioning is visualized. |  |
| /$defs/positioning/properties/position_map_refs/items |  | ../metamodel.schema.yaml#/$defs/position_map_ref |
| /$defs/positioning/properties/reasons_to_believe | type: array; description: Link the proof that makes the differentiated claim credible. |  |
| /$defs/positioning/properties/reasons_to_believe/items |  | ../metamodel.schema.yaml#/$defs/proof_ref |
| /$defs/positioning/properties/evidence_refs | description: Link source records that support the claims or choices captured here. | ../metamodel.schema.yaml#/$defs/evidence_refs |
| /$defs/positioning/properties/tags | description: Add short labels that help contributors group and find related records. | ../metamodel.schema.yaml#/$defs/tags |
| /$defs/business_model_element | type: object; required: ["id","block","statement"]; additionalProperties: false; description: Capture one canvas assumption and connect it to the strategy it depends on. |  |
| /$defs/business_model_element/properties/id | description: Assign a stable reference so other model records can link to this entry. | ../metamodel.schema.yaml#/$defs/model_ref |
| /$defs/business_model_element/properties/block | type: string; enum: ["customer-segments","value-proposition","channels","customer-relationships","revenue-streams","key-resources","key-activities","key-partners","cost-structure","problem","existing-alternatives","solution","unfair-advantage","key-metrics"]; description: Select the canvas block whose business question this statement addresses. |  |
| /$defs/business_model_element/properties/statement | type: string; description: State a testable assumption or operating choice for the selected block. |  |
| /$defs/business_model_element/properties/linked_values | type: array; description: Link the value propositions this part of the business model supports. |  |
| /$defs/business_model_element/properties/linked_values/items |  | ../metamodel.schema.yaml#/$defs/value_ref |
| /$defs/business_model_element/properties/linked_positions | type: array; description: Link positioning choices that depend on this part of the business model. |  |
| /$defs/business_model_element/properties/linked_positions/items |  | ../metamodel.schema.yaml#/$defs/position_ref |
| /$defs/business_model_element/properties/linked_actors | type: array; description: Actors relevant to this business model block. |  |
| /$defs/business_model_element/properties/linked_actors/items |  | ../metamodel.schema.yaml#/$defs/actor_ref |
| /$defs/business_model_element/properties/linked_needs | type: array; description: Needs this block addresses or depends on. |  |
| /$defs/business_model_element/properties/linked_needs/items |  | ../metamodel.schema.yaml#/$defs/need_ref |
| /$defs/business_model_element/properties/linked_offerings | type: array; description: Offerings related to this block. |  |
| /$defs/business_model_element/properties/linked_offerings/items |  | ../metamodel.schema.yaml#/$defs/offering_ref |
| /$defs/business_model_element/properties/market_refs | type: array; description: Identify the markets where this business model assumption is expected to hold. |  |
| /$defs/business_model_element/properties/market_refs/items |  | ../metamodel.schema.yaml#/$defs/market_ref |
| /$defs/business_model_element/properties/evidence_refs | description: Link source records that support the claims or choices captured here. | ../metamodel.schema.yaml#/$defs/evidence_refs |
| /$defs/business_model_element/properties/tags | description: Add short labels that help contributors group and find related records. | ../metamodel.schema.yaml#/$defs/tags |

## strategy/messaging.schema.yaml

Brandvoice Strategy - Messaging

| JSON Pointer | Type / constraints | Reference |
|---|---|---|
| / | type: object; required: ["version"]; additionalProperties: false; description: Message architecture and reusable communication units. Enables Message House, AIDA/PAS/BAB structures, and audience-specific variants with proof links. Core primitive entities modeled here: Journey Stage, Action, and Outcome.  |  |
| /properties/version | description: Record the version declared for this Brandvoice model file. | ../metamodel.schema.yaml#/$defs/semver |
| /properties/schemaVersion | description: Identify the Brandvoice schema revision used to author this file. | ../metamodel.schema.yaml#/$defs/schema_version |
| /properties/scope | description: Set the context prefix that identifies the namespace for this file. | ../metamodel.schema.yaml#/$defs/context_prefix |
| /properties/tags | description: Add short labels that help contributors group and find related records. | ../metamodel.schema.yaml#/$defs/tags |
| /properties/journey_stages | type: array; description: Define meaningful points in the progression from discovery to continued use. |  |
| /properties/journey_stages/items |  | #/$defs/journey_stage |
| /properties/actions | type: array; description: List observable behaviors that communications are intended to prompt. |  |
| /properties/actions/items |  | #/$defs/action |
| /properties/outcomes | type: array; description: Record changes that can be observed after the intended behaviors occur. |  |
| /properties/outcomes/items |  | #/$defs/outcome |
| /properties/proof_points | type: array; description: Collect reusable support for claims made across messages and channels. |  |
| /properties/proof_points/items |  | #/$defs/proof_point |
| /properties/message_houses | type: array; description: Higher-order messaging architectures that organize a roof claim, support pillars, and proof. Rationale: teams usually communicate from a structured message house, not from isolated message rows alone.  |  |
| /properties/message_houses/items |  | #/$defs/message_house |
| /properties/messages | type: array; description: Store reusable statements shaped for specific audiences, situations, and actions. |  |
| /properties/messages/items |  | #/$defs/message |
| /$defs/journey_stage | type: object; required: ["id","name"]; additionalProperties: false; description: Define a point in the journey by what the audience is trying to accomplish. |  |
| /$defs/journey_stage/properties/id | description: Assign a stable reference so other model records can link to this entry. | ../metamodel.schema.yaml#/$defs/journey_stage_ref |
| /$defs/journey_stage/properties/name | type: string; description: Use a stage label that campaign authors can recognize and reuse. |  |
| /$defs/journey_stage/properties/intent | type: string; description: Describe what the audience wants to learn, decide, or do at this point. |  |
| /$defs/journey_stage/properties/universal_phase | description: Map the local stage to a shared phase for cross-journey comparisons. | ../metamodel.schema.yaml#/$defs/universal_phase |
| /$defs/journey_stage/properties/order | type: integer; description: Set the stage sequence when presenting this journey as an ordered progression. |  |
| /$defs/journey_stage/properties/tags | description: Add short labels that help contributors group and find related records. | ../metamodel.schema.yaml#/$defs/tags |
| /$defs/action | type: object; required: ["id","name"]; additionalProperties: false; description: Describe an observable step a communication asks someone to take in context. |  |
| /$defs/action/properties/id | description: Assign a stable reference so other model records can link to this entry. | ../metamodel.schema.yaml#/$defs/action_ref |
| /$defs/action/properties/name | type: string; description: Name the behavior with a verb that makes completion recognizable. |  |
| /$defs/action/properties/action_type | type: string; enum: ["discover","click","read","subscribe","request-demo","trial","purchase","refer","retain","custom"]; description: Classify the behavior for comparison across channels and journey stages. |  |
| /$defs/action/properties/actor | description: Link the participant expected to perform this behavior. | ../metamodel.schema.yaml#/$defs/actor_ref |
| /$defs/action/properties/stage | description: Journey stage this action belongs to. | ../metamodel.schema.yaml#/$defs/journey_stage_ref |
| /$defs/action/properties/channel | description: Identify where the audience is expected to complete this action. | ../metamodel.schema.yaml#/$defs/channel_ref |
| /$defs/action/properties/cta | type: string; description: Call-to-action text or template. |  |
| /$defs/action/properties/evidence_refs | description: Link source records that support the claims or choices captured here. | ../metamodel.schema.yaml#/$defs/evidence_refs |
| /$defs/action/properties/tags | description: Add short labels that help contributors group and find related records. | ../metamodel.schema.yaml#/$defs/tags |
| /$defs/outcome | type: object; required: ["id","name"]; additionalProperties: false; description: Describe a desired change and connect it to signals that show whether it happened. |  |
| /$defs/outcome/properties | description: {"description":"Explain why this change matters in its business or audience context.","type":"string"} |  |
| /$defs/outcome/properties/id | description: Assign a stable reference so other model records can link to this entry. | ../metamodel.schema.yaml#/$defs/outcome_ref |
| /$defs/outcome/properties/name | type: string; description: Name the observed or desired change so it is recognizable in reviews. |  |
| /$defs/outcome/properties/description | type: string; description: Explain why this change matters in its business or audience context. |  |
| /$defs/outcome/properties/statement | type: string; description: Formal outcome statement for measurement context. |  |
| /$defs/outcome/properties/success_signal | type: string; description: Describe the observable event or change that indicates progress. |  |
| /$defs/outcome/properties/target | type: string; description: Quantitative target for this outcome. |  |
| /$defs/outcome/properties/measured_by | type: array; description: Metrics used to measure this outcome directly. |  |
| /$defs/outcome/properties/measured_by/items |  | ../metamodel.schema.yaml#/$defs/metric_ref |
| /$defs/outcome/properties/linked_metrics | type: array; description: Additional related metrics (may overlap with measured_by). |  |
| /$defs/outcome/properties/linked_metrics/items |  | ../metamodel.schema.yaml#/$defs/metric_ref |
| /$defs/outcome/properties/linked_kpis | type: array; description: Link the performance targets used to assess progress toward this change. |  |
| /$defs/outcome/properties/linked_kpis/items |  | ../metamodel.schema.yaml#/$defs/kpi_ref |
| /$defs/outcome/properties/evidence_refs | description: Link source records that support the claims or choices captured here. | ../metamodel.schema.yaml#/$defs/evidence_refs |
| /$defs/outcome/properties/tags | description: Add short labels that help contributors group and find related records. | ../metamodel.schema.yaml#/$defs/tags |
| /$defs/proof_point | type: object; required: ["id","claim","evidence"]; additionalProperties: false; description: Pair a claim with its supporting material so writers can cite it responsibly. |  |
| /$defs/proof_point/properties/id | description: Assign a stable reference so other model records can link to this entry. | ../metamodel.schema.yaml#/$defs/proof_ref |
| /$defs/proof_point/properties/claim | type: string; description: State the specific assertion that the proof needs to support. |  |
| /$defs/proof_point/properties/evidence | type: string; description: Summarize what the material actually shows about the claim. |  |
| /$defs/proof_point/properties/source | type: string; description: Source of proof (case study, benchmark, research, testimonial). |  |
| /$defs/proof_point/properties/evidence_level | description: Record how strongly the available evidence supports this assertion. | ../metamodel.schema.yaml#/$defs/evidence_level |
| /$defs/proof_point/properties/evidence_refs | description: Link source records that support the claims or choices captured here. | ../metamodel.schema.yaml#/$defs/evidence_refs |
| /$defs/proof_point/properties/tags | description: Add short labels that help contributors group and find related records. | ../metamodel.schema.yaml#/$defs/tags |
| /$defs/message_house | type: object; required: ["id","name","roof_claim","pillars"]; additionalProperties: false; description: Organize a unifying claim, supporting arguments, and proof for a specific audience. |  |
| /$defs/message_house/properties/id | description: Assign a stable reference so other model records can link to this entry. | ../metamodel.schema.yaml#/$defs/message_house_ref |
| /$defs/message_house/properties/name | type: string; description: Name the architecture so contributors can find the right claim hierarchy. |  |
| /$defs/message_house/properties/brand_ref | description: Brand this message house belongs to. | ../metamodel.schema.yaml#/$defs/brand_ref |
| /$defs/message_house/properties/audience_refs | type: array; description: Audience segments this architecture is optimized for. |  |
| /$defs/message_house/properties/audience_refs/items |  | ../metamodel.schema.yaml#/$defs/audience_ref |
| /$defs/message_house/properties/actor_refs | type: array; description: Primitive-aligned actor targets for this architecture. |  |
| /$defs/message_house/properties/actor_refs/items |  | ../metamodel.schema.yaml#/$defs/actor_ref |
| /$defs/message_house/properties/roof_claim | type: string; description: The umbrella statement every pillar reinforces. Rationale: gives campaigns and content a single strategic center of gravity.  |  |
| /$defs/message_house/properties/foundation | type: string; description: Optional mission, purpose, or belief statement that grounds the house. |  |
| /$defs/message_house/properties/positioning_refs | type: array; description: Link the positioning choices that the house turns into communication. |  |
| /$defs/message_house/properties/positioning_refs/items |  | ../metamodel.schema.yaml#/$defs/position_ref |
| /$defs/message_house/properties/pillars | type: array; description: Organize the supporting arguments that make the roof claim persuasive. |  |
| /$defs/message_house/properties/pillars/items |  | #/$defs/message_pillar |
| /$defs/message_house/properties/evidence_refs | description: Link source records that support the claims or choices captured here. | ../metamodel.schema.yaml#/$defs/evidence_refs |
| /$defs/message_house/properties/status | description: Record the lifecycle state that governs how contributors should use this entry. | ../metamodel.schema.yaml#/$defs/lifecycle_status |
| /$defs/message_house/properties/tags | description: Add short labels that help contributors group and find related records. | ../metamodel.schema.yaml#/$defs/tags |
| /$defs/message_pillar | type: object; required: ["id","title","summary"]; additionalProperties: false; description: Define one argument that supports the roof claim and can be substantiated. |  |
| /$defs/message_pillar/properties/id | description: Assign a stable reference so other model records can link to this entry. | ../metamodel.schema.yaml#/$defs/message_pillar_ref |
| /$defs/message_pillar/properties/title | type: string; description: Give the argument a concise label for use in briefs. |  |
| /$defs/message_pillar/properties/summary | type: string; description: Strategic point this pillar proves. |  |
| /$defs/message_pillar/properties/message_refs | type: array; description: Messages that execute this pillar. |  |
| /$defs/message_pillar/properties/message_refs/items |  | ../metamodel.schema.yaml#/$defs/message_ref |
| /$defs/message_pillar/properties/proof_refs | type: array; description: Proof points substantiating this pillar. |  |
| /$defs/message_pillar/properties/proof_refs/items |  | ../metamodel.schema.yaml#/$defs/proof_ref |
| /$defs/message_pillar/properties/tags | description: Add short labels that help contributors group and find related records. | ../metamodel.schema.yaml#/$defs/tags |
| /$defs/message | type: object; required: ["id","title","core_statement"]; additionalProperties: false; description: Capture reusable copy with its audience, purpose, intended behavior, and supporting proof. |  |
| /$defs/message/properties/id | description: Assign a stable reference so other model records can link to this entry. | ../metamodel.schema.yaml#/$defs/message_ref |
| /$defs/message/properties/title | type: string; description: Give the message a working label that helps contributors recognize it. |  |
| /$defs/message/properties/brand_ref | description: Primary brand context for this message in multi-brand or person-brand models. | ../metamodel.schema.yaml#/$defs/brand_ref |
| /$defs/message/properties/brand_script_ref | description: Optional link to a specific brand narrative script (e.g. SB7 row) when the brand has multiple scripts. Rationale: disambiguates message house lines per audience story.  | ../metamodel.schema.yaml#/$defs/brand_script_ref |
| /$defs/message/properties/audience | description: Link the audience segment for which this wording was developed. | ../metamodel.schema.yaml#/$defs/audience_ref |
| /$defs/message/properties/actor | description: Link the participant whose situation or behavior this message addresses. | ../metamodel.schema.yaml#/$defs/actor_ref |
| /$defs/message/properties/needs | type: array; description: Link the needs that make this message relevant to its recipient. |  |
| /$defs/message/properties/needs/items |  | ../metamodel.schema.yaml#/$defs/need_ref |
| /$defs/message/properties/offering | description: Identify the offering this communication concerns or promotes. | ../metamodel.schema.yaml#/$defs/offering_ref |
| /$defs/message/properties/journey_stages | type: array; description: Identify the stages when the audience is ready to hear this message. |  |
| /$defs/message/properties/journey_stages/items |  | ../metamodel.schema.yaml#/$defs/journey_stage_ref |
| /$defs/message/properties/intended_actions | type: array; description: Link the behaviors this communication should prompt or support. |  |
| /$defs/message/properties/intended_actions/items |  | ../metamodel.schema.yaml#/$defs/action_ref |
| /$defs/message/properties/expected_outcomes | type: array; description: Link the changes expected when people act on the message. |  |
| /$defs/message/properties/expected_outcomes/items |  | ../metamodel.schema.yaml#/$defs/outcome_ref |
| /$defs/message/properties/context_refs | type: array; description: Link the situations in which the message is relevant to recipients. |  |
| /$defs/message/properties/context_refs/items |  | ../metamodel.schema.yaml#/$defs/context_ref |
| /$defs/message/properties/core_statement | type: string; description: Write the central idea in language the intended audience can understand. |  |
| /$defs/message/properties/supporting_points | type: array; description: Add the benefits or reasons that make the central statement persuasive. |  |
| /$defs/message/properties/supporting_points/items | type: string |  |
| /$defs/message/properties/framework_pattern | type: string; enum: ["message-house","sb7","aida","pas","bab","stdc","custom"]; description: Choose a structure that sets the order and role of message elements. |  |
| /$defs/message/properties/pattern_blocks | type: object; additionalProperties: true; description: Optional framework-specific fields. |  |
| /$defs/message/properties/tone | type: array; description: Link the writing profiles that govern this message's delivery. |  |
| /$defs/message/properties/tone/items |  | ../metamodel.schema.yaml#/$defs/tone_ref |
| /$defs/message/properties/proof_points | type: array; description: Link the proof writers can draw on when using this message. |  |
| /$defs/message/properties/proof_points/items |  | ../metamodel.schema.yaml#/$defs/proof_ref |
| /$defs/message/properties/message_house_refs | type: array; description: Message houses this message derives from. |  |
| /$defs/message/properties/message_house_refs/items |  | ../metamodel.schema.yaml#/$defs/message_house_ref |
| /$defs/message/properties/evidence_refs | description: Link source records that support the claims or choices captured here. | ../metamodel.schema.yaml#/$defs/evidence_refs |
| /$defs/message/properties/linked_values | type: array; description: Link the value propositions that this communication expresses. |  |
| /$defs/message/properties/linked_values/items |  | ../metamodel.schema.yaml#/$defs/value_ref |
| /$defs/message/properties/linked_positioning | type: array; description: Link the positioning choices this message is meant to reinforce. |  |
| /$defs/message/properties/linked_positioning/items |  | ../metamodel.schema.yaml#/$defs/position_ref |
| /$defs/message/properties/status | description: Record the lifecycle state that governs how contributors should use this entry. | ../metamodel.schema.yaml#/$defs/lifecycle_status |
| /$defs/message/properties/blueprint_links | description: Link Blueprint elements that implement or explain this Brandvoice record. | ../metamodel.schema.yaml#/$defs/optional_blueprint_links |
| /$defs/message/properties/tags | description: Add short labels that help contributors group and find related records. | ../metamodel.schema.yaml#/$defs/tags |

## strategy/visual-identity.schema.yaml

Brandvoice Strategy - Visual Identity

| JSON Pointer | Type / constraints | Reference |
|---|---|---|
| / | type: object; required: ["version"]; additionalProperties: false; description: Visual identity system for brand bible completeness: logo, color, typography, imagery, and iconography usage guidance. Rationale: verbal strategy alone is insufficient for consistent brand expression; teams need explicit visual rules to avoid interpretation drift across channels and contributors.  |  |
| /properties/version | description: Record the version declared for this Brandvoice model file. | ../metamodel.schema.yaml#/$defs/semver |
| /properties/schemaVersion | description: Identify the Brandvoice schema revision used to author this file. | ../metamodel.schema.yaml#/$defs/schema_version |
| /properties/scope | description: Set the context prefix that identifies the namespace for this file. | ../metamodel.schema.yaml#/$defs/context_prefix |
| /properties/tags | description: Add short labels that help contributors group and find related records. | ../metamodel.schema.yaml#/$defs/tags |
| /properties/logo_systems | type: array; description: Approved logo lockups and usage constraints. Rationale: logo misuse is a common source of brand inconsistency and legal risk.  |  |
| /properties/logo_systems/items |  | #/$defs/logo_system |
| /properties/color_palettes | type: array; description: Named color systems with semantic role mapping. Rationale: semantic color roles improve design-system portability and accessibility governance.  |  |
| /properties/color_palettes/items |  | #/$defs/color_palette |
| /properties/typography_systems | type: array; description: Brand typography foundations and hierarchy rules. Rationale: typography strongly influences perceived tone, trust, and readability.  |  |
| /properties/typography_systems/items |  | #/$defs/typography_system |
| /properties/imagery_guidelines | type: array; description: Guidance for photo/illustration style selection. Rationale: uncontrolled imagery creates narrative mismatch even when copy is on-brand.  |  |
| /properties/imagery_guidelines/items |  | #/$defs/imagery_guideline |
| /properties/iconography_guidelines | type: array; description: Icon style and usage policies. Rationale: icon inconsistency harms product wayfinding and weakens visual identity recognition.  |  |
| /properties/iconography_guidelines/items |  | #/$defs/iconography_guideline |
| /properties/layout_principles | type: array; description: Reusable composition principles for brand materials. Rationale: explicit layout heuristics reduce design variance across distributed teams.  |  |
| /properties/layout_principles/items | type: string |  |
| /properties/accessibility_requirements | description: Record checks contributors should apply before approving visual brand materials. | #/$defs/accessibility_requirements |
| /$defs/logo_system | type: object; required: ["name","purpose","usage_principles"]; additionalProperties: false; description: Document an approved lockup and the conditions that preserve its legibility. |  |
| /$defs/logo_system/properties/name | type: string; description: Name the lockup so contributors can select it from the asset library. |  |
| /$defs/logo_system/properties/brand | description: Optional owning brand reference for multi-brand portfolios. | ../metamodel.schema.yaml#/$defs/brand_ref |
| /$defs/logo_system/properties/purpose | type: string; description: Why this lockup exists (for example primary mark, compact mark). |  |
| /$defs/logo_system/properties/file_refs | type: array; description: Asset or repository references for implementation handoff. |  |
| /$defs/logo_system/properties/file_refs/items | type: string |  |
| /$defs/logo_system/properties/usage_principles | type: array; description: Rules that preserve recognizability and legal clarity. |  |
| /$defs/logo_system/properties/usage_principles/items | type: string |  |
| /$defs/logo_system/properties/clear_space_rule | type: string; description: Minimum visual buffer around the logo. |  |
| /$defs/logo_system/properties/min_size_rule | type: string; description: Minimum size to preserve legibility. |  |
| /$defs/logo_system/properties/allowed_backgrounds | type: array; description: Specify the surfaces on which the mark remains legible and recognizable. |  |
| /$defs/logo_system/properties/allowed_backgrounds/items | type: string |  |
| /$defs/logo_system/properties/incorrect_usage | type: array; description: Explicit anti-patterns (stretching, recoloring, effects). |  |
| /$defs/logo_system/properties/incorrect_usage/items | type: string |  |
| /$defs/logo_system/properties/legal_notes | type: string; description: Trademark and legal constraints. Rationale: prevents accidental misuse in external materials.  |  |
| /$defs/logo_system/properties/tags | description: Add short labels that help contributors group and find related records. | ../metamodel.schema.yaml#/$defs/tags |
| /$defs/color_palette | type: object; required: ["name","intent","tokens"]; additionalProperties: false; description: Group colors by narrative intent and the design roles they should serve. |  |
| /$defs/color_palette/properties/name | type: string; description: Give this palette a label that distinguishes it from other approved sets. |  |
| /$defs/color_palette/properties/brand | description: Link the brand whose visual system this guidance belongs to. | ../metamodel.schema.yaml#/$defs/brand_ref |
| /$defs/color_palette/properties/intent | type: string; description: Narrative role of the palette (for example premium, approachable). |  |
| /$defs/color_palette/properties/tokens | type: array; description: Define named colors and how contributors should apply them. |  |
| /$defs/color_palette/properties/tokens/items |  | #/$defs/color_token |
| /$defs/color_palette/properties/combinations_to_avoid | type: array; description: Combinations known to fail accessibility or visual harmony. |  |
| /$defs/color_palette/properties/combinations_to_avoid/items | type: string |  |
| /$defs/color_palette/properties/tags | description: Add short labels that help contributors group and find related records. | ../metamodel.schema.yaml#/$defs/tags |
| /$defs/color_token | type: object; required: ["name","value","role"]; additionalProperties: false; description: Record one reusable color value with its intended design function. |  |
| /$defs/color_token/properties/name | type: string; description: Name the reusable color so designers can reference it consistently. |  |
| /$defs/color_token/properties/value | type: string; pattern: ^#([A-Fa-f0-9]{6}&#124;[A-Fa-f0-9]{8})$; description: Enter the approved hex value to reproduce this color consistently. |  |
| /$defs/color_token/properties/role | type: string; enum: ["primary","secondary","accent","neutral","success","warning","danger","background","text","border","custom"]; description: Assign the function that tells contributors when to select this color. |  |
| /$defs/color_token/properties/usage_notes | type: string; description: Where and why this token should be used. |  |
| /$defs/color_token/properties/contrast_ratio_target | type: string; description: Target WCAG contrast rule when this token is used for text. |  |
| /$defs/typography_system | type: object; required: ["name","rationale","families","hierarchy"]; additionalProperties: false; description: Document type choices and hierarchy so layouts preserve a recognizable reading order. |  |
| /$defs/typography_system/properties/name | type: string; description: Give the system a label for use across design and implementation. |  |
| /$defs/typography_system/properties/brand | description: Link the brand whose visual system this guidance belongs to. | ../metamodel.schema.yaml#/$defs/brand_ref |
| /$defs/typography_system/properties/rationale | type: string; description: Why these type choices fit the brand promise and audience. |  |
| /$defs/typography_system/properties/families | type: array; description: List approved font families and the reading roles they serve. |  |
| /$defs/typography_system/properties/families/items |  | #/$defs/font_family |
| /$defs/typography_system/properties/hierarchy | type: array; description: Text style hierarchy (heading/body/caption/system labels). |  |
| /$defs/typography_system/properties/hierarchy/items |  | #/$defs/type_style |
| /$defs/typography_system/properties/tags | description: Add short labels that help contributors group and find related records. | ../metamodel.schema.yaml#/$defs/tags |
| /$defs/font_family | type: object; required: ["name","role"]; additionalProperties: false; description: Specify a typeface choice with its intended role and sourcing information. |  |
| /$defs/font_family/properties/name | type: string; description: Enter the family name as it appears in design tools. |  |
| /$defs/font_family/properties/role | type: string; enum: ["display","heading","body","mono","ui","fallback"]; description: Choose the text function this family is meant to serve. |  |
| /$defs/font_family/properties/source | type: string; description: Font source or licensing note. |  |
| /$defs/font_family/properties/usage_notes | type: string; description: Explain when to use the family and any relevant substitution guidance. |  |
| /$defs/type_style | type: object; required: ["name","size","weight","line_height"]; additionalProperties: false; description: Specify a repeatable text treatment for one level in the reading hierarchy. |  |
| /$defs/type_style/properties/name | type: string; description: Name the text treatment so contributors can refer to it consistently. |  |
| /$defs/type_style/properties/size | type: string; description: Enter the approved font size with its intended unit. |  |
| /$defs/type_style/properties/weight | type: string; description: Enter the weight that gives this treatment its intended prominence. |  |
| /$defs/type_style/properties/line_height | type: string; description: Set the line spacing that makes this treatment readable in context. |  |
| /$defs/type_style/properties/tracking | type: string; description: Set the letter spacing that suits this text treatment. |  |
| /$defs/type_style/properties/usage | type: string; description: Describe where this treatment belongs in the reading hierarchy. |  |
| /$defs/imagery_guideline | type: object; required: ["name","narrative_intent","do","avoid"]; additionalProperties: false; description: Direct photo and illustration choices toward a consistent narrative effect. |  |
| /$defs/imagery_guideline/properties/name | type: string; description: Name the image direction so contributors can find it during selection. |  |
| /$defs/imagery_guideline/properties/brand | description: Link the brand whose visual system this guidance belongs to. | ../metamodel.schema.yaml#/$defs/brand_ref |
| /$defs/imagery_guideline/properties/narrative_intent | type: string; description: Emotional or strategic effect imagery should create. |  |
| /$defs/imagery_guideline/properties/do | type: array; description: Describe visual choices that express the intended story or mood. |  |
| /$defs/imagery_guideline/properties/do/items | type: string |  |
| /$defs/imagery_guideline/properties/avoid | type: array; description: Describe visual choices that misrepresent the subject or undermine the intended tone. |  |
| /$defs/imagery_guideline/properties/avoid/items | type: string |  |
| /$defs/imagery_guideline/properties/representative_examples | type: array; description: Optional links to canonical reference examples. |  |
| /$defs/imagery_guideline/properties/representative_examples/items | type: string |  |
| /$defs/imagery_guideline/properties/tags | description: Add short labels that help contributors group and find related records. | ../metamodel.schema.yaml#/$defs/tags |
| /$defs/iconography_guideline | type: object; required: ["name","style_principles"]; additionalProperties: false; description: Establish shared rules for creating icons that read as one system. |  |
| /$defs/iconography_guideline/properties/name | type: string; description: Name the icon system contributors should follow when adding assets. |  |
| /$defs/iconography_guideline/properties/style_principles | type: array; description: Describe the conventions that make icons consistent and recognizable at small sizes. |  |
| /$defs/iconography_guideline/properties/style_principles/items | type: string |  |
| /$defs/iconography_guideline/properties/stroke_rule | type: string; description: Define how stroke widths and endpoints behave across icons. |  |
| /$defs/iconography_guideline/properties/corner_rule | type: string; description: Define corner treatment to keep the icon set visually consistent. |  |
| /$defs/iconography_guideline/properties/motion_rule | type: string; description: Optional motion behavior for animated icon systems. |  |
| /$defs/iconography_guideline/properties/tags | description: Add short labels that help contributors group and find related records. | ../metamodel.schema.yaml#/$defs/tags |
| /$defs/accessibility_requirements | type: object; additionalProperties: false; description: Accessibility obligations for visual system usage. Rationale: codifying accessibility prevents late remediation and strengthens inclusivity.  |  |
| /$defs/accessibility_requirements/properties/contrast_standard | type: string; enum: ["wcag-aa","wcag-aaa","custom"]; description: Name the contrast standard contributors should use when reviewing visual combinations. |  |
| /$defs/accessibility_requirements/properties/reduced_motion_policy | type: string; description: Describe how visual treatments should respond when reduced motion is requested. |  |
| /$defs/accessibility_requirements/properties/text_on_color_policy | type: string; description: Give contributors rules for pairing text with colored backgrounds. |  |
| /$defs/accessibility_requirements/properties/image_alt_text_policy | type: string; description: Explain how to describe meaningful images and handle decorative images. |  |
| /$defs/accessibility_requirements/properties/evidence_refs | description: Link source records that support the claims or choices captured here. | ../metamodel.schema.yaml#/$defs/evidence_refs |
