import * as Sentry from '@sentry/nuxt'
import { H3Error } from 'h3'

Sentry.init({
  dsn: process.env.NUXT_PUBLIC_SENTRY_DSN,
  environment: process.env.NUXT_PUBLIC_SENTRY_ENVIRONMENT,
  tracesSampleRate: 0.05,
  enableLogs: true,
  beforeSend(event, hint) {
    const error = hint.originalException

    // Filter out common HTTP errors
    if (error instanceof H3Error && [404, 422, 406, 400].includes(error.statusCode)) {
      return null
    }

    return event
  },
})
