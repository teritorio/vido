import type { ApiPoiProperties } from '~/lib/apiPois'
import type { PropertyTranslationsContextEnum } from '~/plugins/property-translations'

interface Route {
  duration?: number
  length?: number
  difficulty?: string
}

export const ADDRESS_FIELDS = [
  'addr:housenumber',
  'addr:street',
  'addr:postcode',
  'addr:city',
]

export default function () {
  const { $propertyTranslations } = useNuxtApp()
  const { t } = useI18n()

  // Address Field
  const addressToString = (properties: ApiPoiProperties): string => {
    return ADDRESS_FIELDS
      .map(field => properties[field])
      .map(f => (f || '').toString().trim())
      .filter(f => f)
      .join(' ')
  }

  // Routes Field
  const getRoutes = (properties: ApiPoiProperties): { [key: string]: Route } => {
    const routes: { [key: string]: { [key: string]: string } } = {}

    Object.entries(properties)
      .map(([key, value]) => [key.split(':'), value])
      .filter(([keys, _value]) => keys[0] === 'route' && keys.length === 3)
      .forEach(([[_, activity, property], value]) => {
        if (routes[activity]) {
          routes[activity][property] = value
        }
        else {
          routes[activity] = {}
          routes[activity][property] = value
        }
      })

    return routes
  }

  const getRouteActivity = (properties: ApiPoiProperties, context: PropertyTranslationsContextEnum): { key: string, translatedValue: string } | undefined => {
    const activity = Object.entries(properties)
      .find(([key, _value]) => {
        if (!key.includes(':'))
          return false

        const keys = key.split(':')

        if (keys[0] !== 'route' && keys.length < 3)
          return false

        return true
      })

    const activityKey = !activity ? false : activity[0].split(':')[1]

    return !activityKey
      ? undefined
      : { key: activityKey, translatedValue: $propertyTranslations.pv('route', `${activityKey}`, context) }
  }

  const getRouteDifficulty = (activity: string, difficulty: string, context: PropertyTranslationsContextEnum): string | undefined => {
    return !difficulty
      ? undefined
      : $propertyTranslations.pv(`route:${activity}:difficulty`, difficulty, context)
  }

  const getRouteDuration = (duration: number): string | undefined => {
    if (!duration)
      return undefined

    let string = ''
    const hours = Math.floor(duration / 60)
    const minutes = duration % 60

    if (hours > 0)
      string += t('units.hours', { hours })

    if (minutes > 0)
      string += `${hours > 0 ? ' ' : ''}${t('units.min', { minutes })}`

    return string
  }

  const getRouteLength = (length: number): string | undefined => {
    return !length
      ? undefined
      : t('units.km', { length })
  }

  const getRouteNoDetails = (activity: string, route: Route, context: PropertyTranslationsContextEnum): string => {
    return [getRouteDuration(route.duration!), getRouteDifficulty(activity, route.difficulty!, context)]
      .filter(x => x)
      .join(', ')
  }

  const routeToString = (properties: ApiPoiProperties, context: PropertyTranslationsContextEnum): string => {
    let routeData = []
    const activity = getRouteActivity(properties, context)

    if (!activity)
      return ''

    const difficulty = getRouteDifficulty(activity.key, properties[`route:${activity.key}:difficulty`], context)
    const duration = getRouteDuration(properties[`route:${activity.key}:duration`])
    const length = getRouteLength(properties[`route:${activity.key}:length`])

    routeData = [
      activity.translatedValue,
      difficulty,
      duration,
      length,
    ]

    return routeData.join(' ')
  }

  return {
    addressToString,
    getRouteActivity,
    getRouteDifficulty,
    getRouteDuration,
    getRouteLength,
    getRouteNoDetails,
    getRoutes,
    routeToString,
  }
}
