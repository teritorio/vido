import poi1 from '../fixtures/teritorio/references/poi/1.json'
import { mockSSRAPI } from '../support/mock'
import teritorioReferenceAPIFixture from '../fixtures/teritorio/references/teritorioReferenceAPIFixture'

const hostnames = {
  'https://dev.appcarto.teritorio.xyz':
    '/content/api.teritorio/geodata/v0.1/dev/tourism/',
  'http://127.0.0.1:3000': '/fixtures/teritorio/references/',
}

const htmlValidateRules = {
  rules: {
    'unique-landmark': 0,
  },
}

describe('home content', () => {
  beforeEach(() => {
    mockSSRAPI(hostnames, teritorioReferenceAPIFixture)
    cy.viewport(1024, 768)
    // Add some favourites,
    cy.visit('/#favs=1')
  })

  /**
   * browse the favourites notebook
   * check for the list of favourites, available actions and closing of the notebook
   */
  it('with some favourites, check the favourites notebook', () => {
    cy.get('#favourites_counter').contains('1')

    cy.intercept(
      '/content/api.teritorio/geodata/v0.1/dev/tourism/pois.geojson?ids=1&geometry_as=bbox&short_description=true',
      {
        body: {
          type: 'FeatureCollection',
          features: [poi1],
        },
      },
    )

    cy.get('#open_favourites_notebook')
      .should('be.visible')
      .should('not.be.disabled')
      .click()

    cy.get('#favourite_notebook')
    cy.get('#PoiCard-1', { timeout: 30000 })

    cy.htmlvalidate(htmlValidateRules)

    cy.get('#close_favourite_notebook').click()
    cy.get('#favourite_notebook').should('not.exist')
  })
})
