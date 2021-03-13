import { library, config } from '@fortawesome/fontawesome-svg-core'
import { faChevronDown, faMinus } from '@fortawesome/free-solid-svg-icons'
import { FontAwesomeIcon } from '@fortawesome/vue-fontawesome'
import Vue from 'vue'

// This is important, we are going to let Nuxt.js worry about the CSS
config.autoAddCss = false

// You can add your icons directly in this plugin. See other examples for how you
// can add other styles or just individual icons.
library.add(faChevronDown, faMinus)

// Register the component globally
Vue.component('FontAwesomeIcon', FontAwesomeIcon)
