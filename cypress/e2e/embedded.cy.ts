import poisCategory22 from '../fixtures/teritorio/references/pois/category/22.json'
import { mockSSRAPI } from '../support/mock'

import teritorioReferenceAPIFixture from '~/cypress/fixtures/teritorio/references/teritorioReferenceAPIFixture'

const hostnames = {
  'https://dev.appcarto.teritorio.xyz':
    '/content/api.teritorio/geodata/v0.1/dev/tourism/',
  'http://localhost:3000': '/fixtures/teritorio/references/',
}

describe('pois table', () => {
  beforeEach(() => {
    mockSSRAPI(hostnames, teritorioReferenceAPIFixture)
    cy.viewport(1024, 768)
    cy.visit('/embedded')
  })

  it('contain basic table', () => {
    cy.intercept(
      '/content/api.teritorio/geodata/v0.1/dev/tourism/pois/category/22.geojson?geometry_as=point&short_description=true',
      { body: poisCategory22 }
    )

    cy.get('.category-selector').click()
    cy.contains('Aire de passage', { timeout: 30000 }).click({ timeout: 30000 })

    cy.get('#m1', { timeout: 30000 }).click()
    cy.url().should('include', `/embedded/22/1`)

    cy.get('#selected-category-22 button').click()
    cy.url().should('include', `/embedded/1`)

    cy.htmlvalidate()
  })
})
