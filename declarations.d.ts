declare module '*.svg'
declare module '*.svg?data'
declare module '*.svg?inline'
declare module '*.svg?raw'

declare module 'vue-mobile-detection'
declare module 'vue-matomo'
declare module 'vue-cookie-accept-decline'
declare module 'locale-includes'

// The prettifyValue() runtime API accepts these fields wrapped in a `conf` key,
// which is not reflected in the upstream type definitions.
declare module 'opening_hours' {
  interface argument_hash {
    conf?: Partial<Omit<argument_hash, 'conf'>>
  }
}
