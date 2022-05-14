export type FilterValues = {
  values: {
    [key: string]: string[]
  }
  dateRange?: {
    propertyStart?: string
    propertyEnd?: string
    value: [string, string]
  }
}
