import type { ApiPoiProperties } from '~/lib/apiPois'

export default function () {
  const { $propertyTranslations } = useNuxtApp()
  const { t } = useI18n()

  const getActivity = (properties: ApiPoiProperties, context: string): { key: string, translatedValue: string } | undefined => {
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

  const getDifficulty = (activity: string, difficulty: string, context: string): string | undefined => {
    return !difficulty
      ? undefined
      : $propertyTranslations.pv(`route:${activity}:difficulty`, difficulty, context)
  }

  const getDuration = (duration: number): string | undefined => {
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

  const getLength = (length: number): string | undefined => {
    return !length
      ? undefined
      : t('units.km', { length })
  }

  const toString = (properties: ApiPoiProperties, context: string): string => {
    let routeData = []
    const activity = getActivity(properties, context)

    if (!activity)
      return ''

    const difficulty = getDifficulty(activity.key, properties[`route:${activity.key}:difficulty`], context)
    const duration = getDuration(properties[`route:${activity.key}:duration`])
    const length = getLength(properties[`route:${activity.key}:length`])

    routeData = [
      activity.translatedValue,
      difficulty,
      duration,
      length,
    ]

    return routeData.join(' ')
  }

  return {
    getActivity,
    getDifficulty,
    getDuration,
    getLength,
    toString,
  }
}
