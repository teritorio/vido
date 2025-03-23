export default defineNuxtRouteMiddleware((to) => {
  const { catIds, poiId } = to.params

  if (catIds) {
    const catIdsArray = catIds.toString().split(',')

    if (catIdsArray.length > 0 && !poiId && !to.path.endsWith('/')) {
      return navigateTo(`${to.fullPath}/`, { replace: true })
    }
  }
})
