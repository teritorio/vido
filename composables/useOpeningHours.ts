export const PointTime = [/^collection_times$/, /^service_times$/]

// List of tag keys regex copied from opening_hours.js
const SupportedOsmKeys = [
  ...PointTime,
  /^opening_hours$/,
  /^opening_hours:.+/,
  /.+:opening_hours$/,
  /.+:opening_hours:.+/,
  /^smoking_hours$/,
  /^happy_hours$/,
  /^lit$/,
]

export function isSupportedOsmTags(keys: RegExp[], key: string): boolean {
  return keys.some(regexKey => regexKey.test(key))
}

export function isOpeningHoursSupportedOsmTags(key: string): boolean {
  return isSupportedOsmTags(SupportedOsmKeys, key)
}
