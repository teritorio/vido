import { mockSSRAPI } from '../support/mock'

import teritorioReferenceAPIFixture from '~/cypress/fixtures/teritorio/references/teritorioReferenceAPIFixture'
const hostnames = {
  'https://dev.appcarto.teritorio.xyz':
    '/content/api.teritorio/geodata/v0.1/dev/tourism/',
  'http://localhost:3000': '/fixtures/teritorio/references/',
}

describe('home content', () => {
  before(() => {
    mockSSRAPI(hostnames, teritorioReferenceAPIFixture)
    cy.intercept(
      '/content/api.teritorio/geodata/v0.1/dev/tourism/pois.geojson?ids=583477748&geometry_as=bbox&short_description=true',
      {
        body: {
          type: 'FeatureCollection',
          features: [
            {
              type: 'Feature',
              geometry: {
                type: 'Point',
                coordinates: [-0.6520984, 44.0464572],
              },
              properties: {
                name: 'Cercle des associations',
                classe: 'Bars - tous',
                tis_id: 'LOIAQU040V50GS25',
                'teritorio:url': [
                  'https://www.tourismelandes.com/wp-json/irisit/link/LOIAQU040V50GS25',
                ],
                tis_SyndicObjectID: 'LOIAQU040V50GS25',
                tis_SyndicObjectName: 'Cercle des associations',
                tis_ObjectTypeName: ['Equipements de loisirs'],
                'addr:street': 'le bourg',
                'addr:postcode': '40420',
                phone: ['+33 5 59 42 92 13'],
                mobile: ['http://cercles-gascogne.fr/garein/'],
                email: ['cercledesassociations@gmail.com'],
                website: ['http://cercles-gascogne.fr/garein/'],
                'addr:city': 'GAREIN',
                tis_COMMUNEINSEE: '40105',
                tis_LAT: '44.0464572',
                tis_LON: '-0.6520984',
                tis_NOMOFFRE: 'Cercle des associations',
                metadata: {
                  id: 32542,
                  category_ids: [8250],
                  source: 'tis',
                },
                display: {
                  icon: 'teritorio teritorio-bar',
                  style_class: ['catering', 'catering_drink', 'bar'],
                  color_fill: '#f5b700',
                  color_line: '#f5b700',
                },
                editorial: {
                  list_fields: [
                    {
                      field: 'name',
                    },
                    {
                      field: 'phone',
                    },
                    {
                      field: 'email',
                    },
                    {
                      field: 'website',
                    },
                  ],
                  popup_fields: [
                    {
                      field: 'addr',
                    },
                    {
                      field: 'phone',
                    },
                    {
                      field: 'mobile',
                    },
                  ],
                  class_label: {
                    fr: 'Bars - tous',
                  },
                  class_label_popup: {
                    fr: 'Bar',
                  },
                  class_label_details: {
                    fr: 'Bar',
                  },
                  'website:details':
                    'https://www.tourismelandes.com/wp-json/irisit/link/LOIAQU040V50GS25',
                },
                description:
                  "Résultat de la volonté d'une poignée de bénévoles, le Cercle des Associations est créé en janvier 2009 et s'installe dans…",
                image: [
                  'https://cdt40.tourinsoft.com/upload/cercle-des-asso-de-garein-credit-fede-des-cercles.jpg',
                ],
              },
            },
            {
              type: 'Feature',
              geometry: {
                type: 'Point',
                coordinates: [-0.9158124, 43.9174147],
              },
              properties: {
                name: 'Restaurant La Villa Pomade',
                classe: 'Bars - tous',
                tis_id: 'RESAQU040V50SPWX',
                'teritorio:url': [
                  'https://www.tourismelandes.com/wp-json/irisit/link/RESAQU040V50SPWX',
                ],
                tis_SyndicObjectID: 'RESAQU040V50SPWX',
                tis_SyndicObjectName: 'Restaurant La Villa Pomade',
                tis_ObjectTypeName: ['Restauration'],
                'addr:street': "178 Avenue d'Albret",
                'addr:postcode': '40370',
                phone: ['+33 5 58 47 25 76'],
                'addr:city': 'RION-DES-LANDES',
                tis_COMMUNEINSEE: '40243',
                tis_LAT: '43.9174147',
                tis_LON: '-0.9158124',
                tis_NOMOFFRE: 'Restaurant La Villa Pomade',
                metadata: {
                  id: 283446,
                  category_ids: [8250],
                  source: 'tis',
                },
                display: {
                  icon: 'teritorio teritorio-bar',
                  style_class: ['catering', 'catering_drink', 'bar'],
                  color_fill: '#f5b700',
                  color_line: '#f5b700',
                },
                editorial: {
                  list_fields: [
                    {
                      field: 'name',
                    },
                    {
                      field: 'phone',
                    },
                    {
                      field: 'email',
                    },
                    {
                      field: 'website',
                    },
                  ],
                  popup_fields: [
                    {
                      field: 'addr',
                    },
                    {
                      field: 'phone',
                    },
                    {
                      field: 'mobile',
                    },
                  ],
                  class_label: {
                    fr: 'Bars - tous',
                  },
                  class_label_popup: {
                    fr: 'Bar',
                  },
                  class_label_details: {
                    fr: 'Bar',
                  },
                  'website:details':
                    'https://www.tourismelandes.com/wp-json/irisit/link/RESAQU040V50SPWX',
                },
                description:
                  "Au sein d'une ancienne demeure, l'hôtel restaurant de la Villa Pomade vous accueille dans un décor fraichement rénové. Dégustez une…",
                image: [
                  'https://cdt40.tourinsoft.com/upload/6048E1ED-3A00-4E17-B61F-0B64F7312203.JPG',
                  'https://cdt40.tourinsoft.com/upload/0575C148-2A9D-4084-A06F-8350CBFC5AE8.JPG',
                  'https://cdt40.tourinsoft.com/upload/66376497452--1CD21E40-ED00-4AA5-874B-DC07D08D6DAB.jpg',
                ],
              },
            },
            {
              type: 'Feature',
              geometry: {
                type: 'Point',
                coordinates: [-0.5941715, 43.6548179],
              },
              properties: {
                name: 'Restaurant Le Relais Basque',
                classe: 'Bars - tous',
                tis_id: 'RESAQU04001OC14B',
                'teritorio:url': [
                  'https://www.tourismelandes.com/wp-json/irisit/link/RESAQU04001OC14B',
                ],
                tis_SyndicObjectID: 'RESAQU04001OC14B',
                tis_SyndicObjectName: 'Restaurant Le Relais Basque',
                tis_ObjectTypeName: ['Restauration'],
                'addr:street': '3 rue Pascal Duprat',
                'addr:postcode': '40700',
                phone: ['+33 5 58 45 81 86'],
                mobile: ['https://www.lerelaisbasque.fr'],
                email: ['relaisbasque@laposte.net'],
                website: ['https://www.lerelaisbasque.fr'],
                'addr:city': 'HAGETMAU',
                tis_COMMUNEINSEE: '40119',
                tis_LAT: '43.6548179',
                tis_LON: '-0.5941715',
                tis_NOMOFFRE: 'Restaurant Le Relais Basque',
                metadata: {
                  id: 767304,
                  category_ids: [8250],
                  source: 'tis',
                },
                display: {
                  icon: 'teritorio teritorio-bar',
                  style_class: ['catering', 'catering_drink', 'bar'],
                  color_fill: '#f5b700',
                  color_line: '#f5b700',
                },
                editorial: {
                  list_fields: [
                    {
                      field: 'name',
                    },
                    {
                      field: 'phone',
                    },
                    {
                      field: 'email',
                    },
                    {
                      field: 'website',
                    },
                  ],
                  popup_fields: [
                    {
                      field: 'addr',
                    },
                    {
                      field: 'phone',
                    },
                    {
                      field: 'mobile',
                    },
                  ],
                  class_label: {
                    fr: 'Bars - tous',
                  },
                  class_label_popup: {
                    fr: 'Bar',
                  },
                  class_label_details: {
                    fr: 'Bar',
                  },
                  'website:details':
                    'https://www.tourismelandes.com/wp-json/irisit/link/RESAQU04001OC14B',
                },
                description:
                  'Situé en centre ville, il vous offre dans un cadre traditionnel des plats typés à base de produits locaux. Accueil…',
                image: [
                  'https://cdt40.tourinsoft.com/upload/Le-Relais-Basque-4.jpg',
                  'https://cdt40.tourinsoft.com/upload/Assiette-Relais-Basque.jpg',
                ],
              },
            },
            {
              type: 'Feature',
              geometry: {
                type: 'Point',
                coordinates: [-0.375399, 43.575117],
              },
              properties: {
                name: 'Pimbo Gourmand',
                classe: 'Bars - tous',
                tis_id: 'RESAQU040V50H1NE',
                'teritorio:url': [
                  'https://www.tourismelandes.com/wp-json/irisit/link/RESAQU040V50H1NE',
                ],
                tis_SyndicObjectID: 'RESAQU040V50H1NE',
                tis_SyndicObjectName: 'Pimbo Gourmand',
                tis_ObjectTypeName: ['Restauration'],
                'addr:street': '325 rue de la bastide',
                'addr:postcode': '40320',
                phone: ['+33 5 58 44 46 57'],
                mobile: ['http://pimbo.fr'],
                email: ['gitedepimbo@hotmail.fr'],
                website: ['http://pimbo.fr'],
                'addr:city': 'PIMBO',
                tis_COMMUNEINSEE: '40226',
                tis_LAT: '43.5751170',
                tis_LON: '-0.3753990',
                tis_NOMOFFRE: 'Pimbo Gourmand',
                metadata: {
                  id: 767352,
                  category_ids: [8250],
                  source: 'tis',
                },
                display: {
                  icon: 'teritorio teritorio-bar',
                  style_class: ['catering', 'catering_drink', 'bar'],
                  color_fill: '#f5b700',
                  color_line: '#f5b700',
                },
                editorial: {
                  list_fields: [
                    {
                      field: 'name',
                    },
                    {
                      field: 'phone',
                    },
                    {
                      field: 'email',
                    },
                    {
                      field: 'website',
                    },
                  ],
                  popup_fields: [
                    {
                      field: 'addr',
                    },
                    {
                      field: 'phone',
                    },
                    {
                      field: 'mobile',
                    },
                  ],
                  class_label: {
                    fr: 'Bars - tous',
                  },
                  class_label_popup: {
                    fr: 'Bar',
                  },
                  class_label_details: {
                    fr: 'Bar',
                  },
                  'website:details':
                    'https://www.tourismelandes.com/wp-json/irisit/link/RESAQU040V50H1NE',
                },
                description:
                  'La commune de Pimbo a désormais son restaurant ! Le chef, talentueux et créatif, est aux commandes et propose plat…',
                image: [
                  'https://cdt40.tourinsoft.com/upload/Pimbo-Gourmand.jpg',
                  'https://cdt40.tourinsoft.com/upload/IMG-3812-2.JPG',
                  'https://cdt40.tourinsoft.com/upload/Collegiale-Pimbo.jpg',
                  'https://cdt40.tourinsoft.com/upload/IMG-3810-2.JPG',
                  'https://cdt40.tourinsoft.com/upload/logo-pimbo-gourmand-2.png',
                ],
              },
            },
          ],
          sp_tags: [],
        },
      }
    )

    cy.viewport(1024, 768)
    cy.visit('/')
  })

  /**
   * default state without favourites
   */
  it('favourtites burger menu should be disabled without favs by default', () => {
    cy.get('#favourites_counter').should('not.exist')

    cy.get('#button_burger_favourites_notebook')
      .should('be.visible')
      .should('be.disabled')

    cy.htmlvalidate()
  })
  /**
   * then add some favourites,
   * browse the favourites notebook
   * check for the list of favourites, available actions and closing of the notebook
   */
  it('with some favourites, check the favourites notebook', () => {
    cy.get('#favourites_counter').should('not.exist')

    cy.visit('/#mode=favorites&favs=32542')

    cy.get('#favourites_counter').contains('1')
    cy.get('#button_burger_favourites_notebook')
      .should('be.visible')
      .should('not.be.disabled')
      .click()

    cy.get('#favourite_notebook').should('exist')
    cy.get('.menu-actions').should('exist')
    cy.get('#PoiCard-32542').should('exist')

    cy.get('#close_button_favourite_notebook').should('exist').click()
    cy.get('#favourite_notebook').should('not.exist')

    cy.htmlvalidate()
  })
})
