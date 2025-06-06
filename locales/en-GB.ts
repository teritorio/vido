export default defineI18nLocale(() => {
  return {
    ui: {
      close: 'Close',
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
      burgerLabel: 'Menu',
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
      backToMenuExplorer: 'Search by categories',
      backToMenuFavoritesMobile: 'Exit favorites',
      backToMenuExplorerMobile: 'Exit "Nearby"',
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
      backToMap: 'Go to map',
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
      empty: 'The list is empty: select a category',
      details: 'Details',
      downloadCsv: 'Download in CSV',
      downloadGeojson: 'Download in GeoJSON',
      filter: 'Filter into the list',
      showOnMap: 'Show on Map',
    },
    categorySelector: {
      placeholderSelect: 'Select a category',
      placeholderAdd: 'Show a category',
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
      contrib: {
        editor_id: 'Edit in iD Editor',
        heading: 'Contribution',
        json: 'View GeoJSON',
        josm: 'Edit in JOSM',
        osm_note: 'Add an OSM note',
        mapillary_link: 'Explore on Mapillary',
      },
      phone: {
        callNumber: 'Call this number',
      },
      stars: {
        label: 'Stars',
      },
      route: {
        difficulty: 'Difficulty: {difficulty}',
        length: 'Distance: {length}',
        duration: 'Duration: {duration}',
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
    isochrone: {
      remove: 'Remove travel time',
      trigger: {
        label: 'Travel time',
        title: 'Travel time from this point',
      },
      overlay: {
        title: 'Where can I go ?',
        text: 'View on map, accessible areas from this point, depending on the duration (15, 30, 60 min) and travel mode.',
      },
      profiles: {
        'cycling-regular': 'By bike',
        'driving-car': 'By car',
        'foot-walking': 'On foot',
      },
    },
    menuNavbar: {
      label: 'Main menu',
      actions: {
        search: {
          open: 'Show search menu',
          close: 'Close search menu',
        },
        goToMap: 'See on map',
      },
    },
  }
})
