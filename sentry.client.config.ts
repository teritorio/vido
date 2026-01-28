import * as Sentry from '@sentry/nuxt'

Sentry.init({
  dsn: useRuntimeConfig().public.sentryDsn,
  environment: useRuntimeConfig().public.sentryEnvironment,
  integrations: [
    Sentry.browserTracingIntegration(),
    Sentry.replayIntegration({
      maskAllText: false,
      blockAllMedia: false,
    }),
  ],
  tracesSampleRate: 0.05,
  replaysSessionSampleRate: 0.05,
  replaysOnErrorSampleRate: 1.0,
})
