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
    <span v-if="attributions?.length" class="attributions">
      <span v-for="attribution in attributions" :key="attribution" v-html="attribution" />
    </span>
    <span class="poweredBy">
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
  display: flex;
  justify-content: center;
  align-items: center;
  flex-wrap: wrap;
  gap: 0.5rem;
  font-size: 0.9rem;
  line-height: 0.8;
  padding: 4rem 0 1rem;
  background: white;
  color: $color-primary;
  text-decoration: none;

  > :is(a, span) {
    display: inline-flex;
    align-items: center;
  }

  > :is(a, span) + :is(a, span)::before {
    content: '·';
    margin-right: 0.5rem;
    font-size: 2rem;
    color: $color-tertiary;
  }

  .attributions {
    display: inline-flex;
    gap: 0.4rem;
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
