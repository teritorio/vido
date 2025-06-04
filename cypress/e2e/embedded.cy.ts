import poisCategory22 from '../fixtures/teritorio/references/pois/category/22.json'
import { mockSSRAPI } from '../support/mock'
import teritorioReferenceAPIFixture from '../fixtures/teritorio/references/teritorioReferenceAPIFixture'

const hostnames = {
  'https://dev.appcarto.teritorio.xyz':
    '/content/api.teritorio/geodata/v0.1/dev/tourism/',
  'http://127.0.0.1:3000': '/fixtures/teritorio/references/',
}

describe('pois table', () => {
  beforeEach(() => {
    mockSSRAPI(hostnames, teritorioReferenceAPIFixture)
    cy.viewport(1024, 768)
    cy.visit('/embedded')
  })

  it('contain basic table', () => {
    cy.intercept(
      '/content/api.teritorio/geodata/v0.1/dev/tourism/pois/category/22.geojson?geometry_as=point&short_description=false',
      { body: poisCategory22 },
    )

    cy.get('.category-selector input').wait(1000).click()
    cy.contains('Aire de passage', { timeout: 30000 }).click({ timeout: 30000 })

    cy.get('#1 ', { timeout: 30000 }).click()
    cy.url().should('include', `/embedded/22/1`)

    cy.get('[data-testid="selected-category-22"]').click()
    cy.url().should('include', `/embedded/1`)

    cy.htmlvalidate()
  })
})
