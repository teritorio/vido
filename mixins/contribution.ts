import { mapState } from 'pinia'
import type { ApiPoi, ApiPoiProperties } from '~/lib/apiPois'
import { useContribStore } from '~/stores/contrib'
import type { ContribFields } from '~/middleware/contrib-mode.global'
import { getContributorFields, isContribEligible } from '~/middleware/contrib-mode.global'
import ContribFieldGroup from '~/components/Fields/ContribFieldGroup.vue'

export default {
  components: {
    ContribFieldGroup,
  },
  computed: {
    ...mapState(useContribStore, {
      contribMode: 'enabled',
    }),
  },
  methods: {
    isContribEligible(properties: ApiPoiProperties): boolean {
      return isContribEligible(properties)
    },
    getContributorFields(feature: ApiPoi): ContribFields {
      return getContributorFields(feature)
    },
  },
}
