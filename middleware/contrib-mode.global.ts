import type { ApiPoi, ApiPoiProperties, FieldsList, FieldsListItem } from '~/lib/apiPois'
import { EditorialGroupType } from '~/utils/types'
import { STORE_NAME, useContribStore } from '~/stores/contrib'

export interface Link {
  icon: string
  url: string
}

export interface ContribFields {
  editor_id: Link
  mapillary_link?: Link
  osm_note: Link
}

interface ContribEditorial {
  details_fields: FieldsList
  list_fields: FieldsListItem[]
  popup_fields: FieldsListItem[]
}

export default defineNuxtRouteMiddleware((to) => {
  if (process.server)
    return

  if (process.client) {
    const contribLocalStorage = localStorage.getItem(STORE_NAME)

    if (to.query.contrib !== undefined) {
      useContribStore().setEnabled(to.query.contrib === 'true')
      return
    }

    if (contribLocalStorage)
      useContribStore().setEnabled(contribLocalStorage === 'true')
  }
})

function getEditorialGroup(editorial: ContribEditorial, mode: EditorialGroupType) {
  switch (mode) {
    case EditorialGroupType.List:
      editorial.list_fields.push({ field: 'contrib' })
      break
    case EditorialGroupType.Popup:
      editorial.popup_fields.push({ field: 'contrib' })
      break
    case EditorialGroupType.Details:
      editorial.details_fields.push({
        group: 'group_contrib',
        display_mode: 'standard',
        fields: [{ field: 'contrib' }],
      })
      break
    default:
      break
  }
}

function getContributorFields(nodeId: number, coordinates: GeoJSON.Position, mapillaryId?: number): ContribFields {
  return {
    editor_id: {
      icon: 'pen-to-square',
      url: `https://www.openstreetmap.org/edit?node:${nodeId}`,
    },
    mapillary_link: mapillaryId
      ? {
          icon: 'external-link-alt',
          url: `https://www.mapillary.com/app/?pKey=${mapillaryId}&focus=photo`,
        }
      : undefined,
    osm_note: {
      icon: 'note-sticky',
      url: `https://www.openstreetmap.org/note/new#map=19/${coordinates[1]}/${coordinates[0]}&layers=N`,
    },
  }
}

export function isContribEligible(properties: ApiPoiProperties): boolean {
  return !!(properties.metadata.osm_id && properties.metadata.osm_type && properties.editorial)
}

export function addContributorFields(feature: ApiPoi, mode: EditorialGroupType) {
  const { osm_id } = feature.properties.metadata
  const { coordinates } = feature.geometry as GeoJSON.Point

  feature.properties.contrib = getContributorFields(osm_id as number, coordinates, feature.properties.mapillary)
  if (feature.properties.editorial)
    getEditorialGroup(feature.properties.editorial as ContribEditorial, mode)
}
