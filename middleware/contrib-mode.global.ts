export default defineNuxtRouteMiddleware((to) => {
  const { setEnabled, STORE_NAME } = useContrib()
  const cookie = useCookie(STORE_NAME)

  if (to.query.contrib !== undefined) {
    setEnabled(to.query.contrib === 'true')
    return
  }

  setEnabled(Boolean(cookie.value))
})
