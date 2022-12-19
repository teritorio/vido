import shareMutations from 'vuex-shared-mutations'

import { Mutation } from '~/store/favorite'

export default ({ store }) => {
  window.onNuxtReady((nuxt) => {
    shareMutations({
      predicate: ['favorite/' + Mutation.SET_FAVORITES],
    })(store)
  })
}
