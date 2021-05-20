/**
 * Updates a certain key=val in hash in URL
 */
export function setHashPart(key: string, val: string) {
  const params = new URLSearchParams(location.hash.substring(1));
  if(val === null) {
    params.delete(key);
  }
  else {
    params.set(key, val);
  }

  const newHash = '#' + params.toString().replace(/%2F/g, '/'); // Replace is for keeping map param working with mapboxgl

  if(newHash !== location.hash) {
    if(history.pushState) {
      history.pushState(null, null, newHash)
    }
    else {
      location.hash = newHash;
    }
  }
}

/**
 * Get value from URL hash key
 */
export function getHashPart(key: string): string {
  const params = new URLSearchParams(location.hash.substring(1));
  return params.get(key);
}
