export interface BrandvoiceEntity {
  id: string;
  type: string;
  plane: string;
  name: string;
  data: Record<string, unknown>;
}

export interface BrandvoiceRelation {
  id: string;
  source: string;
  target: string;
  type: string;
  predicate: string;
}

export interface BrandvoiceMetadata {
  name: string | null;
  version: string | null;
  schemaVersion: string | null;
  totalEntities: number;
  totalRelations: number;
  entityTypeCounts: Record<string, number>;
  planeCounts: Record<string, number>;
  relationTypeCounts: Record<string, number>;
  builtAt: string;
}

export interface BrandvoiceModel {
  entities: BrandvoiceEntity[];
  relations: BrandvoiceRelation[];
  metadata: BrandvoiceMetadata;
}

export interface CompositionResult {
  root: Record<string, unknown>;
  files: Record<string, string>;
  errors: string[];
  supplementaryWarnings: string[];
}
