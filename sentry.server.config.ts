import * as Sentry from '@sentry/nuxt'
import { H3Error } from 'h3'

Sentry.init({
  dsn: useRuntimeConfig().public.sentryDsn,
  environment: useRuntimeConfig().public.sentryEnvironment,
  tracesSampleRate: 0.05,
  beforeSend(event, hint) {
    const error = hint.originalException

    // Filter out common HTTP errors
    if (error instanceof H3Error && [404, 422, 406, 400].includes(error.statusCode)) {
      return null
    }

    return event
  },
})
