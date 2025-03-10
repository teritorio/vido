export const regexForCategoryIds = /^(?:(?<cartocode>cartocode:\w{2})|(?<reference>ref:[\w-]+:\w+)|(?<osm>osm:[nwr]\d+)|\d+(?:,\d+)*|(?<address>\d+_\d+))$/
export const regexForPOIIds = /^(?:cartocode:\w{2}|ref:[\w-]+:\w+|osm:[nwr]\d+|\d+)$/

export function useIdsResolver() {

}
