<template>
  <footer class="footer">
    <span>
      <a
        href="https://www.sirtaqui-aquitaine.com/les-donnees-du-sirtaqui/"
        target="_blank"
      >
        &copy; Sirtaqui
      </a>
    </span>
    <span>
      <a href="https://www.openstreetmap.org/copyright" target="_blank">
        &copy; OpenStreetMap contributors
      </a>
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
  </footer>
</template>

<script lang="ts">
import Vue from 'vue'

export default Vue.extend({})
</script>

<style lang="scss" scoped>
@import '@/assets/details.scss';

.footer {
  position: relative;
  font-family: $font-ubuntu-medium;
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

  @media (max-width: 991px) {
    .site-footer__bottom .copyright {
      width: 100%;
      margin-top: 0;
      text-align: center;
    }
  }
}
</style>
