export const regexForCategoryIds = /^(?:(?<cartocode>cartocode:\w{2})|(?<reference>ref:[\w-]+:\w+)|(?<osm>osm:[nwr]\d+)|\d+(_[a-zA-Z0-9]+)*(?:,\d+)*)$/
export const regexForPOIIds = /^(?:cartocode:\w{2}|ref:[\w-]+:\w+|osm:[nwr]\d+|\d+(_[a-zA-Z0-9]+)*)$/

export function useIdsResolver() {

}
