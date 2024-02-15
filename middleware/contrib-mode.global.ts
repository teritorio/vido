import { isArray, mergeWith } from 'lodash'
import { siteStore } from '~/stores/site'
import type { ApiPoi, ApiPoiProperties } from '~/lib/apiPois'
import { EditorialGroupType } from '~/utils/types'

export interface Link {
  icon: string
  url: string
}

export interface ContribFields {
  editor_id: Link
  mapillary_link?: Link
  osm_note: Link
}

interface ContribProperties {
  contrib: ContribFields
  editorial: ApiPoiProperties['editorial']
}

export default defineNuxtRouteMiddleware((to) => {
  siteStore().contribMode = to.query.contrib === 'true'
})

function getEditorialGroup(mode: EditorialGroupType): ApiPoiProperties['editorial'] {
  switch (mode) {
    case EditorialGroupType.List:
      return { list_fields: [{ field: 'contrib' }] }
    case EditorialGroupType.Popup:
      return { popup_fields: [{ field: 'contrib' }] }
    default:
      return undefined
  }
}

function getContributorFields(
  data: { nodeId: number, coordinates: GeoJSON.Position, mapillaryId?: number },
  mode: EditorialGroupType,
): ContribProperties {
  const properties: ContribProperties = {
    contrib: {
      editor_id: {
        icon: 'pen-to-square',
        url: `https://www.openstreetmap.org/edit?node:${data.nodeId}`,
      },
      mapillary_link: mode === EditorialGroupType.List && data.mapillaryId
        ? {
            icon: 'external-link-alt',
            url: `https://www.mapillary.com/app/?pKey=${data.mapillaryId}&focus=photo`,
          }
        : undefined,
      osm_note: {
        icon: 'note-sticky',
        url: `https://www.openstreetmap.org/note/new#map=19/${data.coordinates[1]}/${data.coordinates[0]}&layers=N`,
      },
    },
    editorial: getEditorialGroup(mode),
  }

  return properties
}

export function isContribEligible(properties: ApiPoiProperties): boolean {
  return !!(properties.metadata.osm_id && properties.metadata.osm_type && properties.editorial)
}

export function addContributorFields(feature: ApiPoi, mode: EditorialGroupType) {
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
  mergeWith(feature.properties, fields, (objValue, srcValue) => isArray(objValue) && mode === EditorialGroupType.List ? objValue.concat(srcValue) : undefined)
}
