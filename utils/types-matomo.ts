export interface MatomoInterface {
  getAsyncTracker: Function
}

declare global {
  interface Window {
    _paq: {
      push: Function
    }
    Matomo: MatomoInterface
  }
}
