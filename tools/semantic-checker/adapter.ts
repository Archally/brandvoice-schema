import type {
  CheckableModel,
  CheckableEntity,
  CheckableRelation,
} from '@archally/semantic-checker';
import type { BrandvoiceModel } from '@archally/brandvoice-schema/model';

/**
 * The four brandvoice planes, declared so structural rules (e.g. `empty-planes`) can iterate them.
 * Matches the loader's `PLANE_SUBDIRS` and the legacy `empty-planes` rule's plane list.
 */
const PLANES = ['market', 'strategy', 'activation', 'governance'] as const;

/**
 * Normalize the brandvoice graph model (`buildBrandvoiceModel` output: entities + relations) into
 * the engine's `CheckableModel`.
 *
 * - brandvoice ids are already human-facing, so `displayId === id`.
 * - brandvoice has no layers or slices (root/global only).
 * - `evidence_refs` / `validated_by` / `*_ref(s)` are already lifted to typed relations
 *   (`backed-by`, `validated-by`, …) by the extractor; the relation-centric rules read those.
 * - the full raw entity stays in `data`, so field-path checks (`data.status`, `data.proof_points`)
 *   resolve exactly as the legacy rules did.
 */
export function toCheckableModel(model: BrandvoiceModel): CheckableModel {
  const entities: CheckableEntity[] = model.entities.map(entity => ({
    id: entity.id,
    displayId: entity.id,
    name: entity.name,
    type: entity.type,
    plane: entity.plane,
    slices: [],
    data: entity.data,
  }));

  const relations: CheckableRelation[] = model.relations.map(relation => ({
    id: relation.id,
    source: relation.source,
    target: relation.target,
    type: relation.type,
    predicate: relation.predicate,
  }));

  return {
    schema: 'brandvoice',
    schemaVersion: model.metadata.schemaVersion ?? undefined,
    structure: {
      planes: PLANES.map(id => ({ id })),
      layers: [],
      slices: [],
    },
    entities,
    relations,
    metadata: {
      name: model.metadata.name,
      version: model.metadata.version,
      schemaVersion: model.metadata.schemaVersion,
      builtAt: model.metadata.builtAt,
      entityTypeCounts: model.metadata.entityTypeCounts,
      planeCounts: model.metadata.planeCounts,
      relationTypeCounts: model.metadata.relationTypeCounts,
    },
  };
}
