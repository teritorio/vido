import type { ApiPoi, ApiPoiProperties } from '~/lib/apiPois'
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

export default function () {
  const { enabled, setEnabled } = useContribStore()

  function isContribEligible(properties: ApiPoiProperties): boolean {
    return !!(properties.metadata.osm_id && properties.metadata.osm_type && properties.editorial)
  }

  function getContributorFields(feature: ApiPoi): ContribFields {
    const { mapillary } = feature.properties
    const { osm_id, osm_type } = feature.properties.metadata
    const { coordinates } = feature.geometry as GeoJSON.Point

    return {
      editor_id: {
        icon: 'pen-to-square',
        url: `https://www.openstreetmap.org/edit?editor=id&${osm_type}=${osm_id}`,
      },
      mapillary_link: mapillary
        ? {
            icon: 'external-link-alt',
            url: `https://www.mapillary.com/app/?pKey=${mapillary}&focus=photo`,
          }
        : undefined,
      osm_note: {
        icon: 'note-sticky',
        url: `https://www.openstreetmap.org/note/new#map=19/${coordinates[1]}/${coordinates[0]}&layers=N`,
      },
    }
  }

  return {
    STORE_NAME,
    contribMode: enabled,
    setEnabled,
    getContributorFields,
    isContribEligible,
  }
}
