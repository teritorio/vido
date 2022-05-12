import VueRouter from 'vue-router'

type HashParts = { [key: string]: string | null }

export function setHashParts(hash: string, hashParts: HashParts) {
  const params = new URLSearchParams(hash.substring(1))

  // Update router map hash with current value
  const paramsMap = new URLSearchParams(location.hash.substring(1))
  hashParts.map = paramsMap.get('map')

  Object.entries(hashParts).forEach((item) => {
    const key = item[0]
    const val = item[1]

    if (
      val === null ||
      val === undefined ||
      val === '' ||
      val === 'null' ||
      val === 'undefined'
    ) {
      params.delete(key)
    } else {
      params.set(key, val)
    }
  })

  // Replace is for keeping map param working with maplibregl
  return params.toString().replace(/%2F/g, '/')
}

export function routerPushHashUpdate(router: VueRouter, hashParts: HashParts) {
  let hash = router.currentRoute.hash
  if (hashParts) {
    hash = setHashParts(hash, hashParts)
  }
  router.push({
    path: router.currentRoute.path,
    query: router.currentRoute.query,
    hash,
  })
}

/**
 * Get value from URL hash key
 */
export function getHashPart(router: VueRouter, key: string): string | null {
  const params = new URLSearchParams(router.currentRoute.hash.substring(1))
  return params.get(key)
}
