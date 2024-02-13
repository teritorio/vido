import { siteStore } from '~/stores/site'

export default defineNuxtRouteMiddleware((to, _from) => {
  if (process.server)
    return

  if (process.client) {
    if (to.query.contrib)
      siteStore().contribMode = !!to.query.contrib
  }
})
