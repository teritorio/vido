export default function useMapSync(map: Ref<maplibregl.Map | undefined>) {
  const route = useRoute()
  const router = useRouter()

  // Function to update URL when the map moves
  const updateUrlFromMap = () => {
    if (!map.value)
      return

    const center = map.value.getCenter()
    const zoom = map.value.getZoom()
    const newHash = `#map=${zoom.toFixed(2)}/${center.lat.toFixed(5)}/${center.lng.toFixed(5)}`

    if (route.hash !== newHash) {
      router.replace({
        path: route.path,
        hash: newHash,
      })
    }
  }

  // Function to update the map when URL changes
  const updateMapFromUrl = () => {
    if (!map.value || !route.hash)
      return

    const hashMatch = route.hash.match(/#([\d.]+)\/(-?[\d.]+)\/(-?[\d.]+)/)
    if (hashMatch) {
      const [, zoom, lat, lng] = hashMatch.map(Number)

      // Update MapLibre map position
      map.value.setZoom(zoom)
      map.value.setCenter([lng, lat]) // MapLibre requires [lng, lat]
    }
  }

  // Watch Vue Router hash changes → Update MapLibre
  watch(() => route.hash, updateMapFromUrl)

  map.value?.on('moveend', updateUrlFromMap)
}
