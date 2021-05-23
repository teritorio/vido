<template>
  <div
    class="flex max-w-xl mx-auto overflow-hidden bg-white shadow-md pointer-events-auto rounded-xl"
    @click="() => $emit('click')"
  >
    <img
      v-if="poiProp('teritorio:image')"
      class="object-cover w-52"
      :src="poiProp('teritorio:image')"
      alt=""
    />

    <div class="p-8">
      <p
        class="block text-xl font-semibold leading-tight cursor-pointer"
        :style="'color:' + poiMeta('color')"
      >
        {{ poi.properties.name || poiMeta('label_infobulle') }}
      </p>

      <div class="flex items-center text-sm text-gray-500 cursor-pointer">
        <TeritorioIcon
          :category-color="poiMeta('color')"
          class="mr-2"
          :picto="poiMeta('icon')"
          :use-category-color="true"
          :use-native-alignment="true"
        />

        {{ poiMeta('label_infobulle') }}
      </div>

      <p class="mt-2">
        <template v-if="address">
          {{ address }}
          <br />
        </template>

        <span v-for="field in listFields" :key="encodeURIComponent(field)">
          {{ field }} <br />
        </span>
      </p>

      <div class="flex items-center justify-between mt-3">
        <font-awesome-icon :icon="['far', 'star']" :color="poiMeta('color')" />
        <template v-if="hasFiche">
          <a :href="poiProp('teritorio:url')" target="_blank" @click.stop>
            <font-awesome-icon
              icon="external-link-alt"
              :color="poiMeta('color')"
            />
            Détail
          </a>
        </template>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import Vue from 'vue'

import TeritorioIcon from '@/components/TeritorioIcon/TeritorioIcon.vue'

export default Vue.extend({
  components: {
    TeritorioIcon,
  },

  props: {
    poi: {
      type: Object,
      required: true,
    },
  },

  data() {
    return {
      sptags: null,
    }
  },

  computed: {
    hasFiche() {
      return this.poiMeta('hasfiche') === 'yes'
    },

    address() {
      if (this.poiMeta('PopupAdress') !== 'yes') {
        return null
      }

      return [
        this.poiProp('addr:street') &&
          this.titleCase(this.poiProp('addr:street')),
        this.poiProp('addr:postcode'),
        this.poiProp('addr:city') && this.poiProp('addr:city').toUpperCase(),
      ]
        .filter((f) => f && f.trim().length > 0)
        .join(' ')
    },

    listFields() {
      if (!this.sptags) {
        return []
      }
      return this.poiMeta('PopupListField')
        .split(';')
        .map((f) => {
          if (this.sptags[f] && this.sptags[f][this.poiProp(f)]) {
            return this.sptags[f][this.poiProp(f)]
          } else if (
            this.sptags[f] &&
            this.poiProp(f) &&
            this.poiProp(f).includes(';')
          ) {
            return this.poiProp(f)
              .split(';')
              .map((p) => this.sptags[f][p])
              .filter((f) => f && f.trim().length > 0)
              .join(', ')
          } else {
            return this.poiProp(f)
          }
        })
        .filter((f) => f && f.trim().length > 0)
    },
  },

  watch: {
    poi() {
      this.sptags = null
      this.fetchSpTags()
    },
  },

  created() {
    this.fetchSpTags()
  },

  methods: {
    poiProp(name: String) {
      return this.poi.properties[name]
    },

    poiMeta(name: String) {
      return this.poiProp('metadata')[name]
    },

    fetchSpTags() {
      fetch(
        `${
          this.$config.API_ENDPOINT
        }/geodata/v1/sptags?PopupListField=${this.poiMeta('PopupListField')}`
      )
        .then((data) => data.json())
        .then((data) => (this.sptags = data))
    },

    titleCase(str) {
      const ignoredWords = ['la', 'le', 'les', 'du', 'des', 'de', 'à', 'aux']
      return str
        .toLowerCase()
        .split(' ')
        .filter((word) => word.length > 0)
        .map(function (word) {
          return ignoredWords.includes(word.toLowerCase())
            ? word
            : word.replace(word[0], word[0].toUpperCase())
        })
        .join(' ')
    },
  },
})
</script>
