import * as Sentry from '@sentry/node'
import { H3Error } from 'h3'

export default defineNitroPlugin((nitroApp) => {
  const { sentryDsn, sentryEnvironment } = useRuntimeConfig().public

  // If no sentry DSN set, ignore and warn in the console
  if (!sentryDsn) {
    console.warn('Sentry DSN not set, skipping Sentry initialization')
    return
  }

  // Initialize Sentry
  Sentry.init({
    dsn: sentryDsn,
    environment: sentryEnvironment,
    integrations: [],
    // Performance Monitoring
    tracesSampleRate: 1.0, // Change in production!
    // Set sampling rate for profiling - this is relative to tracesSampleRate
    profilesSampleRate: 1.0, // Change in production!
  })

  nitroApp.hooks.hook('error', (error) => {
    // Do not handle 404s and 422s
    if (error instanceof H3Error) {
      if ([404, 422, 406, 400].includes(error.statusCode)) {
        return
      }
    }

    Sentry.captureException(error)
  })

  nitroApp.hooks.hook('request', (event) => {
    event.context.$sentry = Sentry
  })

  nitroApp.hooks.hookOnce('close', async () => {
    await Sentry.close(2000)
  })
})
