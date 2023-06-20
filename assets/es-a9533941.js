const resource = {
  "ui": {
    "close": (()=>{const fn=(ctx) => {const { normalize: _normalize } = ctx;return _normalize(["Cerrar"])};fn.source="Cerrar";return fn;})()
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
    "copy": (()=>{const fn=(ctx) => {const { normalize: _normalize } = ctx;return _normalize(["Copiar"])};fn.source="Copiar";return fn;})(),
    "qrcode": (()=>{const fn=(ctx) => {const { normalize: _normalize } = ctx;return _normalize(["QR-Code"])};fn.source="QR-Code";return fn;})()
  },
  "favorites": {
    "title": (()=>{const fn=(ctx) => {const { normalize: _normalize } = ctx;return _normalize(["Favoritos"])};fn.source="Favoritos";return fn;})(),
    "list": (()=>{const fn=(ctx) => {const { normalize: _normalize } = ctx;return _normalize(["Lista"])};fn.source="Lista";return fn;})(),
    "menu_label": (()=>{const fn=(ctx) => {const { normalize: _normalize } = ctx;return _normalize(["Menú de favoritos"])};fn.source="Menú de favoritos";return fn;})(),
    "menu_notebook": (()=>{const fn=(ctx) => {const { normalize: _normalize } = ctx;return _normalize(["Cuaderno"])};fn.source="Cuaderno";return fn;})(),
    "menu_share": (()=>{const fn=(ctx) => {const { normalize: _normalize } = ctx;return _normalize(["Compartir"])};fn.source="Compartir";return fn;})(),
    "menu_clear": (()=>{const fn=(ctx) => {const { normalize: _normalize } = ctx;return _normalize(["Eliminar"])};fn.source="Eliminar";return fn;})(),
    "export_pdf": (()=>{const fn=(ctx) => {const { normalize: _normalize } = ctx;return _normalize(["Exportación PDF"])};fn.source="Exportación PDF";return fn;})(),
    "export_csv": (()=>{const fn=(ctx) => {const { normalize: _normalize } = ctx;return _normalize(["exportación CSV"])};fn.source="exportación CSV";return fn;})(),
    "share_link": (()=>{const fn=(ctx) => {const { normalize: _normalize } = ctx;return _normalize(["Compartir enlace de favoritos"])};fn.source="Compartir enlace de favoritos";return fn;})(),
    "notebook": {
      "title": (()=>{const fn=(ctx) => {const { normalize: _normalize } = ctx;return _normalize(["Cuaderno de favoritos"])};fn.source="Cuaderno de favoritos";return fn;})()
    },
    "noFavs": (()=>{const fn=(ctx) => {const { normalize: _normalize } = ctx;return _normalize(["Todavía no tienes ningún lugar marcado. Puedes hacerlo seleccionando un lugar en el mapa y guardándolo como favorito"])};fn.source="Todavía no tienes ningún lugar marcado. Puedes hacerlo seleccionando un lugar en el mapa y guardándolo como favorito";return fn;})()
  },
  "mapControls": {
    "exploreAriaLabel": (()=>{const fn=(ctx) => {const { normalize: _normalize } = ctx;return _normalize(["Modo explorar"])};fn.source="Modo explorar";return fn;})(),
    "exploreButton": (()=>{const fn=(ctx) => {const { normalize: _normalize } = ctx;return _normalize(["Exploración de las cercanías"])};fn.source="Exploración de las cercanías";return fn;})(),
    "threeDAriaLabel": (()=>{const fn=(ctx) => {const { normalize: _normalize } = ctx;return _normalize(["Ver el mapa en 3D"])};fn.source="Ver el mapa en 3D";return fn;})(),
    "backgroundAriaLabel": (()=>{const fn=(ctx) => {const { normalize: _normalize } = ctx;return _normalize(["Cambiar el fondo de mapa"])};fn.source="Cambiar el fondo de mapa";return fn;})(),
    "backgroundButton": (()=>{const fn=(ctx) => {const { normalize: _normalize, interpolate: _interpolate, named: _named } = ctx;return _normalize(["Cambiar el fondo de mapa a \"", _interpolate(_named("background")), "\""])};fn.source="Cambiar el fondo de mapa a \"{background}\"";return fn;})(),
    "resetBearing": (()=>{const fn=(ctx) => {const { normalize: _normalize } = ctx;return _normalize(["Restablecer el mapa al norte"])};fn.source="Restablecer el mapa al norte";return fn;})(),
    "zoomIn": (()=>{const fn=(ctx) => {const { normalize: _normalize } = ctx;return _normalize(["Ampliar el zoom"])};fn.source="Ampliar el zoom";return fn;})(),
    "zoomOut": (()=>{const fn=(ctx) => {const { normalize: _normalize } = ctx;return _normalize(["Alejar el zoom"])};fn.source="Alejar el zoom";return fn;})()
  },
  "navMenu": {
    "label": (()=>{const fn=(ctx) => {const { normalize: _normalize } = ctx;return _normalize(["Navegación"])};fn.source="Navegación";return fn;})()
  },
  "snack": {
    "noPoi": {
      "issue": (()=>{const fn=(ctx) => {const { normalize: _normalize } = ctx;return _normalize(["No hay resultados que coincidan"])};fn.source="No hay resultados que coincidan";return fn;})(),
      "action": (()=>{const fn=(ctx) => {const { normalize: _normalize } = ctx;return _normalize(["¿Ves lugares más lejanos?"])};fn.source="¿Ves lugares más lejanos?";return fn;})()
    },
    "noFavorites": {
      "issue": (()=>{const fn=(ctx) => {const { normalize: _normalize } = ctx;return _normalize(["Aquí no hay favoritos"])};fn.source="Aquí no hay favoritos";return fn;})(),
      "action": (()=>{const fn=(ctx) => {const { normalize: _normalize } = ctx;return _normalize(["¿Ver todos los favoritos?"])};fn.source="¿Ver todos los favoritos?";return fn;})()
    }
  },
  "headerMenu": {
    "logo": (()=>{const fn=(ctx) => {const { normalize: _normalize } = ctx;return _normalize(["Logo"])};fn.source="Logo";return fn;})(),
    "search": (()=>{const fn=(ctx) => {const { normalize: _normalize } = ctx;return _normalize(["Buscar"])};fn.source="Buscar";return fn;})(),
    "searchHint": (()=>{const fn=(ctx) => {const { normalize: _normalize } = ctx;return _normalize(["Punto de interés, categoría, dirección"])};fn.source="Punto de interés, categoría, dirección";return fn;})(),
    "selectAll": (()=>{const fn=(ctx) => {const { normalize: _normalize } = ctx;return _normalize(["Seleccionar todo"])};fn.source="Seleccionar todo";return fn;})(),
    "unselectAll": (()=>{const fn=(ctx) => {const { normalize: _normalize } = ctx;return _normalize(["Deseleccionar todo"])};fn.source="Deseleccionar todo";return fn;})(),
    "filter": (()=>{const fn=(ctx) => {const { normalize: _normalize } = ctx;return _normalize(["Filtro"])};fn.source="Filtro";return fn;})(),
    "editFilters": (()=>{const fn=(ctx) => {const { normalize: _normalize } = ctx;return _normalize(["Editar filtros"])};fn.source="Editar filtros";return fn;})(),
    "categories": (()=>{const fn=(ctx) => {const { normalize: _normalize } = ctx;return _normalize(["Categorías"])};fn.source="Categorías";return fn;})(),
    "cities": (()=>{const fn=(ctx) => {const { normalize: _normalize } = ctx;return _normalize(["Comunas"])};fn.source="Comunas";return fn;})(),
    "pois": (()=>{const fn=(ctx) => {const { normalize: _normalize } = ctx;return _normalize(["Puntos de interés"])};fn.source="Puntos de interés";return fn;})(),
    "addresses": (()=>{const fn=(ctx) => {const { normalize: _normalize } = ctx;return _normalize(["Direcciones"])};fn.source="Direcciones";return fn;})(),
    "cartocode": (()=>{const fn=(ctx) => {const { normalize: _normalize } = ctx;return _normalize(["Cartocode"])};fn.source="Cartocode";return fn;})(),
    "noResult": (()=>{const fn=(ctx) => {const { normalize: _normalize } = ctx;return _normalize(["No hay resultados"])};fn.source="No hay resultados";return fn;})(),
    "hideCategory": (()=>{const fn=(ctx) => {const { normalize: _normalize } = ctx;return _normalize(["Ocultar esta categoría"])};fn.source="Ocultar esta categoría";return fn;})(),
    "clearAllCategories": (()=>{const fn=(ctx) => {const { normalize: _normalize } = ctx;return _normalize(["Ocultar todas las categorías"])};fn.source="Ocultar todas las categorías";return fn;})(),
    "back": (()=>{const fn=(ctx) => {const { normalize: _normalize } = ctx;return _normalize(["Regresar"])};fn.source="Regresar";return fn;})(),
    "backToMenuFavorites": (()=>{const fn=(ctx) => {const { normalize: _normalize } = ctx;return _normalize(["Ver el menú"])};fn.source="Ver el menú";return fn;})(),
    "backToMenuExplorer": (()=>{const fn=(ctx) => {const { normalize: _normalize } = ctx;return _normalize(["Buscar par categorías"])};fn.source="Buscar par categorías";return fn;})(),
    "backToMenuFavoritesMobile": (()=>{const fn=(ctx) => {const { normalize: _normalize } = ctx;return _normalize(["Salir de los favoritos"])};fn.source="Salir de los favoritos";return fn;})(),
    "backToMenuExplorerMobile": (()=>{const fn=(ctx) => {const { normalize: _normalize } = ctx;return _normalize(["Buscar par categorías"])};fn.source="Buscar par categorías";return fn;})(),
    "disableCategory": (()=>{const fn=(ctx) => {const { normalize: _normalize } = ctx;return _normalize(["Eliminar la categoría"])};fn.source="Eliminar la categoría";return fn;})()
  },
  "dateRange": {
    "from_to": (()=>{const fn=(ctx) => {const { normalize: _normalize, interpolate: _interpolate, named: _named } = ctx;return _normalize(["Desde ", _interpolate(_named("from")), " hasta ", _interpolate(_named("to")), ", ", _interpolate(_named("duration")), " día(s)"])};fn.source="Desde {from} hasta {to}, {duration} día(s)";return fn;})(),
    "from": (()=>{const fn=(ctx) => {const { normalize: _normalize, interpolate: _interpolate, named: _named } = ctx;return _normalize(["Desde ", _interpolate(_named("from"))])};fn.source="Desde {from}";return fn;})(),
    "to": (()=>{const fn=(ctx) => {const { normalize: _normalize, interpolate: _interpolate, named: _named } = ctx;return _normalize(["Hasta ", _interpolate(_named("to"))])};fn.source="Hasta {to}";return fn;})(),
    "on": (()=>{const fn=(ctx) => {const { normalize: _normalize, interpolate: _interpolate, named: _named } = ctx;return _normalize(["El ", _interpolate(_named("on"))])};fn.source="El {on}";return fn;})()
  },
  "openingHours": {
    "opened": (()=>{const fn=(ctx) => {const { normalize: _normalize } = ctx;return _normalize(["Actualmente abierto"])};fn.source="Actualmente abierto";return fn;})(),
    "closeAt": (()=>{const fn=(ctx) => {const { normalize: _normalize } = ctx;return _normalize(["Cierra"])};fn.source="Cierra";return fn;})(),
    "closed": (()=>{const fn=(ctx) => {const { normalize: _normalize } = ctx;return _normalize(["Actualmente cerrado"])};fn.source="Actualmente cerrado";return fn;})(),
    "openAt": (()=>{const fn=(ctx) => {const { normalize: _normalize } = ctx;return _normalize(["Abre"])};fn.source="Abre";return fn;})(),
    "next": (()=>{const fn=(ctx) => {const { normalize: _normalize } = ctx;return _normalize(["Siguiente"])};fn.source="Siguiente";return fn;})(),
    "formatDayAndDayInMonth": (()=>{const fn=(ctx) => {const { normalize: _normalize } = ctx;return _normalize(["EEE d :"])};fn.source="EEE d :";return fn;})(),
    "variableWeek": (()=>{const fn=(ctx) => {const { normalize: _normalize } = ctx;return _normalize(["Los horarios pueden variar de una semana a otra."])};fn.source="Los horarios pueden variar de una semana a otra.";return fn;})()
  },
  "poiCard": {
    "details": (()=>{const fn=(ctx) => {const { normalize: _normalize } = ctx;return _normalize(["Detalles"])};fn.source="Detalles";return fn;})(),
    "seeDetail": (()=>{const fn=(ctx) => {const { normalize: _normalize } = ctx;return _normalize(["Ver el detalle"])};fn.source="Ver el detalle";return fn;})(),
    "route": (()=>{const fn=(ctx) => {const { normalize: _normalize } = ctx;return _normalize(["Ruta"])};fn.source="Ruta";return fn;})(),
    "explore": (()=>{const fn=(ctx) => {const { normalize: _normalize } = ctx;return _normalize(["Cercano"])};fn.source="Cercano";return fn;})(),
    "favorite": (()=>{const fn=(ctx) => {const { normalize: _normalize } = ctx;return _normalize(["Favorito"])};fn.source="Favorito";return fn;})(),
    "favoriteOn": (()=>{const fn=(ctx) => {const { normalize: _normalize } = ctx;return _normalize(["Poner como favorito"])};fn.source="Poner como favorito";return fn;})(),
    "favoriteOff": (()=>{const fn=(ctx) => {const { normalize: _normalize } = ctx;return _normalize(["Eliminar favorito"])};fn.source="Eliminar favorito";return fn;})(),
    "findRoute": (()=>{const fn=(ctx) => {const { normalize: _normalize } = ctx;return _normalize(["Buscar la ruta a este lugar"])};fn.source="Buscar la ruta a este lugar";return fn;})(),
    "unactivateExplore": (()=>{const fn=(ctx) => {const { normalize: _normalize } = ctx;return _normalize(["Desactivar la exploración de las cercanías"])};fn.source="Desactivar la exploración de las cercanías";return fn;})(),
    "activateExplore": (()=>{const fn=(ctx) => {const { normalize: _normalize } = ctx;return _normalize(["Explora los puntos de interés cercanos"])};fn.source="Explora los puntos de interés cercanos";return fn;})(),
    "zoom": (()=>{const fn=(ctx) => {const { normalize: _normalize } = ctx;return _normalize(["Acercarse"])};fn.source="Acercarse";return fn;})(),
    "backToMap": (()=>{const fn=(ctx) => {const { normalize: _normalize } = ctx;return _normalize(["Go to map"])};fn.source="Go to map";return fn;})(),
    "thumbnail": (()=>{const fn=(ctx) => {const { normalize: _normalize } = ctx;return _normalize(["Miniatura"])};fn.source="Miniatura";return fn;})(),
    "image": (()=>{const fn=(ctx) => {const { normalize: _normalize } = ctx;return _normalize(["Ilustración"])};fn.source="Ilustración";return fn;})()
  },
  "poiDetails": {
    "headerDescription": (()=>{const fn=(ctx) => {const { normalize: _normalize } = ctx;return _normalize(["Descripción"])};fn.source="Descripción";return fn;})(),
    "headerDownload": (()=>{const fn=(ctx) => {const { normalize: _normalize } = ctx;return _normalize(["Archivos a descargar"])};fn.source="Archivos a descargar";return fn;})(),
    "lastUpdate": (()=>{const fn=(ctx) => {const { normalize: _normalize } = ctx;return _normalize(["Último cambio"])};fn.source="Último cambio";return fn;})(),
    "headerContacts": (()=>{const fn=(ctx) => {const { normalize: _normalize } = ctx;return _normalize(["Contacto"])};fn.source="Contacto";return fn;})(),
    "shareFacebook": (()=>{const fn=(ctx) => {const { normalize: _normalize } = ctx;return _normalize(["Compartir en Facebook"])};fn.source="Compartir en Facebook";return fn;})(),
    "shareTwitter": (()=>{const fn=(ctx) => {const { normalize: _normalize } = ctx;return _normalize(["Compartir en Twitter"])};fn.source="Compartir en Twitter";return fn;})(),
    "shareWhatsApp": (()=>{const fn=(ctx) => {const { normalize: _normalize } = ctx;return _normalize(["Compartir en WhatsApp"])};fn.source="Compartir en WhatsApp";return fn;})(),
    "print": (()=>{const fn=(ctx) => {const { normalize: _normalize } = ctx;return _normalize(["Imprimir"])};fn.source="Imprimir";return fn;})(),
    "link": (()=>{const fn=(ctx) => {const { normalize: _normalize } = ctx;return _normalize(["Compartir enlace"])};fn.source="Compartir enlace";return fn;})(),
    "qrcode": (()=>{const fn=(ctx) => {const { normalize: _normalize } = ctx;return _normalize(["Compartir en QR-Code"])};fn.source="Compartir en QR-Code";return fn;})(),
    "poweredBy": (()=>{const fn=(ctx) => {const { normalize: _normalize } = ctx;return _normalize(["Con la tecnología de"])};fn.source="Con la tecnología de";return fn;})(),
    "mapillaryExplore": (()=>{const fn=(ctx) => {const { normalize: _normalize } = ctx;return _normalize(["Explorar en Mapillary"])};fn.source="Explorar en Mapillary";return fn;})(),
    "informations": (()=>{const fn=(ctx) => {const { normalize: _normalize } = ctx;return _normalize(["Informaciones"])};fn.source="Informaciones";return fn;})(),
    "downloadGPX": (()=>{const fn=(ctx) => {const { normalize: _normalize } = ctx;return _normalize(["La ruta (pista GPS) en formato GPX"])};fn.source="La ruta (pista GPS) en formato GPX";return fn;})(),
    "downloadPDF": (()=>{const fn=(ctx) => {const { normalize: _normalize } = ctx;return _normalize(["La hoja completa en formato PDF"])};fn.source="La hoja completa en formato PDF";return fn;})(),
    "routes": {
      "waypoints": (()=>{const fn=(ctx) => {const { normalize: _normalize } = ctx;return _normalize(["Puntos de ruta"])};fn.source="Puntos de ruta";return fn;})(),
      "pois": (()=>{const fn=(ctx) => {const { normalize: _normalize } = ctx;return _normalize(["Puntos de interés"])};fn.source="Puntos de interés";return fn;})()
    }
  },
  "poisTable": {
    "empty": (()=>{const fn=(ctx) => {const { normalize: _normalize } = ctx;return _normalize(["Lista vacía"])};fn.source="Lista vacía";return fn;})(),
    "details": (()=>{const fn=(ctx) => {const { normalize: _normalize } = ctx;return _normalize(["Detalles"])};fn.source="Detalles";return fn;})(),
    "downloadCsv": (()=>{const fn=(ctx) => {const { normalize: _normalize } = ctx;return _normalize(["Descargar como CSV"])};fn.source="Descargar como CSV";return fn;})(),
    "downloadGeojson": (()=>{const fn=(ctx) => {const { normalize: _normalize } = ctx;return _normalize(["Descargar como GeoJSON"])};fn.source="Descargar como GeoJSON";return fn;})(),
    "showOnMap": (()=>{const fn=(ctx) => {const { normalize: _normalize } = ctx;return _normalize(["Mostrar en el mapa"])};fn.source="Mostrar en el mapa";return fn;})()
  },
  "categorySelector": {
    "placeholder": (()=>{const fn=(ctx) => {const { normalize: _normalize } = ctx;return _normalize(["Seleccione una categoría"])};fn.source="Seleccione una categoría";return fn;})(),
    "search": (()=>{const fn=(ctx) => {const { normalize: _normalize } = ctx;return _normalize(["Buscar en la lista"])};fn.source="Buscar en la lista";return fn;})()
  },
  "dateFilter": {
    "today": (()=>{const fn=(ctx) => {const { normalize: _normalize } = ctx;return _normalize(["Hoy"])};fn.source="Hoy";return fn;})(),
    "tomorrow": (()=>{const fn=(ctx) => {const { normalize: _normalize } = ctx;return _normalize(["Mañana"])};fn.source="Mañana";return fn;})(),
    "thisWeekend": (()=>{const fn=(ctx) => {const { normalize: _normalize } = ctx;return _normalize(["Este fin de semana"])};fn.source="Este fin de semana";return fn;})(),
    "nextWeek": (()=>{const fn=(ctx) => {const { normalize: _normalize } = ctx;return _normalize(["Próximos 7 días"])};fn.source="Próximos 7 días";return fn;})(),
    "nextMonth": (()=>{const fn=(ctx) => {const { normalize: _normalize } = ctx;return _normalize(["Próximos 30 días"])};fn.source="Próximos 30 días";return fn;})()
  },
  "listFilter": {
    "label": (()=>{const fn=(ctx) => {const { normalize: _normalize } = ctx;return _normalize(["Busca o añade un valor"])};fn.source="Busca o añade un valor";return fn;})()
  },
  "fields": {
    "phone": {
      "callNumber": (()=>{const fn=(ctx) => {const { normalize: _normalize } = ctx;return _normalize(["Llama a este número"])};fn.source="Llama a este número";return fn;})()
    },
    "stars": {
      "label": (()=>{const fn=(ctx) => {const { normalize: _normalize } = ctx;return _normalize(["Estrellas"])};fn.source="Estrellas";return fn;})()
    },
    "route": {
      "difficulty": (()=>{const fn=(ctx) => {const { normalize: _normalize } = ctx;return _normalize(["Dificultad:"])};fn.source="Dificultad:";return fn;})(),
      "length": (()=>{const fn=(ctx) => {const { normalize: _normalize } = ctx;return _normalize(["Distancia:"])};fn.source="Distancia:";return fn;})(),
      "duration": (()=>{const fn=(ctx) => {const { normalize: _normalize } = ctx;return _normalize(["Duración:"])};fn.source="Duración:";return fn;})(),
      "difficulties": {
        "easy": (()=>{const fn=(ctx) => {const { normalize: _normalize } = ctx;return _normalize(["fácil"])};fn.source="fácil";return fn;})(),
        "normal": (()=>{const fn=(ctx) => {const { normalize: _normalize } = ctx;return _normalize(["normal"])};fn.source="normal";return fn;})(),
        "hard": (()=>{const fn=(ctx) => {const { normalize: _normalize } = ctx;return _normalize(["difícil"])};fn.source="difícil";return fn;})()
      }
    }
  },
  "cookiesConsent": {
    "accept": (()=>{const fn=(ctx) => {const { normalize: _normalize } = ctx;return _normalize(["Aceptar"])};fn.source="Aceptar";return fn;})(),
    "details": (()=>{const fn=(ctx) => {const { normalize: _normalize } = ctx;return _normalize(["Más información"])};fn.source="Más información";return fn;})(),
    "decline": (()=>{const fn=(ctx) => {const { normalize: _normalize } = ctx;return _normalize(["Descenso"])};fn.source="Descenso";return fn;})()
  }
};

export { resource as default };
