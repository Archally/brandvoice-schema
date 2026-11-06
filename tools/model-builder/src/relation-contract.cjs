// Derive semantic edges from authored fields and explicit nested structures.
// The caller resolves target IDs and owns the entity representation.
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.IMPACT_LINK_RELATION = exports.NON_STANDARD_PLURAL = exports.NON_STANDARD_SINGULAR = exports.RELATION_LOOKUP = void 0;
exports.deriveRelations = deriveRelations;
exports.looksLikeEntityId = looksLikeEntityId;
const RELATION_LOOKUP = {
    market: {
        evidence_refs: 'backed-by',
        key_competitors: 'has-key-competitor',
        actors: 'targets-actor',
        contexts: 'shaped-by-context',
        forces: 'driven-by-force',
        position_maps: 'visualized-on',
        opportunities: 'contains-opportunity',
    },
    market_force: {
        evidence_refs: 'backed-by',
        affected_needs: 'affects-need',
        affected_actors: 'affects-actor',
        affected_markets: 'affects-market',
        creates_opportunities: 'creates-opportunity',
    },
    competitor: {
        position_map_refs: 'mapped-on',
        opportunity_refs: 'threatens-opportunity',
        evidence_refs: 'backed-by',
        for_needs: 'competes-for-need',
        target_actors: 'targets-actor',
        target_markets: 'targets-market',
    },
    ecosystem_player: {
        also_competitor_ref: 'also-competes-as',
        evidence_refs: 'backed-by',
        target_actors: 'targets-actor',
        target_markets: 'targets-market',
    },
    opportunity: {
        market_refs: 'in-market',
        competitor_refs: 'contested-by',
        white_space_refs: 'occupies-white-space',
        white_space_ref: 'occupies-white-space',
        position_map_refs: 'visualized-on',
        related_experiments: 'tested-by',
        evidence_refs: 'backed-by',
        target_actors: 'targets-actor',
        unmet_needs: 'addresses-unmet-need',
        enabling_forces: 'enabled-by-force',
        blocking_forces: 'blocked-by-force',
        addressed_by_offerings: 'addressed-by-offering',
        addressed_by_positioning: 'addressed-by-positioning',
        addressed_by_values: 'addressed-by-value',
        validated_by: 'validated-by',
        invalidated_by: 'invalidated-by',
    },
    position_map: {
        market_refs: 'maps-market',
        evidence_refs: 'backed-by',
    },
    white_space: {
        position_map_ref: 'contained-in',
        opportunity_ref: 'related-to-opportunity',
        evidence_refs: 'backed-by',
        unmet_needs: 'addresses-unmet-need',
        target_actors: 'targets-actor',
        related_opportunities: 'related-to-opportunity',
        competitor_adjacents: 'adjacent-to-competitor',
    },
    actor: {
        evidence_refs: 'backed-by',
    },
    need: {
        context_refs: 'triggered-by',
        evidence_refs: 'backed-by',
        actors: 'experienced-by',
    },
    offering: {
        market_refs: 'serves-market',
        need_refs: 'solves-need',
        evidence_refs: 'backed-by',
        solves_needs: 'solves-need',
        target_audiences: 'targets-audience',
        competitors: 'competes-against',
        addresses_opportunities: 'captures-opportunity',
        proof_points: 'proven-by',
        linked_business_model: 'linked-to-model',
        superseded_by: 'superseded-by',
    },
    context: {
        evidence_refs: 'backed-by',
    },
    audience: {
        evidence_refs: 'backed-by',
        actor: 'represents-actor',
    },
    persona: {
        evidence_refs: 'backed-by',
        audience: 'persona-of',
        actor: 'represents-actor',
    },
    job: {
        evidence_refs: 'backed-by',
        audience: 'job-for',
        need: 'addresses-need',
    },
    value_proposition: {
        offering_refs: 'propositions-offering',
        evidence_refs: 'backed-by',
        offering: 'propositions-offering',
        audience: 'proposed-to',
        jobs_supported: 'supports-job',
        proof_points: 'proven-by',
        addresses_opportunities: 'captures-opportunity',
    },
    positioning: {
        brand_ref: 'positions-brand',
        market_refs: 'targets-market',
        market_ref: 'targets-market',
        competitor_refs: 'competes-against',
        opportunity_ref: 'based-on-opportunity',
        position_map_refs: 'visualized-on',
        evidence_refs: 'backed-by',
        target_audiences: 'targets-audience',
        based_on_opportunities: 'based-on-opportunity',
        competitors: 'competes-against',
        reasons_to_believe: 'reason-to-believe',
    },
    business_model: {
        market_refs: 'serves-market',
        evidence_refs: 'backed-by',
        linked_values: 'linked-to-value',
        linked_positions: 'linked-to-positioning',
        linked_actors: 'linked-to-actor',
        linked_needs: 'linked-to-need',
        linked_offerings: 'linked-to-offering',
    },
    brand: {
        archetype_refs: 'embodies',
        tone_refs: 'sets-tone',
        asset_refs: 'owns-asset',
        market_refs: 'serves-market',
        parent_brand_ref: 'child-of',
        child_brand_refs: 'parents',
        positioning_refs: 'adopts-positioning',
        evidence_refs: 'backed-by',
        pursuing_opportunities: 'pursues-opportunity',
    },
    brand_script: {
        brand_ref: 'script-for-brand',
        primary_audience_refs: 'targets-audience',
        primary_persona_refs: 'targets-persona',
        evidence_refs: 'backed-by',
    },
    personal_brand_profile: {
        subject_brand_ref: 'profiles-brand',
        primary_actor_ref: 'represents-actor',
        audience_refs: 'targets-audience',
        evidence_refs: 'backed-by',
        linked_messages: 'linked-to-message',
    },
    verbal_guideline: {
        evidence_refs: 'backed-by',
    },
    action: {
        evidence_refs: 'backed-by',
        actor: 'performed-by',
        stage: 'occurs-at-stage',
        channel: 'via-channel',
    },
    outcome: {
        evidence_refs: 'backed-by',
        measured_by: 'measured-by',
        linked_metrics: 'linked-to-metric',
        linked_kpis: 'linked-to-kpi',
    },
    proof_point: {
        evidence_refs: 'backed-by',
    },
    message_house: {
        brand_ref: 'houses-brand',
        audience_refs: 'targets-audience',
        actor_refs: 'targets-actor',
        positioning_refs: 'frames-positioning',
        evidence_refs: 'backed-by',
    },
    message_pillar: {
        message_house_ref: 'belongs-to-house',
        message_refs: 'contains-message',
        proof_refs: 'proven-by',
    },
    message: {
        brand_ref: 'messaged-by',
        brand_script_ref: 'uses-brand-script',
        context_refs: 'in-context',
        message_house_refs: 'belongs-to-house',
        evidence_refs: 'backed-by',
        audience: 'targets-audience',
        actor: 'targets-actor',
        offering: 'promotes-offering',
        needs: 'addresses-need',
        journey_stages: 'active-in-stage',
        intended_actions: 'intends-action',
        expected_outcomes: 'expects-outcome',
        tone: 'uses-tone',
        proof_points: 'supported-by',
        linked_values: 'linked-to-value',
        linked_positioning: 'linked-to-positioning',
    },
    channel: {
        audience_refs: 'reaches-audience',
        actor_refs: 'reaches-actor',
        context_refs: 'in-context',
        journey_stage_refs: 'active-in-stage',
        message_refs: 'delivers-message',
        evidence_refs: 'backed-by',
    },
    program: {
        opportunity_refs: 'captures-opportunity',
        market_refs: 'targets-market',
        message_house_refs: 'uses-message-house',
        campaign_refs: 'runs-campaign',
        content_pillar_refs: 'organizes-around',
        evidence_refs: 'backed-by',
    },
    campaign: {
        program_ref: 'belongs-to-program',
        context_refs: 'in-context',
        competitor_refs: 'counters-competitor',
        market_refs: 'targets-market',
        opportunity_refs: 'captures-opportunity',
        message_refs: 'uses-message',
        message_house_refs: 'uses-message-house',
        channel_refs: 'uses-channel',
        content_refs: 'uses-content',
        action_refs: 'drives-action',
        outcome_refs: 'targets-outcome',
        pillar_refs: 'organized-by-pillar',
        evidence_refs: 'backed-by',
        north_star: 'tracks-north-star',
        journey_stages: 'spans-stage',
        target_audiences: 'targets-audience',
        target_actors: 'targets-actor',
        guardrail_metrics: 'guarded-by-metric',
    },
    content_asset: {
        program_ref: 'produced-by-program',
        campaign_refs: 'supports-campaign',
        actor_refs: 'targets-actor',
        market_refs: 'targets-market',
        pillar_refs: 'organized-by-pillar',
        evidence_refs: 'backed-by',
        channel: 'published-on',
        primary_message: 'conveys-message',
        journey_stage: 'targets-stage',
        action: 'drives-action',
        expected_outcomes: 'expects-outcome',
        tone: 'uses-tone',
    },
    content_pillar: {
        audience_refs: 'targets-audience',
        actor_refs: 'targets-actor',
        message_refs: 'anchored-by-message',
        message_house_refs: 'governed-by-house',
        program_refs: 'serves-program',
        evidence_refs: 'backed-by',
    },
    evidence: {
        related_experiments: 'related-to-experiment',
        related_decisions: 'related-to-decision',
        superseded_by: 'superseded-by',
    },
    metric: {
        evidence_refs: 'backed-by',
    },
    kpi: {
        evidence_refs: 'backed-by',
        metric: 'measures',
        linked_campaigns: 'linked-to-campaign',
        linked_messages: 'linked-to-message',
        linked_values: 'linked-to-value',
        linked_outcomes: 'linked-to-outcome',
    },
    experiment: {
        context_refs: 'in-context',
        evidence_refs: 'backed-by',
        decision_outcome: 'decided-by',
        success_metrics: 'measures-success-by',
        expected_outcomes: 'expects-outcome',
        produced_evidence: 'produced-evidence',
    },
    decision: {
        evidence_refs: 'backed-by',
        risks: 'acknowledges-risk',
        supersedes: 'supersedes',
    },
    risk: {
        evidence_refs: 'backed-by',
    },
    priority_stream: {
        offering_ref: 'executes-offering',
        opportunity_ref: 'targets-opportunity',
        evidence_refs: 'backed-by',
    },
    roadmap_phase: {
        evidence_refs: 'backed-by',
    },
};
exports.RELATION_LOOKUP = RELATION_LOOKUP;
const NON_STANDARD_SINGULAR = {
    audience: ['actor'],
    value_proposition: ['audience', 'offering'],
    persona: ['audience', 'actor'],
    job: ['audience', 'need'],
    action: ['actor', 'stage', 'channel'],
    message: ['audience', 'actor', 'offering'],
    content_asset: ['channel', 'primary_message', 'journey_stage', 'action'],
    kpi: ['metric'],
    campaign: ['north_star'],
    experiment: ['decision_outcome'],
};
exports.NON_STANDARD_SINGULAR = NON_STANDARD_SINGULAR;
const NON_STANDARD_PLURAL = {
    market: ['key_competitors', 'actors', 'contexts', 'forces', 'position_maps', 'opportunities'],
    market_force: ['affected_needs', 'affected_actors', 'affected_markets', 'creates_opportunities'],
    need: ['actors'],
    offering: ['target_audiences', 'competitors', 'solves_needs', 'addresses_opportunities', 'proof_points', 'linked_business_model', 'superseded_by'],
    competitor: ['for_needs', 'target_actors', 'target_markets'],
    ecosystem_player: ['target_actors', 'target_markets'],
    positioning: ['target_audiences', 'based_on_opportunities', 'competitors', 'reasons_to_believe'],
    value_proposition: ['jobs_supported', 'proof_points', 'addresses_opportunities'],
    business_model: ['linked_values', 'linked_positions', 'linked_actors', 'linked_needs', 'linked_offerings'],
    brand: ['pursuing_opportunities'],
    personal_brand_profile: ['linked_messages'],
    message: ['needs', 'journey_stages', 'intended_actions', 'expected_outcomes', 'tone', 'proof_points', 'linked_values', 'linked_positioning'],
    campaign: ['journey_stages', 'target_audiences', 'target_actors', 'guardrail_metrics'],
    content_asset: ['expected_outcomes', 'tone'],
    outcome: ['measured_by', 'linked_metrics', 'linked_kpis'],
    kpi: ['linked_campaigns', 'linked_messages', 'linked_values', 'linked_outcomes'],
    decision: ['risks', 'supersedes'],
    opportunity: ['target_actors', 'unmet_needs', 'enabling_forces', 'blocking_forces', 'addressed_by_offerings', 'addressed_by_positioning', 'addressed_by_values', 'validated_by', 'invalidated_by', 'related_experiments'],
    white_space: ['unmet_needs', 'target_actors', 'related_opportunities', 'competitor_adjacents'],
    experiment: ['success_metrics', 'expected_outcomes', 'produced_evidence'],
    evidence: ['superseded_by'],
};
exports.NON_STANDARD_PLURAL = NON_STANDARD_PLURAL;
const IMPACT_LINK_RELATION = {
    actors: 'impacts-actor',
    needs: 'impacts-need',
    offerings: 'impacts-offering',
    channels: 'impacts-channel',
    journey_stages: 'impacts-stage',
    actions: 'impacts-action',
    outcomes: 'impacts-outcome',
    competitors: 'impacts-competitor',
    contexts: 'impacts-context',
    markets: 'impacts-market',
    audiences: 'impacts-audience',
    values: 'impacts-value',
    positioning: 'impacts-positioning',
    messages: 'impacts-message',
    campaigns: 'impacts-campaign',
    kpis: 'impacts-kpi',
    evidence: 'impacts-evidence',
};
exports.IMPACT_LINK_RELATION = IMPACT_LINK_RELATION;
function deriveRelations(entities, resolveTarget, warnings = []) {
    const relations = [];
    for (const entity of entities) {
        extractStandardRefs(entity, resolveTarget, relations, warnings);
        extractNonStandardSingularRefs(entity, resolveTarget, relations, warnings);
        extractNonStandardPluralRefs(entity, resolveTarget, relations, warnings);
        if (entity.entityType === 'evidence') {
            extractEvidenceDirectRefs(entity, resolveTarget, relations, warnings);
        }
        if (entity.entityType === 'risk' || entity.entityType === 'decision') {
            extractImpactLinks(entity, resolveTarget, relations, warnings);
        }
        extractNestedSubObjectRefs(entity, resolveTarget, relations, warnings);
        if (entity.entityType === 'persona') {
            extractEmpathyMapRefs(entity, resolveTarget, relations, warnings);
        }
        if (entity.entityType === 'brand') {
            extractSwotRefs(entity, resolveTarget, relations, warnings);
        }
        if (entity.entityType === 'value_proposition') {
            extractVpcRefs(entity, resolveTarget, relations, warnings);
        }
    }
    relations.sort((first, second) => first.id.localeCompare(second.id));
    return { relations, warnings };
}
function extractStandardRefs(entity, resolveTarget, relations, warnings) {
    for (const [key, value] of Object.entries(entity.data)) {
        if (key === 'id' || key === 'name' || key === 'title')
            continue;
        if (key.endsWith('_refs') && Array.isArray(value)) {
            const relationType = resolveRelationType(entity.entityType, key, warnings);
            for (const item of value) {
                if (typeof item !== 'string')
                    continue;
                const targetId = resolveTarget(item);
                relations.push(createRelation(entity.id, targetId, relationType, key));
            }
        }
        else if (key.endsWith('_ref') && typeof value === 'string') {
            const relationType = resolveRelationType(entity.entityType, key, warnings);
            const targetId = resolveTarget(value);
            relations.push(createRelation(entity.id, targetId, relationType, key));
        }
    }
}
function extractNonStandardSingularRefs(entity, resolveTarget, relations, warnings) {
    const fields = NON_STANDARD_SINGULAR[entity.entityType];
    if (!fields)
        return;
    for (const field of fields) {
        const value = entity.data[field];
        if (typeof value !== 'string')
            continue;
        if (!looksLikeEntityId(value))
            continue;
        const relationType = resolveRelationType(entity.entityType, field, warnings);
        const targetId = resolveTarget(value);
        relations.push(createRelation(entity.id, targetId, relationType, field));
    }
}
function extractNonStandardPluralRefs(entity, resolveTarget, relations, warnings) {
    const fields = NON_STANDARD_PLURAL[entity.entityType];
    if (!fields)
        return;
    for (const field of fields) {
        const value = entity.data[field];
        if (!Array.isArray(value))
            continue;
        const relationType = resolveRelationType(entity.entityType, field, warnings);
        for (const item of value) {
            if (typeof item !== 'string')
                continue;
            if (!looksLikeEntityId(item))
                continue;
            const targetId = resolveTarget(item);
            relations.push(createRelation(entity.id, targetId, relationType, field));
        }
    }
}
function extractEvidenceDirectRefs(entity, resolveTarget, relations, warnings) {
    const supports = entity.data['supports'];
    if (Array.isArray(supports)) {
        for (const targetId of supports) {
            if (typeof targetId !== 'string')
                continue;
            const resolved = resolveTarget(targetId);
            relations.push(createRelation(entity.id, resolved, 'supports', 'supports'));
        }
    }
    const contradicts = entity.data['contradicts'];
    if (Array.isArray(contradicts)) {
        for (const targetId of contradicts) {
            if (typeof targetId !== 'string')
                continue;
            const resolved = resolveTarget(targetId);
            relations.push(createRelation(entity.id, resolved, 'contradicts', 'contradicts'));
        }
    }
}
function extractImpactLinks(entity, resolveTarget, relations, warnings) {
    const fieldName = entity.entityType === 'risk' ? 'affects' : 'impacts';
    const impactLinks = entity.data[fieldName];
    if (!impactLinks || typeof impactLinks !== 'object' || Array.isArray(impactLinks))
        return;
    const links = impactLinks;
    for (const [linkKey, linkValue] of Object.entries(links)) {
        if (!Array.isArray(linkValue))
            continue;
        const relationType = IMPACT_LINK_RELATION[linkKey];
        if (!relationType) {
            warnings.push(`Unknown impact_links key '${linkKey}' on ${entity.id}`);
            continue;
        }
        for (const targetId of linkValue) {
            if (typeof targetId !== 'string')
                continue;
            const resolved = resolveTarget(targetId);
            const refField = `${fieldName}.${linkKey}`;
            relations.push(createRelation(entity.id, resolved, relationType, refField));
        }
    }
}
function extractNestedSubObjectRefs(entity, resolveTarget, relations, warnings) {
    if (entity.entityType === 'competitor') {
        extractCompetitorNestedRefs(entity, resolveTarget, relations, warnings);
    }
    if (entity.entityType === 'competitor') {
        extractNeedFitRefs(entity, resolveTarget, relations, warnings);
    }
    if (entity.entityType === 'competitor') {
        extractWeaknessRefs(entity, resolveTarget, relations, warnings);
    }
    if (entity.entityType === 'personal_brand_profile') {
        extractAuthoritySourceRefs(entity, resolveTarget, relations, warnings);
    }
    if (entity.entityType === 'experiment') {
        extractExperimentVariantRefs(entity, resolveTarget, relations, warnings);
    }
}
function extractCompetitorNestedRefs(entity, resolveTarget, relations, warnings) {
    const moves = entity.data['competitive_moves'];
    if (!Array.isArray(moves))
        return;
    for (const move of moves) {
        const moveObject = asObject(move);
        if (!moveObject)
            continue;
        if (Array.isArray(moveObject['affected_needs'])) {
            for (const targetId of moveObject['affected_needs']) {
                if (typeof targetId !== 'string')
                    continue;
                const resolved = resolveTarget(targetId);
                relations.push(createRelation(entity.id, resolved, 'move-affects-need', 'competitive_moves.affected_needs'));
            }
        }
        if (Array.isArray(moveObject['affected_opportunities'])) {
            for (const targetId of moveObject['affected_opportunities']) {
                if (typeof targetId !== 'string')
                    continue;
                const resolved = resolveTarget(targetId);
                relations.push(createRelation(entity.id, resolved, 'move-affects-opportunity', 'competitive_moves.affected_opportunities'));
            }
        }
        if (typeof moveObject['response_ref'] === 'string') {
            const resolved = resolveTarget(moveObject['response_ref']);
            relations.push(createRelation(entity.id, resolved, 'move-responded-by', 'competitive_moves.response_ref'));
        }
    }
}
function extractNeedFitRefs(entity, resolveTarget, relations, warnings) {
    const needFit = entity.data['need_fit'];
    if (!Array.isArray(needFit))
        return;
    for (const assessment of needFit) {
        const assessmentObject = asObject(assessment);
        if (!assessmentObject)
            continue;
        if (typeof assessmentObject['need'] === 'string') {
            const resolved = resolveTarget(assessmentObject['need']);
            relations.push(createRelation(entity.id, resolved, 'assessed-fit-for', 'need_fit.need'));
        }
        if (Array.isArray(assessmentObject['actors_served'])) {
            for (const targetId of assessmentObject['actors_served']) {
                if (typeof targetId !== 'string')
                    continue;
                const resolved = resolveTarget(targetId);
                relations.push(createRelation(entity.id, resolved, 'serves-actor-for-need', 'need_fit.actors_served'));
            }
        }
    }
}
function extractExperimentVariantRefs(entity, resolveTarget, relations, warnings) {
    const variants = entity.data['variants'];
    if (!Array.isArray(variants))
        return;
    const variantRefFields = [
        ['message', 'tests-message'],
        ['channel', 'tests-channel'],
        ['content', 'tests-content'],
        ['action', 'tests-action'],
    ];
    for (const variant of variants) {
        const variantObject = asObject(variant);
        if (!variantObject)
            continue;
        for (const [field, relationType] of variantRefFields) {
            if (typeof variantObject[field] === 'string') {
                const resolved = resolveTarget(variantObject[field]);
                relations.push(createRelation(entity.id, resolved, relationType, `variants.${field}`));
            }
        }
    }
}
function extractWeaknessRefs(entity, resolveTarget, relations, warnings) {
    const weaknesses = entity.data['weaknesses'];
    if (!Array.isArray(weaknesses))
        return;
    for (const weakness of weaknesses) {
        const weaknessObject = asObject(weakness);
        if (!weaknessObject)
            continue;
        if (Array.isArray(weaknessObject['exploitable_by_refs'])) {
            for (const targetId of weaknessObject['exploitable_by_refs']) {
                if (typeof targetId !== 'string')
                    continue;
                const resolved = resolveTarget(targetId);
                relations.push(createRelation(entity.id, resolved, 'weakness-exploitable-by', 'weaknesses.exploitable_by_refs'));
            }
        }
    }
}
function extractAuthoritySourceRefs(entity, resolveTarget, relations, warnings) {
    const sources = entity.data['authority_sources'];
    if (!Array.isArray(sources))
        return;
    for (const source of sources) {
        const sourceObject = asObject(source);
        if (!sourceObject)
            continue;
        if (Array.isArray(sourceObject['counters_competitor_refs'])) {
            for (const targetId of sourceObject['counters_competitor_refs']) {
                if (typeof targetId !== 'string')
                    continue;
                const resolved = resolveTarget(targetId);
                relations.push(createRelation(entity.id, resolved, 'counters-competitor', 'authority_sources.counters_competitor_refs'));
            }
        }
    }
}
function extractEmpathyMapRefs(entity, resolveTarget, relations, warnings) {
    const empathyMap = entity.data['empathy_map'];
    const empathyMapObject = asObject(empathyMap);
    if (!empathyMapObject)
        return;
    const quadrants = ['thinks', 'feels', 'sees', 'hears', 'says_and_does', 'pains', 'gains'];
    for (const quadrant of quadrants) {
        const items = empathyMapObject[quadrant];
        if (!Array.isArray(items))
            continue;
        for (const item of items) {
            const itemObject = asObject(item);
            if (!itemObject || !Array.isArray(itemObject['evidence_refs']))
                continue;
            for (const targetId of itemObject['evidence_refs']) {
                if (typeof targetId !== 'string')
                    continue;
                const resolved = resolveTarget(targetId);
                relations.push(createRelation(entity.id, resolved, 'backed-by', `empathy_map.${quadrant}.evidence_refs`));
            }
        }
    }
}
function extractSwotRefs(entity, resolveTarget, relations, warnings) {
    const swot = entity.data['swot'];
    const swotObject = asObject(swot);
    if (!swotObject)
        return;
    const quadrants = ['strengths', 'weaknesses', 'opportunities', 'threats'];
    for (const quadrant of quadrants) {
        const items = swotObject[quadrant];
        if (!Array.isArray(items))
            continue;
        for (const item of items) {
            const itemObject = asObject(item);
            if (!itemObject)
                continue;
            if (Array.isArray(itemObject['evidence_refs'])) {
                for (const targetId of itemObject['evidence_refs']) {
                    if (typeof targetId !== 'string')
                        continue;
                    const resolved = resolveTarget(targetId);
                    relations.push(createRelation(entity.id, resolved, 'backed-by', `swot.${quadrant}.evidence_refs`));
                }
            }
            if (quadrant === 'opportunities' && typeof itemObject['opportunity_ref'] === 'string') {
                const resolved = resolveTarget(itemObject['opportunity_ref']);
                relations.push(createRelation(entity.id, resolved, 'swot-opportunity', 'swot.opportunities.opportunity_ref'));
            }
            if (quadrant === 'threats' && typeof itemObject['risk_ref'] === 'string') {
                const resolved = resolveTarget(itemObject['risk_ref']);
                relations.push(createRelation(entity.id, resolved, 'swot-threat', 'swot.threats.risk_ref'));
            }
        }
    }
}
function extractVpcRefs(entity, resolveTarget, relations, warnings) {
    const nestedFields = [
        ['pain_relievers', 'relieves-pain'],
        ['gain_creators', 'creates-gain'],
    ];
    for (const [fieldName, relationType] of nestedFields) {
        const items = entity.data[fieldName];
        if (!Array.isArray(items))
            continue;
        for (const item of items) {
            const itemObject = asObject(item);
            if (!itemObject)
                continue;
            if (typeof itemObject['need_ref'] === 'string') {
                const resolved = resolveTarget(itemObject['need_ref']);
                relations.push(createRelation(entity.id, resolved, relationType, `${fieldName}.need_ref`));
            }
            if (Array.isArray(itemObject['evidence_refs'])) {
                for (const targetId of itemObject['evidence_refs']) {
                    if (typeof targetId !== 'string')
                        continue;
                    const resolved = resolveTarget(targetId);
                    relations.push(createRelation(entity.id, resolved, 'backed-by', `${fieldName}.evidence_refs`));
                }
            }
        }
    }
}
function resolveRelationType(entityType, refField, warnings) {
    if (refField === 'evidence_refs')
        return 'backed-by';
    const entityLookup = RELATION_LOOKUP[entityType];
    if (entityLookup && entityLookup[refField]) {
        return entityLookup[refField];
    }
    const fallback = refField.replace(/_refs?$/, '');
    warnings.push(`Unknown ref field '${refField}' on entity type '${entityType}', ` +
        `using fallback relation type '${fallback}'`);
    return fallback;
}
function createRelation(sourceId, targetId, relationType, refField) {
    return {
        id: `REL-${sourceId}-${refField}-${targetId}`,
        sourceId,
        targetId,
        relationType,
        refField,
    };
}
function asObject(value) {
    if (typeof value === 'object' && value !== null && !Array.isArray(value)) {
        return value;
    }
    return null;
}
function looksLikeEntityId(value) {
    return /^([a-z][a-z0-9-]*\.)?[A-Z]{2,4}\d{3,}$/.test(value);
}
