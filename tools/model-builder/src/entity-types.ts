export const PREFIX_TO_TYPE: Record<string, string> = {
  MKT: 'market',
  MFR: 'market_force',
  CPR: 'competitor',
  EPL: 'ecosystem_player',
  OPP: 'opportunity',
  PMP: 'position_map',
  WSP: 'white_space',
  ACT: 'actor',
  NED: 'need',
  OFF: 'offering',
  CTX: 'context',
  AUD: 'audience',
  PER: 'persona',
  JOB: 'job',
  VAL: 'value_proposition',
  POS: 'positioning',
  BMD: 'business_model',
  BRD: 'brand',
  BSC: 'brand_script',
  ARC: 'archetype',
  TON: 'tone',
  VRB: 'verbal_guideline',
  AST: 'asset',
  PBP: 'personal_brand_profile',
  JSG: 'journey_stage',
  ACN: 'action',
  OUT: 'outcome',
  PRF: 'proof_point',
  MHS: 'message_house',
  MPL: 'message_pillar',
  MSG: 'message',
  CHN: 'channel',
  CMP: 'campaign',
  PRG: 'program',
  CNT: 'content_asset',
  CPL: 'content_pillar',
  EVD: 'evidence',
  MET: 'metric',
  KPI: 'kpi',
  TST: 'experiment',
  DEC: 'decision',
  RSK: 'risk',
  MIG: 'migration',
  PRI: 'priority_stream',
  RMP: 'roadmap_phase',
};

export const TYPE_TO_PLANE: Record<string, string> = {
  market: 'market',
  market_force: 'market',
  competitor: 'market',
  ecosystem_player: 'market',
  opportunity: 'market',
  position_map: 'market',
  white_space: 'market',
  actor: 'strategy',
  need: 'strategy',
  offering: 'strategy',
  context: 'strategy',
  audience: 'strategy',
  persona: 'strategy',
  job: 'strategy',
  value_proposition: 'strategy',
  positioning: 'strategy',
  business_model: 'strategy',
  brand: 'strategy',
  brand_script: 'strategy',
  archetype: 'strategy',
  tone: 'strategy',
  verbal_guideline: 'strategy',
  asset: 'strategy',
  personal_brand_profile: 'strategy',
  journey_stage: 'strategy',
  action: 'strategy',
  outcome: 'strategy',
  proof_point: 'strategy',
  message_house: 'strategy',
  message_pillar: 'strategy',
  message: 'strategy',
  priority_stream: 'strategy',
  roadmap_phase: 'strategy',
  channel: 'activation',
  campaign: 'activation',
  program: 'activation',
  content_asset: 'activation',
  content_pillar: 'activation',
  evidence: 'governance',
  metric: 'governance',
  kpi: 'governance',
  experiment: 'governance',
  decision: 'governance',
  risk: 'governance',
  migration: 'governance',
};

const ID_RE = /^([a-z][a-z0-9-]*\.)?([A-Z]{1,4})\d{3,}$/;

export function getPrefix(id: string): string | null {
  if (!ID_RE.test(id)) return null;
  const bare = id.includes('.') ? id.split('.').at(-1)! : id;
  const match = bare.match(/^([A-Z]{1,4})\d/);
  return match ? match[1] : null;
}

export function resolveEntityType(id: string): string | null {
  const prefix = getPrefix(id);
  return prefix ? PREFIX_TO_TYPE[prefix] ?? null : null;
}

export function isEntityId(value: unknown): value is string {
  return typeof value === 'string' && ID_RE.test(value);
}
