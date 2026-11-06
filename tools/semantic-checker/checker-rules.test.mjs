import assert from 'node:assert/strict';
import { after, test } from 'node:test';
import { existsSync, mkdtempSync, mkdirSync, readdirSync, rmSync, writeFileSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { join, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';
import YAML from 'yaml';
import { loadRules, loadExtensions, runChecker } from '@archally/semantic-checker';
import { loadBrandvoice, buildBrandvoiceModel } from '../model-builder/dist/index.js';
import { toCheckableModel } from './dist/adapter.js';
import { validateModel } from '../validator/src/validate.mjs';

const checkerDirectory = fileURLToPath(new URL('.', import.meta.url));
const canonicalMode = existsSync(new URL('../../v1/schema', import.meta.url));
const publicRoot = resolve(checkerDirectory, '../..');
const schemaDirectory = canonicalMode
  ? resolve(checkerDirectory, '../../v1/schema')
  : join(publicRoot, 'schema', readdirSync(join(publicRoot, 'schema')).sort().at(-1));
const fixtureRoot = mkdtempSync(join(tmpdir(), 'brandvoice-checker-rules-'));
const rules = await loadRules(join(checkerDirectory, 'rules'));
const extensions = await loadExtensions(rules);
let fixtureCount = 0;

after(() => {
  rmSync(fixtureRoot, { recursive: true, force: true });
});

function offering(id = 'OFF001', data = {}) {
  return { id, name: id, value_statement: 'Synthetic offering', ...data };
}

function audience(id = 'AUD001', data = {}) {
  return { id, name: id, need: 'Synthetic need', ...data };
}

function evidence(id = 'EVD001', data = {}) {
  return { id, title: id, type: 'observation', date: '2026-11-06', ...data };
}

function persona(data = {}) {
  return { id: 'PER001', name: 'Synthetic persona', audience: 'AUD001', ...data };
}

function message(data = {}) {
  return { id: 'MSG001', title: 'Synthetic message', core_statement: 'Clarity', offering: 'OFF001', ...data };
}

function valueProposition(data = {}) {
  return { id: 'VAL001', audience: 'AUD001', offering: 'OFF001', value_statement: 'Clarity', ...data };
}

function competitor(data = {}) {
  return { id: 'CPR001', name: 'Synthetic competitor', type: 'direct', ...data };
}

function fixture(marketProduct = {}, extra = {}) {
  fixtureCount += 1;
  const directory = join(fixtureRoot, String(fixtureCount));
  mkdirSync(directory);
  const shards = {
    'market-product.yaml': { version: '1.0.0', ...marketProduct },
    'messaging.yaml': { version: '1.0.0', messages: extra.messages ?? [] },
    'evidence.yaml': { version: '1.0.0', evidence: extra.evidence ?? [] },
    'competition.yaml': { version: '1.0.0', competitors: extra.competitors ?? [] },
  };
  for (const [name, contents] of Object.entries(shards)) {
    writeFileSync(join(directory, name), YAML.stringify(contents));
  }
  writeFileSync(join(directory, 'brandvoice.yaml'), YAML.stringify({
    version: '1.0.0',
    name: 'Synthetic checker fixture',
    strategy: {
      market_product: { $ref: 'market-product.yaml' },
      messaging: { $ref: 'messaging.yaml' },
    },
    market: { competition: { $ref: 'competition.yaml' } },
    governance: { evidence: { $ref: 'evidence.yaml' } },
  }));
  const validation = validateModel({ model: directory, schemas: schemaDirectory });
  assert.deepEqual(validation.schemaErrors, [], 'Fixture must be schema-valid');
  const composed = loadBrandvoice(directory);
  assert.deepEqual(composed.errors, []);
  return toCheckableModel(buildBrandvoiceModel(composed.root));
}

function findings(ruleId, model) {
  return runChecker(model, rules.filter(rule => rule.id === ruleId), {}, extensions);
}

function expectIssues(ruleId, model, entityIds, severity = 'warn', context) {
  const issues = findings(ruleId, model);
  assert.deepEqual(issues.map(issue => issue.entityId).sort(), [...entityIds].sort());
  for (const issue of issues) {
    assert.equal(issue.ruleId, ruleId);
    assert.equal(issue.severity, severity);
    assert.ok(issue.message.includes(issue.entityId));
    assert.ok(!issue.message.includes('{'));
    if (context) {
      assert.match(issue.message, context);
    }
  }
  assert.deepEqual(findings(ruleId, model), issues, 'Issue IDs and messages are stable');
  return issues;
}

test('R1 reports an explicitly active offering without an audience', () => {
  expectIssues('active-offering-audience', fixture({ offerings: [offering('OFF001', { status: 'active' })] }), ['OFF001'], 'warn', /audience/);
});

test('R7 reports both members of an evidence replacement cycle', () => {
  const model = fixture({}, { evidence: [evidence('EVD002', { superseded_by: ['EVD003'] }), evidence('EVD003', { superseded_by: ['EVD002'] })] });
  expectIssues('superseded-by-cycle', model, ['EVD002', 'EVD003'], 'error', /EVD002.*EVD003/);
});

test('loads eighteen unique rules and twelve custom extensions', () => {
  assert.equal(rules.length, 18);
  assert.equal(new Set(rules.map(rule => rule.id)).size, 18);
  assert.equal(extensions.size, 12);
  assert.equal(rules.find(rule => rule.id === 'evidence-level-backed').check.custom.module, './evidence-level-backed.mjs');
});

for (const status of ['active', 'beta', undefined, 'deprioritized', 'sunset']) {
  test(`R1 respects explicit status ${status ?? 'absent'} and real target audiences`, () => {
    const data = status === undefined ? {} : { status };
    const expected = ['active', 'beta'].includes(status) ? ['OFF001'] : [];
    expectIssues('active-offering-audience', fixture({ offerings: [offering('OFF001', data)] }), expected);
    expectIssues('active-offering-audience', fixture({ offerings: [offering('OFF001', { ...data, target_audiences: ['AUD001'] })], audiences: [audience()] }), []);
  });
}

for (const attachment of ['value_proposition', 'message']) {
  test(`R1 accepts ${attachment} audience and rejects a dangling audience`, () => {
    for (const reference of ['AUD001', 'AUD999']) {
      const marketProduct = { offerings: [offering('OFF001', { status: 'active' })], audiences: [audience()] };
      const extra = {};
      if (attachment === 'value_proposition') {
        marketProduct.value_propositions = [valueProposition({ audience: reference })];
      }
      if (attachment === 'message') {
        extra.messages = [message({ audience: reference })];
      }
      expectIssues('active-offering-audience', fixture(marketProduct, extra), reference === 'AUD001' ? [] : ['OFF001']);
    }
  });
}

test('R1 rejects a target placeholder and accepts a qualified real identity', () => {
  expectIssues('active-offering-audience', fixture({ offerings: [offering('OFF001', { status: 'active', target_audiences: ['AUD999'] })] }), ['OFF001']);
  expectIssues('active-offering-audience', fixture({ offerings: [offering('OFF001', { status: 'beta', target_audiences: ['strategy.AUD001'] })], audiences: [audience()] }), []);
});

for (const level of ['hypothesis', 'weak-signal', 'moderate-evidence', 'strong-evidence', undefined]) {
  test(`R2 requires all resolved audiences explicitly hypothesis with ${level ?? 'absent'}`, () => {
    const data = level === undefined ? {} : { evidence_level: level };
    const model = fixture({ offerings: [offering('OFF001', { target_audiences: ['AUD001', 'AUD002', 'AUD999'] })], audiences: [audience('AUD001', { evidence_level: 'hypothesis' }), audience('AUD002', data)] });
    expectIssues('offering-audiences-untested', model, level === 'hypothesis' ? ['OFF001'] : [], 'info', /AUD001.*AUD002/);
  });
}

test('R2 ignores omitted and entirely unresolved target sets', () => {
  expectIssues('offering-audiences-untested', fixture({ offerings: [offering(), offering('OFF002', { target_audiences: ['AUD999'] })] }), [], 'info');
});

for (const plane of ['strategy', 'market']) {
  for (const [field, value] of [['strengths', ['Fast']], ['weaknesses', ['Slow']], ['evidence_refs', ['EVD004']]]) {
    test(`R3 accepts populated ${field} in the ${plane} shard`, () => {
      const marketProduct = { offerings: [offering('OFF001', { competitors: ['CPR001'] })] };
      const extra = { evidence: [evidence('EVD004')] };
      if (plane === 'strategy') {
        marketProduct.competitors = [competitor({ [field]: value })];
      }
      if (plane === 'market') {
        extra.competitors = [competitor({ [field]: value })];
      }
      expectIssues('offering-competitor-depth', fixture(marketProduct, extra), []);
    });
  }
}

test('R3 reports bare competitors and empty containers while ignoring unresolved competitors', () => {
  const model = fixture({ offerings: [offering('OFF001', { competitors: ['CPR001', 'CPR999'] })], competitors: [competitor({ strengths: [], weaknesses: [], evidence_refs: [] })] }, { competitors: [competitor({ pricing: {} })] });
  expectIssues('offering-competitor-depth', model, ['OFF001'], 'warn', /CPR001/);
  expectIssues('offering-competitor-depth', fixture({ offerings: [offering('OFF001', { competitors: ['CPR999'] })] }), []);
});

test('R3 accepts pricing as the only populated depth field', () => {
  expectIssues('offering-competitor-depth', fixture({ offerings: [offering('OFF001', { competitors: ['market.CPR001'] })] }, { competitors: [competitor({ pricing: { model: 'flat-rate' } })] }), []);
});

test('R3 retains depth across duplicate strategy and market IDs', () => {
  const model = fixture({ offerings: [offering('OFF001', { competitors: ['CPR001'] })], competitors: [competitor()] }, { competitors: [competitor({ weaknesses: ['Slow'], evidence_refs: ['EVD004'] })], evidence: [evidence('EVD004')] });
  expectIssues('offering-competitor-depth', model, []);
});

for (const entityType of ['audience', 'persona']) {
  for (const level of ['hypothesis', 'weak-signal', 'moderate-evidence', 'strong-evidence', undefined]) {
    test(`R4 checks ${entityType} level ${level ?? 'absent'} with resolved evidence`, () => {
      for (const reference of [undefined, 'EVD001', 'EVD999']) {
        const data = {};
        if (level !== undefined) {
          data.evidence_level = level;
        }
        if (reference !== undefined) {
          data.evidence_refs = [reference];
        }
        const marketProduct = { audiences: [audience()] };
        if (entityType === 'audience') {
          marketProduct.audiences = [audience('AUD001', data)];
        }
        if (entityType === 'persona') {
          marketProduct.personas = [persona(data)];
        }
        const expected = level !== undefined && level !== 'hypothesis' && reference !== 'EVD001' ? [entityType === 'audience' ? 'AUD001' : 'PER001'] : [];
        expectIssues('evidence-level-backed', fixture(marketProduct, { evidence: [evidence()] }), expected, 'warn', /evidence/);
      }
    });
  }
}

test('evidence rules accept only outgoing linkage to authored targets, including synthetic R4 validated-by', () => {
  for (const type of ['audience', 'persona']) {
    const id = type === 'audience' ? 'AUD001' : 'PER001';
    const base = { schema: 'brandvoice', structure: { planes: [], layers: [], slices: [] }, metadata: {}, entities: [{ id, type, data: { evidence_level: 'moderate-evidence' } }, { id: 'EVD001', type: 'evidence', data: {} }], relations: [{ id: 'REL001', source: id, target: 'EVD001', type: 'validated-by' }] };
    expectIssues('evidence-level-backed', base, []);
    expectIssues('evidence-level-backed', { ...base, relations: [] }, [id]);
    for (const ruleId of ['evidence-level-backed', 'evidence-coverage', 'positioning-evidence']) {
      const subjectType = ruleId === 'evidence-level-backed' ? type : ruleId === 'evidence-coverage' ? 'market' : 'positioning';
      const subject = { ...base.entities[0], type: subjectType };
      for (const relationType of ['backed-by', 'validated-by']) {
        const relation = { ...base.relations[0], type: relationType };
        const model = { ...base, entities: [subject, base.entities[1]], relations: [relation] };
        const acceptsRelation = ruleId !== 'positioning-evidence' || relationType === 'backed-by';
        expectIssues(ruleId, model, acceptsRelation ? [] : [id]);
        expectIssues(ruleId, { ...model, entities: [subject] }, [id]);
        const placeholder = { ...base.entities[1], data: { _placeholder: true } };
        expectIssues(ruleId, { ...model, entities: [subject, placeholder] }, [id]);
        expectIssues(ruleId, { ...model, relations: [{ ...relation, source: 'EVD001', target: id }] }, [id]);
        expectIssues(ruleId, { ...model, relations: [{ ...relation, type: 'targets' }] }, [id]);
        const scopedEvidence = { ...base.entities[1], id: 'source.EVD001' };
        const scopedModel = { ...model, entities: [subject, scopedEvidence] };
        expectIssues(ruleId, { ...scopedModel, relations: [{ ...relation, target: scopedEvidence.id }] }, acceptsRelation ? [] : [id]);
        expectIssues(ruleId, scopedModel, [id]);
        expectIssues(ruleId, { ...scopedModel, relations: [{ ...relation, target: 'other.EVD001' }] }, [id]);
      }
    }
  }
});

test('evidence coverage retains unscoped and scoped authored targets across supplementary evidence documents', () => {
  const actors = [
    { id: 'ACT001', name: 'Unscoped reference', role: 'buyer', evidence_refs: ['EVD001'] },
    { id: 'ACT002', name: 'Scoped reference', role: 'buyer', evidence_refs: ['source.EVD002'] },
    { id: 'ACT003', name: 'Dangling reference', role: 'buyer', evidence_refs: ['EVD999'] },
  ];
  expectIssues('evidence-coverage', fixture({ actors }, {
    evidence: [evidence(), evidence('source.EVD002')],
  }), ['ACT003']);
  fixtureCount += 1;
  const directory = join(fixtureRoot, String(fixtureCount));
  const governanceDirectory = join(directory, 'governance');
  mkdirSync(governanceDirectory, { recursive: true });
  writeFileSync(join(directory, 'brandvoice.yaml'), YAML.stringify({
    version: '1.0.0',
    name: 'Synthetic evidence composition regression',
    strategy: { market_product: { $ref: 'market-product.yaml' } },
  }));
  writeFileSync(join(directory, 'market-product.yaml'), YAML.stringify({
    version: '1.0.0',
    actors,
  }));
  writeFileSync(join(governanceDirectory, 'core.evidence.yaml'), YAML.stringify({
    version: '1.0.0', evidence: [evidence()],
  }));
  writeFileSync(join(governanceDirectory, 'evidence.yaml'), YAML.stringify({
    version: '1.0.0', evidence: [evidence('source.EVD002')],
  }));
  const validation = validateModel({ model: directory, schemas: schemaDirectory });
  assert.deepEqual(validation.schemaErrors, [], 'Fixture must be schema-valid');
  const composed = loadBrandvoice(directory);
  assert.deepEqual(composed.errors, []);
  const model = toCheckableModel(buildBrandvoiceModel(composed.root));
  expectIssues('evidence-coverage', model, ['ACT003']);
});

for (const [personaLevel, audienceLevel, fails] of [
  ['strong-evidence', 'hypothesis', true],
  ['weak-signal', 'hypothesis', true],
  ['moderate-evidence', 'weak-signal', true],
  ['strong-evidence', 'moderate-evidence', true],
  ['hypothesis', 'hypothesis', false],
  ['weak-signal', 'moderate-evidence', false],
  [undefined, 'hypothesis', false],
  ['strong-evidence', undefined, false],
]) {
  test(`R5 compares persona ${personaLevel} with audience ${audienceLevel}`, () => {
    const personaData = personaLevel === undefined ? {} : { evidence_level: personaLevel };
    const audienceData = audienceLevel === undefined ? {} : { evidence_level: audienceLevel };
    expectIssues('persona-evidence-within-audience', fixture({ audiences: [audience('AUD001', audienceData)], personas: [persona({ ...personaData, audience: 'strategy.AUD001' })] }), fails ? ['PER001'] : [], 'warn', /AUD001/);
  });
}

test('R5 leaves a missing audience to reference validation', () => {
  expectIssues('persona-evidence-within-audience', fixture({ personas: [persona({ evidence_level: 'strong-evidence' })] }), []);
});

for (const [status, replacementStatus, fails] of [
  ['active', 'active', true],
  ['beta', 'active', true],
  ['deprioritized', 'sunset', true],
  ['sunset', 'deprioritized', true],
  ['active', 'sunset', true],
  ['deprioritized', 'active', false],
  [undefined, undefined, false],
]) {
  test(`R6 aggregates lifecycle reasons for ${status} replaced by ${replacementStatus}`, () => {
    const sourceData = status === undefined ? {} : { status };
    const replacementData = replacementStatus === undefined ? {} : { status: replacementStatus };
    const model = fixture({ offerings: [offering('OFF004', { ...sourceData, superseded_by: ['OFF005'] }), offering('OFF005', replacementData)] });
    const issues = expectIssues('superseded-offering-lifecycle', model, fails ? ['OFF004'] : [], 'warn', /lifecycle/);
    if (status === 'active' && replacementStatus === 'sunset') {
      assert.match(issues[0].message, /retired replacements: OFF005; superseded offering remains active\/beta/);
    }
  });
}

test('R6 sorts multiple retired replacements and ignores missing replacements and statuses', () => {
  const model = fixture({ offerings: [offering('OFF001', { superseded_by: ['OFF003', 'OFF002', 'OFF999', 'OFF004'] }), offering('OFF002', { status: 'sunset' }), offering('OFF003', { status: 'deprioritized' }), offering('OFF004')] });
  expectIssues('superseded-offering-lifecycle', model, ['OFF001'], 'warn', /OFF002, OFF003/);
  expectIssues('superseded-offering-lifecycle', fixture({ offerings: [offering('OFF001', { status: 'active' })] }), []);
});

const cycleCases = [
  ['self-loop', [[1]], [1]],
  ['pair', [[2], [1]], [1, 2]],
  ['longer', [[2], [3], [1]], [1, 2, 3]],
  ['branching', [[2, 3], [], [1]], [1, 3]],
  ['overlapping', [[2], [1, 3], [2]], [1, 2, 3]],
  ['tail', [[2], [3], [2]], [2, 3]],
  ['diamond', [[2, 3], [4], [4], []], []],
  ['chain', [[2], [3], []], []],
  ['dangling', [[9]], []],
];

for (const type of ['offering', 'evidence']) {
  for (const [name, graph, members] of cycleCases) {
    test(`R7 ${type} ${name} reports exactly cycle members independently of entity and edge order`, () => {
      const prefix = type === 'offering' ? 'OFF' : 'EVD';
      const idFor = number => prefix + String(number).padStart(3, '0');
      const entities = graph.map((successors, index) => {
        const data = successors.length > 0 ? { superseded_by: successors.map(idFor) } : {};
        return type === 'offering' ? offering(idFor(index + 1), data) : evidence(idFor(index + 1), data);
      });
      const model = type === 'offering' ? fixture({ offerings: entities }) : fixture({}, { evidence: entities });
      const expected = members.map(idFor);
      const issues = expectIssues('superseded-by-cycle', model, expected, 'error', /cycle/);
      const reversed = { ...model, entities: [...model.entities].reverse(), relations: [...model.relations].reverse() };
      assert.deepEqual(findings('superseded-by-cycle', reversed), issues);
    });
  }
}

for (const attachment of ['value_proposition', 'message']) {
  test(`R8 ${attachment} respects target identities, omitted targets and dangling audiences`, () => {
    for (const [targets, attachedAudience, fails] of [
      [['AUD002'], 'AUD003', true],
      [['strategy.AUD002'], 'AUD002', false],
      [['AUD002'], 'strategy.AUD002', false],
      [undefined, 'AUD003', false],
      [['AUD002'], 'AUD999', false],
    ]) {
      const data = targets === undefined ? {} : { target_audiences: targets };
      const marketProduct = { offerings: [offering('OFF001', data)], audiences: [audience('AUD002'), audience('AUD003')] };
      const extra = {};
      if (attachment === 'value_proposition') {
        marketProduct.value_propositions = [valueProposition({ offering: 'strategy.OFF001', audience: attachedAudience })];
      }
      if (attachment === 'message') {
        extra.messages = [message({ offering: 'strategy.OFF001', audience: attachedAudience })];
      }
      expectIssues('offering-audience-consistency', fixture(marketProduct, extra), fails ? ['OFF001'] : [], 'warn', /AUD003/);
    }
  });
}

for (const status of ['sunset', 'deprioritized', 'active', undefined]) {
  for (const messageStatus of ['active', 'paused', undefined]) {
    test(`R9 ${messageStatus ?? 'unstated'} message promoting ${status ?? 'unstated'} offering`, () => {
      const offeringData = status === undefined ? {} : { status };
      const messageData = messageStatus === undefined ? {} : { status: messageStatus };
      const fails = messageStatus === 'active' && ['sunset', 'deprioritized'].includes(status);
      expectIssues('active-message-retired-offering', fixture({ offerings: [offering('OFF001', offeringData)] }, { messages: [message({ ...messageData, offering: 'strategy.OFF001' })] }), fails ? ['MSG001'] : [], 'warn', /OFF001/);
    });
  }
}

test('R9 ignores a dangling offering', () => {
  expectIssues('active-message-retired-offering', fixture({}, { messages: [message({ status: 'active', offering: 'OFF999' })] }), []);
});

test('R7 deduplicates repeated replacement edges and sorts only the cycle component', () => {
  const model = fixture({ offerings: [
    offering('OFF001', { superseded_by: ['OFF002', 'OFF002'] }),
    offering('OFF002', { superseded_by: ['OFF003'] }),
    offering('OFF003', { superseded_by: ['OFF002', 'OFF004'] }),
    offering('OFF004'),
  ] });
  assert.deepEqual(findings('superseded-by-cycle', model), ['OFF002', 'OFF003'].map(entityId => ({
    ruleId: 'superseded-by-cycle',
    entityId,
    severity: 'error',
    message: `Entity '${entityId}' belongs to a superseded_by cycle: OFF002, OFF003.`,
  })));
});

test('R7 keeps separate replacement cycles separate and follows qualified successors', () => {
  const model = fixture({}, { evidence: [
    evidence('EVD001', { superseded_by: ['governance.EVD002'] }),
    evidence('EVD002', { superseded_by: ['EVD001'] }),
    evidence('EVD003', { superseded_by: ['EVD003'] }),
  ] });
  const issues = expectIssues('superseded-by-cycle', model, ['EVD001', 'EVD002', 'EVD003'], 'error');
  assert.equal(issues[0].message, "Entity 'EVD001' belongs to a superseded_by cycle: EVD001, EVD002.");
  assert.equal(issues[2].message, "Entity 'EVD003' belongs to a superseded_by cycle: EVD003.");
});

test('configuration preserves severity overrides and off for the new rules', () => {
  const model = fixture({ offerings: [offering('OFF001', { status: 'active', superseded_by: ['OFF001'] })] });
  const selectedRules = rules.filter(rule => ['active-offering-audience', 'superseded-by-cycle'].includes(rule.id));
  const issues = runChecker(model, selectedRules, { rules: { 'active-offering-audience': 'info', 'superseded-by-cycle': 'off' } }, extensions);
  assert.deepEqual(issues.map(issue => [issue.ruleId, issue.severity]), [['active-offering-audience', 'info']]);
});

test('R3 accepts strategy depth when another shard with the same ID is bare', () => {
  const model = fixture({ offerings: [offering('OFF001', { competitors: ['CPR001'] })], competitors: [competitor({ strengths: ['Fast'] })] }, { competitors: [competitor()] });
  expectIssues('offering-competitor-depth', model, []);
});
