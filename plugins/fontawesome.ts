import { config, library } from '@fortawesome/fontawesome-svg-core'
import {
  faCircle,
  faStar as farStar,
} from '@fortawesome/free-regular-svg-icons'
import {
  faArrowLeft,
  faBars,
  faCheckCircle,
  faChevronDown,
  faInfo,
  faMinus,
  faPlus,
  faSearch,
  faStar,
  faExternalLinkAlt,
  faMap,
  faEye,
  faTimes,
  faFilter,
} from '@fortawesome/free-solid-svg-icons'
import { FontAwesomeIcon } from '@fortawesome/vue-fontawesome'
import Vue from 'vue'

// This is important, we are going to let Nuxt.js worry about the CSS
config.autoAddCss = false

// You can add your icons directly in this plugin. See other examples for how you
// can add other styles or just individual icons.
library.add(
  faArrowLeft,
  faBars,
  faCheckCircle,
  faChevronDown,
  faCircle,
  faInfo,
  faMinus,
  faPlus,
  faSearch,
  faStar,
  farStar,
  faExternalLinkAlt,
  faMap,
  faEye,
  faTimes,
  faFilter
)

// Register the component globally
Vue.component('FontAwesomeIcon', FontAwesomeIcon)
