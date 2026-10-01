export default defineNuxtPlugin(() => {
  const lisioKey = useRuntimeConfig().public.lisioKey
  if (!lisioKey || !/^\d+$/.test(String(lisioKey)))
    return

  useHead({
    script: [
      { innerHTML: `var accesskey="${lisioKey}";` },
      { src: 'https://www.numanis.net/accessedition.js' },
    ],
  })
})
