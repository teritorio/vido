import { config, library } from '@fortawesome/fontawesome-svg-core'
import {
  faFacebook,
  faInstagram,
  faTwitter,
  faWhatsapp,
} from '@fortawesome/free-brands-svg-icons'
import {
  faCircle,
  faCompass,
  faStar as farStar,
} from '@fortawesome/free-regular-svg-icons'
import {
  faArrowCircleDown,
  faArrowLeft,
  faBars,
  faBiking,
  faBookOpen,
  faCheckCircle,
  faChevronDown,
  faChevronRight,
  faChevronUp,
  faCity,
  faClipboardCheck,
  faCog,
  faCopy,
  faEnvelope,
  faExternalLinkAlt,
  faEye,
  faFileCsv,
  faFileDownload,
  faFilePdf,
  faFilter,
  faFlagCheckered,
  faGripLines,
  faHiking,
  faHome,
  faHouseFlag,
  faInfo,
  faLayerGroup,
  faLink,
  faMap,
  faMapMarkerAlt,
  faMinus,
  faPhone,
  faPlus,
  faPrint,
  faRoute,
  faSearch,
  faShareAlt,
  faSpinner,
  faSquareParking,
  faStar,
  faTimes,
  faTrash,
  faCircle as fasCircle,
} from '@fortawesome/free-solid-svg-icons'

import { defineNuxtPlugin } from '#app/nuxt'

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
  fasCircle,
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
  faInstagram,
  faWhatsapp,
  faTwitter,
  faArrowCircleDown,
  faPhone,
  faFileCsv,
  faFilePdf,
  faSquareParking,
  faHouseFlag,
  faFlagCheckered,
  faCopy,
  faCog,
  faEnvelope,
)

export default defineNuxtPlugin(_nuxtApp => undefined)
