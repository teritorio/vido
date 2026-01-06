import type { Poi } from '~/types/local/poi'
import { STORE_NAME, useContribStore } from '~/stores/contrib'

export interface Link {
  icon: string
  url: string
  target?: string
}

export interface ContribFields {
  editor_id: Link
  json: Link
  josm: Link
  mapillary_link?: Link
  osm_note: Link
}

export default function () {
  const { enabled, setEnabled } = useContribStore()

  function isContribEligible(properties: Poi['properties']): boolean {
    return !!(properties.metadata.osm_id && properties.metadata.osm_type && properties.editorial)
  }

  function getContributorFields(feature: Poi): ContribFields {
    const { mapillary } = feature.properties
    const { osm_id, osm_type, id } = feature.properties.metadata
    const { coordinates } = feature.geometry as GeoJSON.Point
    const apiEndpoint = useState<string>('api-endpoint')

    return {
      editor_id: {
        icon: 'pen-to-square',
        url: `https://www.openstreetmap.org/edit?editor=id&${osm_type}=${osm_id}`,
      },
      json: {
        icon: 'map-marker-alt',
        url: `${apiEndpoint.value}/poi/${id}/deps.geojson?geometry_as=bbox&short_description=false`,
      },
      josm: {
        icon: 'pen-to-square',
        url: `http://127.0.0.1:8111/load_object?objects=${osm_type?.substring(0, 1)}${osm_id}`,
        target: 'hiddenIframe',
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
