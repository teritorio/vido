export default defineI18nLocale(() => {
  return {
    ui: {
      close: 'Fermer',
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
      copy: 'Copier',
      qrcode: 'QR-Code',
      close: 'Fermer',
    },
    favorites: {
      title: 'Favoris',
      list: 'Liste',
      menu_label: 'Menu des favoris',
      menu_notebook: 'Carnet',
      menu_share: 'Partager',
      menu_clear: 'Effacer',
      export_pdf: 'Export PDF',
      export_csv: 'Export CSV',
      share_link: 'Partager le lien des favoris',
      notebook: {
        title: 'Carnet des favoris',
        share: 'Partager',
        print: 'Imprimer',
        export: 'Exporter',
        remove: 'Supprimer',
      },
      noFavs:
        'Vous n\'avez pas encore de lieux en favoris. Vous pouvez le faire en sélectionnant un lieu sur la carte, puis en le mémorisant comme favori.',
    },
    mapControls: {
      exploreAriaLabel: 'Mode explorer',
      exploreButton: 'Explorer les points d\'intérêts à proximité',
      threeDAriaLabel: 'Visualiser la carte en 3D',
      backgroundAriaLabel: 'Changer le fond de carte',
      backgroundButton: 'Changer le fond de carte vers "{background}"',
      resetBearing: 'Remettre la carte vers le nord',
      zoomIn: 'Zoomer avant',
      zoomOut: 'Zoomer arriere',
    },
    navMenu: {
      label: 'Navigation',
    },
    snack: {
      noPoi: {
        issue: 'Pas de résultat correspondant.',
        action: 'Voir des lieux plus éloignés ?',
      },
      noFavorites: {
        issue: 'Pas de favori ici.',
        action: 'Voir tous les favoris ?',
      },
    },
    headerMenu: {
      logo: 'Logo',
      search: 'Rechercher',
      searchHint: 'Points d\'intérêt, catégorie, adresse',
      selectAll: 'Tout sélectionner',
      unselectAll: 'Tout désélectionner',
      filter: 'Filtrer',
      editFilters: 'Modifier les filtres',
      categories: 'Catégories',
      cities: 'Communes',
      pois: 'Points d\'intérêts',
      addresses: 'Adresses',
      cartocode: 'Cartocode',
      noResult: 'Aucun résultat',
      hideCategory: 'Masquer cette catégorie',
      clearAllCategories: 'Retirer toutes les catégories',
      back: 'Retour',
      backToMenuFavorites: 'Afficher le menu',
      backToMenuExplorer: 'Rechercher par catégories',
      backToMenuFavoritesMobile: 'Quitter les favoris',
      backToMenuExplorerMobile: 'Rechercher par catégories',
      disableCategory: 'Supprimer la catégorie',
    },
    dateRange: {
      from_to: 'Du {from} au {to}, {duration} jour(s)',
      from: 'À partir du {from}',
      to: 'Jusqu\'au {to}',
      on: 'Le {on}',
    },
    openingHours: {
      opened: 'Actuellement ouvert',
      closeAt: 'Fermeture',
      closed: 'Actuellement fermé',
      openAt: 'Ouverture',
      next: 'Prochain',
      formatDayAndDayInMonth: 'EEE d :',
      variableWeek: 'Les horaires peuvent varier d\'une semaine sur l\'autre.',
    },
    poiCard: {
      details: 'Détails',
      seeDetail: 'Voir le detail',
      route: 'Itinéraire',
      explore: 'À proximité',
      favorite: 'Favori',
      favoriteOn: 'Mettre en favori',
      favoriteOff: 'Retirer le favori',
      findRoute: 'Trouver la route pour venir jusqu\'à ce lieu',
      unactivateExplore: 'Désactiver l\'exploration à proximité',
      activateExplore: 'Explorer les points d\'intérêts à proximité',
      zoom: 'Zoomer',
      backToMap: 'Aller à la carte',
      thumbnail: 'Miniature',
      image: 'Illustration',
    },
    poiDetails: {
      headerDescription: 'Descriptif',
      headerDownload: 'Fichiers à télécharger',
      lastUpdate: 'Dernière modification',
      headerContacts: 'Contact',
      shareFacebook: 'Partager sur Facebook',
      shareTwitter: 'Partager sur Twitter',
      shareWhatsApp: 'Partager sur WhatsApp',
      print: 'Imprimer',
      link: 'Partager le lien',
      qrcode: 'Partager en QR-Code',
      poweredBy: 'Réalisation',
      mapillaryExplore: 'Explorer sur Mapillary',
      informations: 'Informations',
      downloadGPX: 'Le parcours (trace GPS) au format GPX',
      downloadPDF: 'La fiche complète au format PDF',
      routes: {
        waypoints: 'Points guides',
        pois: 'Points d’intérêts',
      },
    },
    poisTable: {
      empty: 'Liste vide',
      details: 'Détails',
      downloadCsv: 'Télécharger en CSV',
      downloadGeojson: 'Télécharger en GeoJSON',
      showOnMap: 'Afficher sur la carte',
    },
    categorySelector: {
      placeholderSelect: 'Sélectionnez une catégorie',
      placeholderAdd: 'Recherche une catégorie à ajouter',
      search: 'Recherchez dans la liste',
    },
    dateFilter: {
      today: 'Aujourd\'hui',
      tomorrow: 'Demain',
      thisWeekend: 'Ce week-end',
      nextWeek: '7 prochains jours',
      nextMonth: '30 prochains jours',
    },
    listFilter: {
      label: 'Recherchez ou ajoutez une valeur',
    },
    fields: {
      phone: {
        callNumber: 'Appeler ce numéro',
      },
      stars: {
        label: 'Étoiles',
      },
      route: {
        difficulty: 'Difficulté :',
        length: 'Distance :',
        duration: 'Durée :',
        difficulties: {
          easy: 'facile',
          normal: 'normal',
          hard: 'dur',
        },
      },
    },
    cookiesConsent: {
      accept: 'Accepter',
      details: 'En savoir plus',
      decline: 'Refuser',
    },
  }
})
