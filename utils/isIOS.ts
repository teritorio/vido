/**
 * Looks at the user agent and guess if the current OS is iOS.
 */
export function isIOS() {
  if (!process.client)
    return false

  // FIXME: navigator.platform is deprecated
  return (
    [
      'iPad Simulator',
      'iPhone Simulator',
      'iPod Simulator',
      'iPad',
      'iPhone',
      'iPod',
    ].includes(navigator.platform)
    // iPad on iOS 13 detection
    || (navigator.userAgent.includes('Mac') && 'ontouchend' in document)
  )
}
