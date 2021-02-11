<template>
  <div class="contents">
    <Nuxt />
  </div>
</template>

<style>
html {
  font-family: 'Source Sans Pro', -apple-system, BlinkMacSystemFont, 'Segoe UI',
    Roboto, 'Helvetica Neue', Arial, sans-serif;
  font-size: 16px;
  word-spacing: 1px;
  -ms-text-size-adjust: 100%;
  -webkit-text-size-adjust: 100%;
  -moz-osx-font-smoothing: grayscale;
  -webkit-font-smoothing: antialiased;
  @apply h-full;
  @apply w-full;
  @apply box-border;
  @apply text-gray-900;
}

body,
#__nuxt,
#__layout {
  @apply h-full;
  @apply w-full;
}

*,
*::before,
*::after {
  @apply m-0;
  @apply box-border;
}

* svg g {
  @apply fill-current;
}
</style>
