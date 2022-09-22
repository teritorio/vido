<template>
  <footer class="footer">
    <span
      v-for="attribution in attributions"
      :key="attribution"
      v-html="attribution"
    >
    </span>
    <span>
      Réalisation
      <a target="_blank" href="https://www.teritorio.fr/" title="Teritorio">
        <img
          class="footer-logo"
          src="https://carte.bidarttourisme.com/content/wp-content/uploads/2020/05/logo-teritorio.png"
          alt="Teritorio"
        />
      </a>
    </span>
    <CookiesConsent />
  </footer>
</template>

<script lang="ts">
import Vue, { PropType } from 'vue'

import CookiesConsent from '~/components/UI/CookiesConsent.vue'

export default Vue.extend({
  components: {
    CookiesConsent,
  },

  props: {
    attributions: {
      type: Array as PropType<String[]>,
      default: null,
    },
  },
})
</script>

<style lang="scss" scoped>
@import '~/assets/details.scss';

.footer {
  position: relative;
  font-size: 0.9rem;
  padding-top: 4rem;
  padding-bottom: 1rem;
  background: white;
  color: $color-primary;
  text-align: center;
  text-decoration: none;

  span:nth-of-type(2) {
    margin: 0 1.6rem;
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
  @extend .font-ubuntu-medium;

  @media (max-width: 991px) {
    .site-footer__bottom .copyright {
      width: 100%;
      margin-top: 0;
      text-align: center;
    }
  }
}
</style>
