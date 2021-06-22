/**
 * Updates a certain key=val in hash in URL
 */
export function setHashPart(key: string, val: string | null) {
  const params = new URLSearchParams(location.hash.substring(1))

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

  // Replace is for keeping map param working with mapboxgl
  const newHash = '#' + params.toString().replace(/%2F/g, '/')

  if (newHash !== location.hash) {
    if (history.pushState) {
      history.pushState(null, '', newHash)
    } else {
      location.hash = newHash
    }
  }
}

/**
 * Get value from URL hash key
 */
export function getHashPart(key: string): string | null {
  const params = new URLSearchParams(location.hash.substring(1))
  return params.get(key)
}
