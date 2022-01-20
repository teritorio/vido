import { config, library } from '@fortawesome/fontawesome-svg-core'
import {
  faCircle,
  faStar as farStar,
  faCompass,
} from '@fortawesome/free-regular-svg-icons'
import {
  faArrowLeft,
  faBars,
  faBiking,
  faCheckCircle,
  faChevronDown,
  faChevronUp,
  faChevronRight,
  faHiking,
  faInfo,
  faMinus,
  faPlus,
  faSearch,
  faStar,
  faLink,
  faExternalLinkAlt,
  faMap,
  faEye,
  faTrash,
  faTimes,
  faFilter,
  faSpinner,
  faMapMarkerAlt,
  faLayerGroup,
  faHome,
  faGripLines,
  faRoute,
  faCity,
  faShareAlt,
  faClipboardCheck,
  faFileDownload,
  faBookOpen,
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
  faBiking,
  faCheckCircle,
  faChevronDown,
  faChevronUp,
  faChevronRight,
  faCircle,
  faHiking,
  faInfo,
  faMinus,
  faPlus,
  faSearch,
  faStar,
  farStar,
  faExternalLinkAlt,
  faMap,
  faEye,
  faTrash,
  faTimes,
  faFilter,
  faSpinner,
  faLink,
  faMapMarkerAlt,
  faLayerGroup,
  faHome,
  faGripLines,
  faRoute,
  faCompass,
  faCity,
  faShareAlt,
  faClipboardCheck,
  faFileDownload,
  faBookOpen
)

// Register the component globally
Vue.component('FontAwesomeIcon', FontAwesomeIcon)
