import type { FetchError } from 'ofetch'

export function createFetchError(err: unknown, fatal = false) {
  const fetchErr = err as FetchError
  return createError({
    statusCode: fetchErr.statusCode || 500,
    statusMessage: fetchErr.statusMessage || fetchErr.message,
    data: fetchErr.data,
    cause: fetchErr,
    fatal,
  })
}
