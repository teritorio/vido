export default defineI18nLocale(() => {
  return {
    ui: {
      close: 'Close',
    },
    units: {
      min: 'min',
      hours: 'h',
      km: 'km',
    },
    ponctuation: {
      colon: ' :',
    },
    shareLink: {
      copy: 'Copy',
      qrcode: 'QR-Code',
    },
    favorites: {
      title: 'Favorites',
      list: 'List',
      menu_label: 'Favorites menu',
      menu_notebook: 'Notebook',
      menu_share: 'Share',
      menu_clear: 'Clear',
      export_pdf: 'PDF Export',
      export_csv: 'CSV Export',
      share_link: 'Share link of favorites',
      notebook: {
        title: 'Favorites notebook',
        share: 'Share',
        print: 'Print',
        export: 'Export',
        remove: 'Remove',
      },
      noFavs:
        'You do not have any favorite places yet. You can do this by selecting a location on the map, then saving it as a favorite.',
    },
    mapControls: {
      exploreAriaLabel: 'Explore Mode',
      exploreButton: 'Explore nearby points of interest',
      threeDAriaLabel: 'View the map in 3D',
      backgroundAriaLabel: 'Switch the map background',
      backgroundButton: 'Switch the map background to "{background}"',
      resetBearing: 'Reset bearing to north',
      zoomIn: 'Zoom In',
      zoomOut: 'Zoom Out',
    },
    navMenu: {
      label: 'Navigation',
    },
    snack: {
      noPoi: {
        issue: 'No matching result',
        action: 'See more distant places?',
      },
      noFavorites: {
        issue: 'No favorites here.',
        action: 'See all favorites?',
      },
    },
    headerMenu: {
      logo: 'Logo',
      search: 'Search',
      searchHint: 'Point of interest, category, address',
      selectAll: 'Select all',
      unselectAll: 'Unselect all',
      filter: 'Filter',
      editFilters: 'Edit filters',
      categories: 'Categories',
      cities: 'Cities',
      pois: 'Points of interest',
      addresses: 'Addresses',
      cartocode: 'Cartocode',
      noResult: 'No results',
      hideCategory: 'Hide this category',
      clearAllCategories: 'Hide all categories',
      back: 'Back',
      backToMenuFavorites: 'Show menu',
      backToMenuExplorer: 'Search by Categories',
      backToMenuFavoritesMobile: 'Exit Favorites',
      backToMenuExplorerMobile: 'Search by Categories',
      disableCategory: 'Remove the category',
    },
    dateRange: {
      from_to: 'From {from} to {to}, {duration} day(s)',
      from: 'From {from}',
      to: 'Until {to}',
      on: 'On {on}',
    },
    openingHours: {
      opened: 'Currently open',
      closeAt: 'Closes',
      closed: 'Currently closed',
      openAt: 'Opens',
      next: 'Next',
      formatDayAndDayInMonth: 'EEE do\':\'',
      variableWeek: 'The hours may vary from week to week.',
    },
    poiCard: {
      details: 'Details',
      seeDetail: 'See details',
      route: 'Route',
      explore: 'Nearby',
      favorite: 'Favorite',
      favoriteOn: 'Set as favorite',
      favoriteOff: 'Remove favorite',
      findRoute: 'Find the route to this place',
      unactivateExplore: 'Deactivate exploration of the surroundings',
      activateExplore: 'Explore nearby points of interest',
      zoom: 'Zoom',
      backToMap: 'Volver al mapa',
      thumbnail: 'Thumbnail',
      image: 'Illustration',
    },
    poiDetails: {
      headerDescription: 'Description',
      headerDownload: 'Files to download',
      lastUpdate: 'Last change',
      headerContacts: 'Contact',
      shareFacebook: 'Share on Facebook',
      shareTwitter: 'Share on Twitter',
      shareWhatsApp: 'Share on WhatsApp',
      print: 'Print',
      link: 'Share link',
      qrcode: 'Share with QR-Code',
      poweredBy: 'Powered by',
      mapillaryExplore: 'Explore on Mapillary',
      informations: 'Informations',
      downloadGPX: 'The route (GPS track) in GPX format',
      downloadPDF: 'The complete card in PDF format',
      routes: {
        waypoints: 'Waypoints',
        pois: 'Point of Interests',
      },
    },
    poisTable: {
      empty: 'Empty List',
      details: 'Details',
      downloadCsv: 'Download in CSV',
      downloadGeojson: 'Download in GeoJSON',
      showOnMap: 'Show on Map',
    },
    categorySelector: {
      placeholderSelect: 'Select a category',
      placeholderAdd: 'RSearch for a category to add',
      search: 'Search into the list',
    },
    dateFilter: {
      today: 'Today',
      tomorrow: 'Tomorrow',
      thisWeekend: 'Coming week-end',
      nextWeek: 'Next 7 days',
      nextMonth: 'Next 30 days',
    },
    listFilter: {
      label: 'Search or add a value',
    },
    fields: {
      phone: {
        callNumber: 'Call this number',
      },
      stars: {
        label: 'Stars',
      },
      route: {
        difficulty: 'Difficulty:',
        length: 'Distance:',
        duration: 'Duration:',
        difficulties: {
          easy: 'easy',
          normal: 'normal',
          hard: 'hard',
        },
      },
    },
    cookiesConsent: {
      accept: 'Agree',
      details: 'More information',
      decline: 'Decline',
    },
  }
})
