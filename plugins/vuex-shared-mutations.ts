// @ts-ignore
import shareMutations from 'vuex-shared-mutations'

import { Mutation } from '~/store/favorite'

export default ({ store }: { store: any }) => {
  window.onNuxtReady((nuxt) => {
    shareMutations({
      predicate: ['favorite/' + Mutation.SET_FAVORITES],
    })(store)
  })
}
