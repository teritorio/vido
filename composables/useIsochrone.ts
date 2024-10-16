import { siteStore as useSiteStore } from '~/stores/site'

export const profiles = {
  car: 'driving-car',
  cycle: 'cycling-regular',
  foot: 'foot-walking',
  wheelchair: 'wheelchair',
}

type ProfileKeys = keyof typeof profiles
export type Profile = (typeof profiles)[ProfileKeys]

export default function useIsochrone() {
  // Get feature flag for Vido config
  const { settings } = useSiteStore()
  const enabled = settings?.themes[0].isochroneEnabled || true

  //
  // Data
  //
  const isOverlayOpen = ref(false)

  //
  // Methods
  //
  async function calculate(feature: GeoJSON.Feature, profile: Profile, range: number[] = [300, 200]) {
    const { coordinates } = feature.geometry as GeoJSON.Point
    const uniqueID = `isochrone-${profile}-${feature.properties?.metadata.id}`

    const { data, error } = await useAsyncData<GeoJSON.FeatureCollection>(
      uniqueID,
      () => $fetch(`https://api.openrouteservice.org/v2/isochrones/${profile}`, {
        method: 'POST',
        headers: {
          'Accept': 'application/json, application/geo+json, application/gpx+xml, img/png; charset=utf-8',
          'Authorization': '5b3ce3597851110001cf6248e176e3d24c3d4a71bff8701252700040',
          'Content-Type': 'application/json',
        },
        body: {
          locations: [coordinates],
          range,
        },
      }),
    )

    if (error.value)
      throw error.value

    return data.value
  }

  function toggleOverlay() {
    isOverlayOpen.value = !isOverlayOpen.value
  }

  return {
    calculate,
    enabled,
    isOverlayOpen,
    toggleOverlay,
    profiles,
  }
}
