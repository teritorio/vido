import Vue from 'vue'
import VueTailwind from 'vue-tailwind'
import { TModal } from 'vue-tailwind/dist/components'

const settings = {
  't-modal': {
    component: TModal,
    props: {
      fixedClasses: {
        overlay:
          'overflow-auto scrolling-touch left-0 top-0 bottom-0 right-0 w-full h-full fixed',
        wrapper: 'relative mx-auto',
        modal: 'overflow-visible relative ',
        close: 'flex items-center justify-center',
      },
      classes: {
        overlay: 'z-40 bg-black bg-opacity-50',
        wrapper: 'z-50 max-w-lg',
        modal: 'bg-white shadow rounded mx-3 my-20 sm:mx-0',
        body: 'p-3',
        header: 'border-b border-gray-100 p-3 rounded-t',
        footer: 'bg-gray-100 p-3 rounded-b',
        close:
          'bg-gray-100 text-gray-600 rounded-full absolute right-0 top-0 -m-3 h-8 w-8 transition duration-100 ease-in-out hover:bg-gray-200 focus:ring-2 focus:ring-blue-500 focus:outline-none focus:ring-opacity-50',
        closeIcon: 'fill-current h-4 w-4',
        overlayEnterClass: 'opacity-0',
        overlayEnterActiveClass: 'transition ease-out duration-100',
        overlayEnterToClass: 'opacity-100',
        overlayLeaveClass: 'opacity-100',
        overlayLeaveActiveClass: 'transition ease-in duration-75',
        overlayLeaveToClass: 'opacity-0',
        enterClass: '',
        enterActiveClass: '',
        enterToClass: '',
        leaveClass: '',
        leaveActiveClass: '',
        leaveToClass: '',
      },
    },
  },
}

Vue.use(VueTailwind, settings)
