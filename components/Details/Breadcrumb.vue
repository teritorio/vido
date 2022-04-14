<template>
  <div id="breadcrumb">
    <ul>
      <li v-for="(entry, i) in entries" :key="i">
        <a v-if="entry.href" :style="`color: ${color}`" :href="entry.href">
          {{ entry.text }}
        </a>
        <span v-else :style="`color: ${color}`">{{ entry.text }}</span>
      </li>
    </ul>
  </div>
</template>

<script lang="ts">
import Vue, { PropType } from 'vue'

export default Vue.extend({
  props: {
    entries: {
      type: Array as PropType<Array<{ text: string; href?: string }>>,
      default: () => [],
    },
    color: {
      type: String,
      default: '#ff0000',
    },
  },
})
</script>

<style lang="scss" scoped>
@import '@/assets/details.scss';

#breadcrumb {
  @media #{$small-only} {
    display: none;
  }

  margin-bottom: 10px;
  // padding: 8px 9px;

  ul {
    text-align: center;
    padding: 0.75rem 1.25rem;

    li {
      display: inline-block;

      a,
      span {
        display: inline-block;
        font-size: 1rem;
        font-weight: inherit;
        text-decoration: none;
      }

      &:nth-of-type(1) {
        a,
        span {
          text-transform: uppercase;
        }
      }

      a:hover {
        text-decoration: underline;
      }
    }

    li:not(:last-child)::after {
      content: ' ';
      display: inline-block;
      height: 1rem;
      width: 1rem;
      margin: 0 0.4rem;
      background-image: url('data:image/svg+xml;base64,PD94bWwgdmVyc2lvbj0iMS4wIiBlbmNvZGluZz0idXRmLTgiPz4NCjwhLS0gR2VuZXJhdG9yOiBBZG9iZSBJbGx1c3RyYXRvciAyNC4xLjIsIFNWRyBFeHBvcnQgUGx1Zy1JbiAuIFNWRyBWZXJzaW9uOiA2LjAwIEJ1aWxkIDApICAtLT4NCjxzdmcgdmVyc2lvbj0iMS4xIiBpZD0iQ2FscXVlXzEiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyIgeG1sbnM6eGxpbms9Imh0dHA6Ly93d3cudzMub3JnLzE5OTkveGxpbmsiIHg9IjBweCIgeT0iMHB4Ig0KCSB2aWV3Qm94PSIwIDAgMTIgMTIiIHN0eWxlPSJlbmFibGUtYmFja2dyb3VuZDpuZXcgMCAwIDEyIDEyOyIgeG1sOnNwYWNlPSJwcmVzZXJ2ZSI+DQo8c3R5bGUgdHlwZT0idGV4dC9jc3MiPg0KCS5zdDB7ZmlsbDojMTUzMjNBO30NCjwvc3R5bGU+DQo8cG9seWdvbiBjbGFzcz0ic3QwIiBwb2ludHM9IjUuNywwLjQgNC4zLDEuOCA4LjUsNiA0LjMsMTAuMyA1LjcsMTEuNyAxMS40LDYgIi8+DQo8L3N2Zz4NCg==');
      background-size: 0.8rem auto;
      background-repeat: no-repeat;
      background-position: 50% 0.27rem;
    }
  }
}
</style>
