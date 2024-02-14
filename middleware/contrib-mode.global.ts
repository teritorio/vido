import { isArray, mergeWith } from 'lodash'
import { siteStore } from '~/stores/site'
import type { ApiPoi, ApiPoiProperties } from '~/lib/apiPois'

interface ContribProperties {
  editor_id: string
  editorial: ApiPoiProperties['editorial']
  mapillary_link?: string
  osm_note: string
}

export enum FieldGroupType {
  List,
  Popup,
}

export default defineNuxtRouteMiddleware((to) => {
  siteStore().contribMode = to.query.contrib === 'true'
})

function getFieldGroup(mode: FieldGroupType): ApiPoiProperties['editorial'] {
  switch (mode) {
    case FieldGroupType.List:
      return { list_fields: [{ field: 'editor_id' }, { field: 'osm_note' }, { field: 'mapillary_link' }] }
    case FieldGroupType.Popup:
      return { popup_fields: [{ field: 'editor_id' }, { field: 'osm_note' }] }
    default:
      return undefined
  }
}

function getContributorFields(
  data: { nodeId: number, coordinates: GeoJSON.Position, mapillaryId?: number },
  mode: FieldGroupType,
): ContribProperties {
  const properties: ContribProperties = {
    editor_id: `https://www.openstreetmap.org/edit?node:${data.nodeId}`,
    editorial: getFieldGroup(mode),
    mapillary_link: data.mapillaryId ? `https://www.mapillary.com/app/?pKey=${data.mapillaryId}&focus=photo` : undefined,
    osm_note: `https://www.openstreetmap.org/note/new#map=19/${data.coordinates[1]}/${data.coordinates[0]}&layers=N`,
  }

  return properties
}

export function isContribEligible(properties: ApiPoiProperties): boolean {
  return !!(properties.metadata.osm_id && properties.metadata.osm_type && properties.editorial)
}

export function addContributorFields(feature: ApiPoi, mode: FieldGroupType) {
  const { osm_id } = feature.properties.metadata
  const { coordinates } = feature.geometry as GeoJSON.Point
  const fields = getContributorFields(
    {
      nodeId: osm_id as number,
      coordinates,
      mapillaryId: feature.properties.mapillary,
    },
    mode,
  )
  mergeWith(feature.properties, fields, (objValue, srcValue) => isArray(objValue) ? objValue.concat(srcValue) : undefined)
}
