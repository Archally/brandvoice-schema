export const PLANE_SUBDIRS = ["market", "strategy", "activation", "governance"];

export const FILE_NAME_TO_SCHEMA = {
  "brandvoice.yaml": "brandvoice.schema.yaml",
  "market/landscape.yaml": "market/landscape.schema.yaml",
  "market/competition.yaml": "market/competition.schema.yaml",
  "market/opportunities.yaml": "market/opportunities.schema.yaml",
  "market/ecosystem.yaml": "market/ecosystem.schema.yaml",
  "strategy/brand-core.yaml": "strategy/brand-core.schema.yaml",
  "strategy/market-product.yaml": "strategy/market-product.schema.yaml",
  "strategy/messaging.yaml": "strategy/messaging.schema.yaml",
  "strategy/visual-identity.yaml": "strategy/visual-identity.schema.yaml",
  "strategy/capacity-priorities.yaml": "strategy/capacity.schema.yaml",
  "activation/channels.yaml": "activation/channels.schema.yaml",
  "activation/campaigns.yaml": "activation/campaigns.schema.yaml",
  "governance/evidence.yaml": "governance/evidence.schema.yaml",
  "governance/measurement.yaml": "governance/measurement.schema.yaml",
  "governance/decisions.yaml": "governance/decisions.schema.yaml",
  "governance/experiments.yaml": "governance/experiments.schema.yaml",
  "migrations.yaml": "migration.schema.yaml",
};

const PLANE_STEM_TO_SCHEMA = {
  market: {
    landscape: "market/landscape.schema.yaml",
    markets: "market/landscape.schema.yaml",
    forces: "market/landscape.schema.yaml",
    competition: "market/competition.schema.yaml",
    opportunities: "market/opportunities.schema.yaml",
    ecosystem: "market/ecosystem.schema.yaml",
  },
  strategy: {
    "brand-core": "strategy/brand-core.schema.yaml",
    "market-product": "strategy/market-product.schema.yaml",
    messaging: "strategy/messaging.schema.yaml",
    "visual-identity": "strategy/visual-identity.schema.yaml",
    "capacity-priorities": "strategy/capacity.schema.yaml",
    capacity: "strategy/capacity.schema.yaml",
  },
  activation: {
    channels: "activation/channels.schema.yaml",
    campaigns: "activation/campaigns.schema.yaml",
  },
  governance: {
    evidence: "governance/evidence.schema.yaml",
    measurement: "governance/measurement.schema.yaml",
    decisions: "governance/decisions.schema.yaml",
    experiments: "governance/experiments.schema.yaml",
  },
};

const PLANE_FILE_PATTERN = /^([^/]+)\/([^/]+)\.ya?ml$/u;

export function planeOfPath(relativePath) {
  const normalized = relativePath.replace(/\\/g, "/");
  const firstSegment = normalized.split("/")[0];
  if (PLANE_SUBDIRS.includes(firstSegment)) {
    return firstSegment;
  }
  return null;
}

export function resolveDataFileSchemaPath(relativePath) {
  const normalized = relativePath.replace(/\\/g, "/");
  const directMatch = FILE_NAME_TO_SCHEMA[normalized];
  if (directMatch) {
    return directMatch;
  }

  const planeMatch = PLANE_FILE_PATTERN.exec(normalized);
  if (!planeMatch) {
    return null;
  }

  const planeName = planeMatch[1];
  const planeStems = PLANE_STEM_TO_SCHEMA[planeName];
  if (!planeStems) {
    return null;
  }

  const segments = planeMatch[2].split(".");
  const lastSegment = segments[segments.length - 1];
  if (segments.length > 1) {
    if (lastSegment === planeName) {
      segments.pop();
    }
  }

  const schemaStem = segments[segments.length - 1];
  if (!schemaStem) {
    return null;
  }

  const resolvedSchema = planeStems[schemaStem];
  if (resolvedSchema) {
    return resolvedSchema;
  }
  return null;
}
