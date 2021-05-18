<template>
  <div
    class="flex max-w-xl mx-auto overflow-hidden bg-white shadow-md rounded-xl pointer-events-auto"
  >
    <img
      v-if="poiProp('teritorio:image')"
      class="object-cover w-48"
      :src="poiProp('teritorio:image')"
      alt=""
    />

    <div class="p-8">
      <div class="flex justify-between">
        <div
          class="flex text-sm font-semibold tracking-wide text-blue-500 uppercase"
        >
          <component :is="getPicto(poiMeta('icon'))" class="w-5 h-5 mr-1" />
          {{ poiMeta('label_infobulle') }}
        </div>

        <!--OpenMention /-->
      </div>

      <p class="block mt-2 text-lg font-medium leading-tight text-black">
        <a v-if="hasFiche" :href="poiProp('teritorio:url')" target="_blank">
          {{ poi.properties.name }}
        </a>
        <template v-else>
          {{ poi.properties.name }}
        </template>
      </p>

      <p v-if="poiMeta('PopupAdress') === 'yes'" class="text-gray-500">
        {{
          [
            poiProp('addr:street'),
            poiProp('addr:postcode'),
            poiProp('addr:city'),
          ]
            .filter((p) => p)
            .join(' ')
        }}
      </p>

      <template v-if="listFields">
        <p v-for="field in listFields" :key="field">
          {{ field }}
        </p>
      </template>

      <p v-if="hasFiche" class="text-right mt-2">
        <a :href="poiProp('teritorio:url')" target="_blank">
          <font-awesome-icon icon="info" />
          Détail
        </a>
      </p>
    </div>
  </div>
</template>

<script lang="ts">
import Vue from 'vue'

import OpenMention from '@/components/OpenMention.vue'
import { getPicto } from '@/utils/picto'

export default Vue.extend({
  components: {
    OpenMention,
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

    listFields() {
      if (!this.sptags) {
        return null
      }
      return this.poiMeta('PopupListField')
        .split(';')
        .filter(
          (f) =>
            this.sptags[f] && this.poiProp(f) && this.sptags[f][this.poiProp(f)]
        )
        .map((f) => this.sptags[f][this.poiProp(f)])
    },
  },

  created() {
    this.fetchSpTags()
  },

  methods: {
    getPicto: (pictoName: string) => getPicto(pictoName),

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
  },
})
</script>
