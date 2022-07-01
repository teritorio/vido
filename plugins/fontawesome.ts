import { config, library } from '@fortawesome/fontawesome-svg-core'
import {
  faFacebook,
  faWhatsapp,
  faTwitter,
} from '@fortawesome/free-brands-svg-icons'
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
  faPrint,
  faQrcode,
  faArrowCircleDown,
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
  faShareAlt,
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
  faBookOpen,
  faPrint,
  faFacebook,
  faWhatsapp,
  faTwitter,
  faQrcode,
  faArrowCircleDown
)

// Register the component globally
Vue.component('FontAwesomeIcon', FontAwesomeIcon)
