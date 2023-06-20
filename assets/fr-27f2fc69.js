const resource = {
  "ui": {
    "close": (()=>{const fn=(ctx) => {const { normalize: _normalize } = ctx;return _normalize(["Fermer"])};fn.source="Fermer";return fn;})()
  },
  "units": {
    "min": (()=>{const fn=(ctx) => {const { normalize: _normalize } = ctx;return _normalize(["min"])};fn.source="min";return fn;})(),
    "hours": (()=>{const fn=(ctx) => {const { normalize: _normalize } = ctx;return _normalize(["h"])};fn.source="h";return fn;})(),
    "km": (()=>{const fn=(ctx) => {const { normalize: _normalize } = ctx;return _normalize(["km"])};fn.source="km";return fn;})()
  },
  "ponctuation": {
    "colon": (()=>{const fn=(ctx) => {const { normalize: _normalize } = ctx;return _normalize([" :"])};fn.source=" :";return fn;})()
  },
  "shareLink": {
    "copy": (()=>{const fn=(ctx) => {const { normalize: _normalize } = ctx;return _normalize(["Copier"])};fn.source="Copier";return fn;})(),
    "qrcode": (()=>{const fn=(ctx) => {const { normalize: _normalize } = ctx;return _normalize(["QR-Code"])};fn.source="QR-Code";return fn;})(),
    "close": (()=>{const fn=(ctx) => {const { normalize: _normalize } = ctx;return _normalize(["Fermer"])};fn.source="Fermer";return fn;})()
  },
  "favorites": {
    "title": (()=>{const fn=(ctx) => {const { normalize: _normalize } = ctx;return _normalize(["Favoris"])};fn.source="Favoris";return fn;})(),
    "list": (()=>{const fn=(ctx) => {const { normalize: _normalize } = ctx;return _normalize(["Liste"])};fn.source="Liste";return fn;})(),
    "menu_label": (()=>{const fn=(ctx) => {const { normalize: _normalize } = ctx;return _normalize(["Menu des favoris"])};fn.source="Menu des favoris";return fn;})(),
    "menu_notebook": (()=>{const fn=(ctx) => {const { normalize: _normalize } = ctx;return _normalize(["Carnet"])};fn.source="Carnet";return fn;})(),
    "menu_share": (()=>{const fn=(ctx) => {const { normalize: _normalize } = ctx;return _normalize(["Partager"])};fn.source="Partager";return fn;})(),
    "menu_clear": (()=>{const fn=(ctx) => {const { normalize: _normalize } = ctx;return _normalize(["Effacer"])};fn.source="Effacer";return fn;})(),
    "export_pdf": (()=>{const fn=(ctx) => {const { normalize: _normalize } = ctx;return _normalize(["Export PDF"])};fn.source="Export PDF";return fn;})(),
    "export_csv": (()=>{const fn=(ctx) => {const { normalize: _normalize } = ctx;return _normalize(["Export CSV"])};fn.source="Export CSV";return fn;})(),
    "share_link": (()=>{const fn=(ctx) => {const { normalize: _normalize } = ctx;return _normalize(["Partager le lien des favoris"])};fn.source="Partager le lien des favoris";return fn;})(),
    "notebook": {
      "title": (()=>{const fn=(ctx) => {const { normalize: _normalize } = ctx;return _normalize(["Carnet des favoris"])};fn.source="Carnet des favoris";return fn;})()
    },
    "noFavs": (()=>{const fn=(ctx) => {const { normalize: _normalize } = ctx;return _normalize(["Vous n'avez pas encore de lieux en favoris. Vous pouvez le faire en sélectionnant un lieu sur la carte, puis en le mémorisant comme favori."])};fn.source="Vous n'avez pas encore de lieux en favoris. Vous pouvez le faire en sélectionnant un lieu sur la carte, puis en le mémorisant comme favori.";return fn;})()
  },
  "mapControls": {
    "exploreAriaLabel": (()=>{const fn=(ctx) => {const { normalize: _normalize } = ctx;return _normalize(["Mode explorer"])};fn.source="Mode explorer";return fn;})(),
    "exploreButton": (()=>{const fn=(ctx) => {const { normalize: _normalize } = ctx;return _normalize(["Explorer les points d'intérêts à proximité"])};fn.source="Explorer les points d'intérêts à proximité";return fn;})(),
    "threeDAriaLabel": (()=>{const fn=(ctx) => {const { normalize: _normalize } = ctx;return _normalize(["Visualiser la carte en 3D"])};fn.source="Visualiser la carte en 3D";return fn;})(),
    "backgroundAriaLabel": (()=>{const fn=(ctx) => {const { normalize: _normalize } = ctx;return _normalize(["Changer le fond de carte"])};fn.source="Changer le fond de carte";return fn;})(),
    "backgroundButton": (()=>{const fn=(ctx) => {const { normalize: _normalize, interpolate: _interpolate, named: _named } = ctx;return _normalize(["Changer le fond de carte vers \"", _interpolate(_named("background")), "\""])};fn.source="Changer le fond de carte vers \"{background}\"";return fn;})(),
    "resetBearing": (()=>{const fn=(ctx) => {const { normalize: _normalize } = ctx;return _normalize(["Remettre la carte vers le nord"])};fn.source="Remettre la carte vers le nord";return fn;})(),
    "zoomIn": (()=>{const fn=(ctx) => {const { normalize: _normalize } = ctx;return _normalize(["Zoomer avant"])};fn.source="Zoomer avant";return fn;})(),
    "zoomOut": (()=>{const fn=(ctx) => {const { normalize: _normalize } = ctx;return _normalize(["Zoomer arriere"])};fn.source="Zoomer arriere";return fn;})()
  },
  "navMenu": {
    "label": (()=>{const fn=(ctx) => {const { normalize: _normalize } = ctx;return _normalize(["Navigation"])};fn.source="Navigation";return fn;})()
  },
  "snack": {
    "noPoi": {
      "issue": (()=>{const fn=(ctx) => {const { normalize: _normalize } = ctx;return _normalize(["Pas de résultat correspondant."])};fn.source="Pas de résultat correspondant.";return fn;})(),
      "action": (()=>{const fn=(ctx) => {const { normalize: _normalize } = ctx;return _normalize(["Voir des lieux plus éloignés ?"])};fn.source="Voir des lieux plus éloignés ?";return fn;})()
    },
    "noFavorites": {
      "issue": (()=>{const fn=(ctx) => {const { normalize: _normalize } = ctx;return _normalize(["Pas de favori ici."])};fn.source="Pas de favori ici.";return fn;})(),
      "action": (()=>{const fn=(ctx) => {const { normalize: _normalize } = ctx;return _normalize(["Voir tous les favoris ?"])};fn.source="Voir tous les favoris ?";return fn;})()
    }
  },
  "headerMenu": {
    "logo": (()=>{const fn=(ctx) => {const { normalize: _normalize } = ctx;return _normalize(["Logo"])};fn.source="Logo";return fn;})(),
    "search": (()=>{const fn=(ctx) => {const { normalize: _normalize } = ctx;return _normalize(["Rechercher"])};fn.source="Rechercher";return fn;})(),
    "searchHint": (()=>{const fn=(ctx) => {const { normalize: _normalize } = ctx;return _normalize(["Points d'intérêt, catégorie, adresse"])};fn.source="Points d'intérêt, catégorie, adresse";return fn;})(),
    "selectAll": (()=>{const fn=(ctx) => {const { normalize: _normalize } = ctx;return _normalize(["Tout sélectionner"])};fn.source="Tout sélectionner";return fn;})(),
    "unselectAll": (()=>{const fn=(ctx) => {const { normalize: _normalize } = ctx;return _normalize(["Tout désélectionner"])};fn.source="Tout désélectionner";return fn;})(),
    "filter": (()=>{const fn=(ctx) => {const { normalize: _normalize } = ctx;return _normalize(["Filtrer"])};fn.source="Filtrer";return fn;})(),
    "editFilters": (()=>{const fn=(ctx) => {const { normalize: _normalize } = ctx;return _normalize(["Modifier les filtres"])};fn.source="Modifier les filtres";return fn;})(),
    "categories": (()=>{const fn=(ctx) => {const { normalize: _normalize } = ctx;return _normalize(["Catégories"])};fn.source="Catégories";return fn;})(),
    "cities": (()=>{const fn=(ctx) => {const { normalize: _normalize } = ctx;return _normalize(["Communes"])};fn.source="Communes";return fn;})(),
    "pois": (()=>{const fn=(ctx) => {const { normalize: _normalize } = ctx;return _normalize(["Points d'intérêts"])};fn.source="Points d'intérêts";return fn;})(),
    "addresses": (()=>{const fn=(ctx) => {const { normalize: _normalize } = ctx;return _normalize(["Adresses"])};fn.source="Adresses";return fn;})(),
    "cartocode": (()=>{const fn=(ctx) => {const { normalize: _normalize } = ctx;return _normalize(["Cartocode"])};fn.source="Cartocode";return fn;})(),
    "noResult": (()=>{const fn=(ctx) => {const { normalize: _normalize } = ctx;return _normalize(["Aucun résultat"])};fn.source="Aucun résultat";return fn;})(),
    "hideCategory": (()=>{const fn=(ctx) => {const { normalize: _normalize } = ctx;return _normalize(["Masquer cette catégorie"])};fn.source="Masquer cette catégorie";return fn;})(),
    "clearAllCategories": (()=>{const fn=(ctx) => {const { normalize: _normalize } = ctx;return _normalize(["Retirer toutes les catégories"])};fn.source="Retirer toutes les catégories";return fn;})(),
    "back": (()=>{const fn=(ctx) => {const { normalize: _normalize } = ctx;return _normalize(["Retour"])};fn.source="Retour";return fn;})(),
    "backToMenuFavorites": (()=>{const fn=(ctx) => {const { normalize: _normalize } = ctx;return _normalize(["Afficher le menu"])};fn.source="Afficher le menu";return fn;})(),
    "backToMenuExplorer": (()=>{const fn=(ctx) => {const { normalize: _normalize } = ctx;return _normalize(["Rechercher par catégories"])};fn.source="Rechercher par catégories";return fn;})(),
    "backToMenuFavoritesMobile": (()=>{const fn=(ctx) => {const { normalize: _normalize } = ctx;return _normalize(["Quitter les favoris"])};fn.source="Quitter les favoris";return fn;})(),
    "backToMenuExplorerMobile": (()=>{const fn=(ctx) => {const { normalize: _normalize } = ctx;return _normalize(["Rechercher par catégories"])};fn.source="Rechercher par catégories";return fn;})(),
    "disableCategory": (()=>{const fn=(ctx) => {const { normalize: _normalize } = ctx;return _normalize(["Supprimer la catégorie"])};fn.source="Supprimer la catégorie";return fn;})()
  },
  "dateRange": {
    "from_to": (()=>{const fn=(ctx) => {const { normalize: _normalize, interpolate: _interpolate, named: _named } = ctx;return _normalize(["Du ", _interpolate(_named("from")), " au ", _interpolate(_named("to")), ", ", _interpolate(_named("duration")), " jour(s)"])};fn.source="Du {from} au {to}, {duration} jour(s)";return fn;})(),
    "from": (()=>{const fn=(ctx) => {const { normalize: _normalize, interpolate: _interpolate, named: _named } = ctx;return _normalize(["À partir du ", _interpolate(_named("from"))])};fn.source="À partir du {from}";return fn;})(),
    "to": (()=>{const fn=(ctx) => {const { normalize: _normalize, interpolate: _interpolate, named: _named } = ctx;return _normalize(["Jusqu'au ", _interpolate(_named("to"))])};fn.source="Jusqu'au {to}";return fn;})(),
    "on": (()=>{const fn=(ctx) => {const { normalize: _normalize, interpolate: _interpolate, named: _named } = ctx;return _normalize(["Le ", _interpolate(_named("on"))])};fn.source="Le {on}";return fn;})()
  },
  "openingHours": {
    "opened": (()=>{const fn=(ctx) => {const { normalize: _normalize } = ctx;return _normalize(["Actuellement ouvert"])};fn.source="Actuellement ouvert";return fn;})(),
    "closeAt": (()=>{const fn=(ctx) => {const { normalize: _normalize } = ctx;return _normalize(["Fermeture"])};fn.source="Fermeture";return fn;})(),
    "closed": (()=>{const fn=(ctx) => {const { normalize: _normalize } = ctx;return _normalize(["Actuellement fermé"])};fn.source="Actuellement fermé";return fn;})(),
    "openAt": (()=>{const fn=(ctx) => {const { normalize: _normalize } = ctx;return _normalize(["Ouverture"])};fn.source="Ouverture";return fn;})(),
    "next": (()=>{const fn=(ctx) => {const { normalize: _normalize } = ctx;return _normalize(["Prochain"])};fn.source="Prochain";return fn;})(),
    "formatDayAndDayInMonth": (()=>{const fn=(ctx) => {const { normalize: _normalize } = ctx;return _normalize(["EEE d :"])};fn.source="EEE d :";return fn;})(),
    "variableWeek": (()=>{const fn=(ctx) => {const { normalize: _normalize } = ctx;return _normalize(["Les horaires peuvent varier d'une semaine sur l'autre."])};fn.source="Les horaires peuvent varier d'une semaine sur l'autre.";return fn;})()
  },
  "poiCard": {
    "details": (()=>{const fn=(ctx) => {const { normalize: _normalize } = ctx;return _normalize(["Détails"])};fn.source="Détails";return fn;})(),
    "seeDetail": (()=>{const fn=(ctx) => {const { normalize: _normalize } = ctx;return _normalize(["Voir le detail"])};fn.source="Voir le detail";return fn;})(),
    "route": (()=>{const fn=(ctx) => {const { normalize: _normalize } = ctx;return _normalize(["Itinéraire"])};fn.source="Itinéraire";return fn;})(),
    "explore": (()=>{const fn=(ctx) => {const { normalize: _normalize } = ctx;return _normalize(["À proximité"])};fn.source="À proximité";return fn;})(),
    "favorite": (()=>{const fn=(ctx) => {const { normalize: _normalize } = ctx;return _normalize(["Favori"])};fn.source="Favori";return fn;})(),
    "favoriteOn": (()=>{const fn=(ctx) => {const { normalize: _normalize } = ctx;return _normalize(["Mettre en favori"])};fn.source="Mettre en favori";return fn;})(),
    "favoriteOff": (()=>{const fn=(ctx) => {const { normalize: _normalize } = ctx;return _normalize(["Retirer le favori"])};fn.source="Retirer le favori";return fn;})(),
    "findRoute": (()=>{const fn=(ctx) => {const { normalize: _normalize } = ctx;return _normalize(["Trouver la route pour venir jusqu'à ce lieu"])};fn.source="Trouver la route pour venir jusqu'à ce lieu";return fn;})(),
    "unactivateExplore": (()=>{const fn=(ctx) => {const { normalize: _normalize } = ctx;return _normalize(["Désactiver l'exploration à proximité"])};fn.source="Désactiver l'exploration à proximité";return fn;})(),
    "activateExplore": (()=>{const fn=(ctx) => {const { normalize: _normalize } = ctx;return _normalize(["Explorer les points d'intérêts à proximité"])};fn.source="Explorer les points d'intérêts à proximité";return fn;})(),
    "zoom": (()=>{const fn=(ctx) => {const { normalize: _normalize } = ctx;return _normalize(["Zoomer"])};fn.source="Zoomer";return fn;})(),
    "backToMap": (()=>{const fn=(ctx) => {const { normalize: _normalize } = ctx;return _normalize(["Aller à la carte"])};fn.source="Aller à la carte";return fn;})(),
    "thumbnail": (()=>{const fn=(ctx) => {const { normalize: _normalize } = ctx;return _normalize(["Miniature"])};fn.source="Miniature";return fn;})(),
    "image": (()=>{const fn=(ctx) => {const { normalize: _normalize } = ctx;return _normalize(["Illustration"])};fn.source="Illustration";return fn;})()
  },
  "poiDetails": {
    "headerDescription": (()=>{const fn=(ctx) => {const { normalize: _normalize } = ctx;return _normalize(["Descriptif"])};fn.source="Descriptif";return fn;})(),
    "headerDownload": (()=>{const fn=(ctx) => {const { normalize: _normalize } = ctx;return _normalize(["Fichiers à télécharger"])};fn.source="Fichiers à télécharger";return fn;})(),
    "lastUpdate": (()=>{const fn=(ctx) => {const { normalize: _normalize } = ctx;return _normalize(["Dernière modification"])};fn.source="Dernière modification";return fn;})(),
    "headerContacts": (()=>{const fn=(ctx) => {const { normalize: _normalize } = ctx;return _normalize(["Contact"])};fn.source="Contact";return fn;})(),
    "shareFacebook": (()=>{const fn=(ctx) => {const { normalize: _normalize } = ctx;return _normalize(["Partager sur Facebook"])};fn.source="Partager sur Facebook";return fn;})(),
    "shareTwitter": (()=>{const fn=(ctx) => {const { normalize: _normalize } = ctx;return _normalize(["Partager sur Twitter"])};fn.source="Partager sur Twitter";return fn;})(),
    "shareWhatsApp": (()=>{const fn=(ctx) => {const { normalize: _normalize } = ctx;return _normalize(["Partager sur WhatsApp"])};fn.source="Partager sur WhatsApp";return fn;})(),
    "print": (()=>{const fn=(ctx) => {const { normalize: _normalize } = ctx;return _normalize(["Imprimer"])};fn.source="Imprimer";return fn;})(),
    "link": (()=>{const fn=(ctx) => {const { normalize: _normalize } = ctx;return _normalize(["Partager le lien"])};fn.source="Partager le lien";return fn;})(),
    "qrcode": (()=>{const fn=(ctx) => {const { normalize: _normalize } = ctx;return _normalize(["Partager en QR-Code"])};fn.source="Partager en QR-Code";return fn;})(),
    "poweredBy": (()=>{const fn=(ctx) => {const { normalize: _normalize } = ctx;return _normalize(["Réalisation"])};fn.source="Réalisation";return fn;})(),
    "mapillaryExplore": (()=>{const fn=(ctx) => {const { normalize: _normalize } = ctx;return _normalize(["Explorer sur Mapillary"])};fn.source="Explorer sur Mapillary";return fn;})(),
    "informations": (()=>{const fn=(ctx) => {const { normalize: _normalize } = ctx;return _normalize(["Informations"])};fn.source="Informations";return fn;})(),
    "downloadGPX": (()=>{const fn=(ctx) => {const { normalize: _normalize } = ctx;return _normalize(["Le parcours (trace GPS) au format GPX"])};fn.source="Le parcours (trace GPS) au format GPX";return fn;})(),
    "downloadPDF": (()=>{const fn=(ctx) => {const { normalize: _normalize } = ctx;return _normalize(["La fiche complète au format PDF"])};fn.source="La fiche complète au format PDF";return fn;})(),
    "routes": {
      "waypoints": (()=>{const fn=(ctx) => {const { normalize: _normalize } = ctx;return _normalize(["Points guides"])};fn.source="Points guides";return fn;})(),
      "pois": (()=>{const fn=(ctx) => {const { normalize: _normalize } = ctx;return _normalize(["Points d’intérêts"])};fn.source="Points d’intérêts";return fn;})()
    }
  },
  "poisTable": {
    "empty": (()=>{const fn=(ctx) => {const { normalize: _normalize } = ctx;return _normalize(["Liste vide"])};fn.source="Liste vide";return fn;})(),
    "details": (()=>{const fn=(ctx) => {const { normalize: _normalize } = ctx;return _normalize(["Détails"])};fn.source="Détails";return fn;})(),
    "downloadCsv": (()=>{const fn=(ctx) => {const { normalize: _normalize } = ctx;return _normalize(["Télécharger en CSV"])};fn.source="Télécharger en CSV";return fn;})(),
    "downloadGeojson": (()=>{const fn=(ctx) => {const { normalize: _normalize } = ctx;return _normalize(["Télécharger en GeoJSON"])};fn.source="Télécharger en GeoJSON";return fn;})(),
    "showOnMap": (()=>{const fn=(ctx) => {const { normalize: _normalize } = ctx;return _normalize(["Afficher sur la carte"])};fn.source="Afficher sur la carte";return fn;})()
  },
  "categorySelector": {
    "placeholder": (()=>{const fn=(ctx) => {const { normalize: _normalize } = ctx;return _normalize(["Sélectionnez une catégorie"])};fn.source="Sélectionnez une catégorie";return fn;})(),
    "search": (()=>{const fn=(ctx) => {const { normalize: _normalize } = ctx;return _normalize(["Recherchez dans la liste"])};fn.source="Recherchez dans la liste";return fn;})()
  },
  "dateFilter": {
    "today": (()=>{const fn=(ctx) => {const { normalize: _normalize } = ctx;return _normalize(["Aujourd'hui"])};fn.source="Aujourd'hui";return fn;})(),
    "tomorrow": (()=>{const fn=(ctx) => {const { normalize: _normalize } = ctx;return _normalize(["Demain"])};fn.source="Demain";return fn;})(),
    "thisWeekend": (()=>{const fn=(ctx) => {const { normalize: _normalize } = ctx;return _normalize(["Ce week-end"])};fn.source="Ce week-end";return fn;})(),
    "nextWeek": (()=>{const fn=(ctx) => {const { normalize: _normalize } = ctx;return _normalize(["7 prochains jours"])};fn.source="7 prochains jours";return fn;})(),
    "nextMonth": (()=>{const fn=(ctx) => {const { normalize: _normalize } = ctx;return _normalize(["30 prochains jours"])};fn.source="30 prochains jours";return fn;})()
  },
  "listFilter": {
    "label": (()=>{const fn=(ctx) => {const { normalize: _normalize } = ctx;return _normalize(["Recherchez ou ajoutez une valeur"])};fn.source="Recherchez ou ajoutez une valeur";return fn;})()
  },
  "fields": {
    "phone": {
      "callNumber": (()=>{const fn=(ctx) => {const { normalize: _normalize } = ctx;return _normalize(["Appeler ce numéro"])};fn.source="Appeler ce numéro";return fn;})()
    },
    "stars": {
      "label": (()=>{const fn=(ctx) => {const { normalize: _normalize } = ctx;return _normalize(["Étoiles"])};fn.source="Étoiles";return fn;})()
    },
    "route": {
      "difficulty": (()=>{const fn=(ctx) => {const { normalize: _normalize } = ctx;return _normalize(["Difficulté :"])};fn.source="Difficulté :";return fn;})(),
      "length": (()=>{const fn=(ctx) => {const { normalize: _normalize } = ctx;return _normalize(["Distance :"])};fn.source="Distance :";return fn;})(),
      "duration": (()=>{const fn=(ctx) => {const { normalize: _normalize } = ctx;return _normalize(["Durée :"])};fn.source="Durée :";return fn;})(),
      "difficulties": {
        "easy": (()=>{const fn=(ctx) => {const { normalize: _normalize } = ctx;return _normalize(["facile"])};fn.source="facile";return fn;})(),
        "normal": (()=>{const fn=(ctx) => {const { normalize: _normalize } = ctx;return _normalize(["normal"])};fn.source="normal";return fn;})(),
        "hard": (()=>{const fn=(ctx) => {const { normalize: _normalize } = ctx;return _normalize(["dur"])};fn.source="dur";return fn;})()
      }
    }
  },
  "cookiesConsent": {
    "accept": (()=>{const fn=(ctx) => {const { normalize: _normalize } = ctx;return _normalize(["Accepter"])};fn.source="Accepter";return fn;})(),
    "details": (()=>{const fn=(ctx) => {const { normalize: _normalize } = ctx;return _normalize(["En savoir plus"])};fn.source="En savoir plus";return fn;})(),
    "decline": (()=>{const fn=(ctx) => {const { normalize: _normalize } = ctx;return _normalize(["Refuser"])};fn.source="Refuser";return fn;})()
  }
};

export { resource as default };
