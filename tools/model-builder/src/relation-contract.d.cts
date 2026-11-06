export interface RelationEntity {
  id: string;
  entityType: string;
  data: Record<string, unknown>;
}

export interface DerivedRelation {
  id: string;
  sourceId: string;
  targetId: string;
  relationType: string;
  refField: string;
}

export interface DerivedRelations {
  relations: DerivedRelation[];
  warnings: string[];
}

export const RELATION_LOOKUP: Partial<Record<string, Record<string, string>>>;
export const NON_STANDARD_SINGULAR: Partial<Record<string, string[]>>;
export const NON_STANDARD_PLURAL: Partial<Record<string, string[]>>;
export const IMPACT_LINK_RELATION: Record<string, string>;
export function looksLikeEntityId(value: string): boolean;
export function deriveRelations(entities: RelationEntity[], resolveTarget: (reference: string) => string, warnings?: string[]): DerivedRelations;
