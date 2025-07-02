<script setup lang="ts">
import CookiesConsent from '~/components/UI/CookiesConsent.vue'

defineProps<{
  attributions?: string[]
}>()

const { t } = useI18n()
</script>

<template>
  <footer class="footer">
    <slot />
    <span
      v-for="attribution in attributions"
      :key="attribution"
      v-html="attribution"
    />
    <span>
      {{ t('poiDetails.poweredBy') }}
      <a target="_blank" href="https://www.teritorio.fr/" title="Teritorio">
        <img
          class="footer-logo"
          src="~/assets/logo-teritorio.png"
          alt="Teritorio"
        >
      </a>
    </span>
    <ClientOnly>
      <CookiesConsent />
    </ClientOnly>
  </footer>
</template>

<style lang="scss" scoped>
@import '~/assets/details';

.footer {
  position: relative;
  font-size: 0.9rem;
  padding-top: 4rem;
  padding-bottom: 1rem;
  background: white;
  color: $color-primary;
  text-align: center;
  text-decoration: none;

  > span {
    margin: 0 0.8rem;
  }

  a {
    color: $color-tertiary;

    &:hover,
    &:active,
    &:focus {
      color: $color-secondary;
    }
  }

  .footer-logo {
    display: inline-block;
    width: 3.4rem;
    vertical-align: baseline;
  }

  @extend %font-medium;

  @media (width <= 991px) {
    .site-footer-bottom .copyright {
      width: 100%;
      margin-top: 0;
      text-align: center;
    }
  }
}
</style>
