import Vue from 'vue'
import VueTailwind from 'vue-tailwind'
import { TModal, TRichSelect } from 'vue-tailwind/dist/components'

const settings = {
  't-modal': {
    component: TModal,
    props: {
      fixedClasses: {
        overlay:
          'overflow-auto scrolling-touch left-0 top-0 bottom-0 right-0 w-full h-full fixed',
        wrapper: 'relative mx-auto',
        modal: 'overflow-visible relative',
        close: 'flex items-center justify-center',
      },
      classes: {
        overlay: 'z-40 bg-black bg-opacity-50',
        wrapper: 'z-50 max-w-lg',
        modal: 'bg-white shadow rounded mx-3 my-20 sm:mx-0',
        body: 'p-3',
        header: 'border-b border-zinc-100 p-3 rounded-t',
        footer: 'bg-zinc-100 p-3 rounded-b',
        close:
          'bg-zinc-100 text-zinc-600 rounded-full absolute right-0 top-0 -m-3 h-8 w-8 transition duration-100 ease-in-out hover:bg-zinc-200 focus:ring-2 focus:ring-blue-500 focus:outline-none focus:ring-opacity-50',
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
  't-full-modal': {
    component: TModal,
    props: {
      fixedClasses: {
        overlay:
          'overflow-auto scrolling-touch left-0 top-0 bottom-0 right-0 w-full h-full fixed',
        wrapper: 'relative mx-0 w-full h-full',
        modal: 'overflow-visible relative w-full h-full',
        close: 'flex items-center justify-center',
      },
      classes: {
        overlay: 'z-40 bg-black bg-opacity-50',
        wrapper: 'z-50',
        modal: 'bg-white shadow',
        body: 'p-3 h-full',
        header: 'border-b border-zinc-100 p-3 rounded-t',
        footer: 'bg-zinc-100 p-3 rounded-b',
        close:
          'bg-zinc-100 text-zinc-600 rounded-full absolute right-0 top-0 -m-3 h-8 w-8 transition duration-100 ease-in-out hover:bg-zinc-200 focus:ring-2 focus:ring-blue-500 focus:outline-none focus:ring-opacity-50',
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
  't-modal-notebook': {
    component: TModal,
    props: {
      fixedClasses: {
        overlay:
          'overflow-auto scrolling-touch left-0 top-0 bottom-0 right-0 w-full h-full fixed',
        wrapper: 'relative mx-auto',
        modal: 'relative',
        close: 'flex items-center justify-center',
      },
      classes: {
        overlay: 'z-40',
        wrapper: 'z-50 max-w-7xl',
        modal:
          'bg-white shadow my-0 sm:mx-0 h-screen h-screen w-full overflow-auto',
        body: 'p-3 sm:p-0',
        header: 'border-b border-zinc-100 p-3 rounded-t',
        footer: 'bg-zinc-100 p-3 rounded-b',
        close:
          'bg-zinc-100 text-zinc-600 rounded-full absolute right-0 top-0 -m-3 h-8 w-8 transition duration-100 ease-in-out hover:bg-zinc-200 focus:ring-2 focus:ring-blue-500 focus:outline-none focus:ring-opacity-50',
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
  't-rich-select': {
    component: TRichSelect,
    props: {
      wrapped: true,
      classes: {
        wrapper: 'relative',
        buttonWrapper: '',
        selectButton:
          'px-3 py-2 text-black transition duration-100 ease-in-out bg-white border border-zinc-300 rounded shadow-sm focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500 focus:outline-none focus:ring-opacity-50 disabled:opacity-50 disabled:cursor-not-allowed',
        selectButtonLabel: '',
        selectButtonTagWrapper: '-mx-2 -my-2.5 py-1 pr-8',
        selectButtonTag:
          'bg-emerald-500 block disabled:cursor-not-allowed disabled:opacity-50 duration-100 ease-in-out focus:border-emerald-500 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:ring-opacity-50 rounded shadow-sm text-sm text-white transition white-space-no m-0.5 max-w-full overflow-hidden h-8 flex items-center',
        selectButtonTagText: 'px-3',
        selectButtonTagDeleteButton:
          '-ml-1.5 h-full hover:bg-emerald-500 hover:shadow-sm inline-flex items-center px-2 transition',
        selectButtonTagDeleteButtonIcon: '',
        selectButtonPlaceholder: 'text-zinc-400',
        selectButtonIcon: 'text-zinc-600',
        selectButtonClearButton:
          'hover:bg-emerald-100 text-zinc-600 rounded transition duration-100 ease-in-out',
        selectButtonClearIcon: '',
        dropdown:
          '-mt-1 bg-white border-b border-zinc-300 border-l border-r rounded-b shadow-sm',
        dropdownFeedback: 'pb-2 px-3 text-zinc-400 text-sm',
        loadingMoreResults: 'pb-2 px-3 text-zinc-400 text-sm',
        optionsList: '',
        searchWrapper: 'p-2 placeholder-zinc-400',
        searchBox:
          'px-3 py-2 bg-zinc-50 text-sm rounded border focus:outline-none focus:shadow-outline border-zinc-300',
        optgroup: 'text-zinc-400 uppercase text-xs py-1 px-2 font-semibold',
        option: '',
        disabledOption: '',
        highlightedOption: 'bg-emerald-100',
        selectedOption:
          'font-semibold bg-zinc-100 bg-emerald-500 font-semibold text-white',
        selectedHighlightedOption:
          'font-semibold bg-zinc-100 bg-emerald-500 font-semibold text-white',
        optionContent: 'flex justify-between items-center px-3 py-2',
        optionLabel: '',
        selectedIcon: '',
        enterClass: 'opacity-0',
        enterActiveClass: 'transition ease-out duration-100 z-40',
        enterToClass: 'opacity-100 absolute',
        leaveClass: 'opacity-100',
        leaveActiveClass: 'transition ease-in duration-75',
        leaveToClass: 'opacity-0',
      },
      fixedClasses: {
        wrapper: '',
        buttonWrapper: 'inline-block relative w-full',
        selectButton: 'w-full flex text-left justify-between items-center',
        selectButtonLabel: 'block truncate',
        selectButtonTagWrapper: 'flex flex-wrap overflow-hidden',
        selectButtonTag:
          'bg-emerald-500 block disabled:cursor-not-allowed disabled:opacity-50 duration-100 ease-in-out focus:border-emerald-500 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:ring-opacity-50 rounded shadow-sm text-sm text-white transition white-space-no m-0.5 max-w-full overflow-hidden h-8 flex items-center',
        selectButtonTagText: 'px-3',
        selectButtonTagDeleteButton:
          '-ml-1.5 h-full hover:bg-emerald-600 hover:shadow-sm inline-flex items-center px-2 transition',
        selectButtonTagDeleteButtonIcon: 'w-3 h-3',
        selectButtonPlaceholder: 'block truncate',
        selectButtonIcon: 'fill-current shrink-0 ml-1 h-4 w-4',
        selectButtonClearButton:
          'flex shrink-0 items-center justify-center absolute right-0 top-0 m-2 h-6 w-6',
        selectButtonClearIcon: 'fill-current h-3 w-3',
        dropdown: 'absolute w-full',
        dropdownFeedback: '',
        loadingMoreResults: '',
        optionsList: 'overflow-auto',
        searchWrapper: 'inline-block w-full',
        searchBox: 'inline-block w-full',
        optgroup: '',
        option: 'cursor-pointer',
        disabledOption: 'opacity-50 cursor-not-allowed',
        highlightedOption: 'cursor-pointer',
        selectedOption: 'cursor-pointer',
        selectedHighlightedOption: 'cursor-pointer',
        optionContent: '',
        optionLabel: 'truncate block',
        selectedIcon: 'fill-current h-4 w-4',
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
