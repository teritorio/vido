import poisCategory22 from '../../fixtures/teritorio/references/pois/category/22.json'
import { mockSSRAPI } from '../../support/mock'
import type { ApiPois } from '~/lib/apiPois'

import teritorioReferenceAPIFixture from '~/cypress/fixtures/teritorio/references/teritorioReferenceAPIFixture'

const hostnames = {
  'https://dev.appcarto.teritorio.xyz':
    '/content/api.teritorio/geodata/v0.1/dev/tourism/',
  'http://127.0.0.1:3000': '/fixtures/teritorio/references/',
}

describe('pois table', () => {
  beforeEach(() => {
    mockSSRAPI(hostnames, teritorioReferenceAPIFixture, {
      // ?geometry_as=point&short_description=true
      'pois/category/211.geojson': teritorioReferenceAPIFixture.deps[1],
    })
    cy.viewport(1024, 768)
    cy.visit('/category/211')
  })

  it('contain basic table', () => {
    const pois = teritorioReferenceAPIFixture.pois as ApiPois
    if (pois.features[0].properties.editorial && pois.features[0].properties.editorial.list_fields) {
      cy.get('th')
        .contains(pois.features[0].properties.editorial.list_fields[0].field as string)
    }

    cy.get('td')
      .contains(teritorioReferenceAPIFixture.pois.features[0].properties.name as string)

    cy.htmlvalidate()
  })

  it('should be interative', () => {
    cy.intercept(
      '/content/api.teritorio/geodata/v0.1/dev/tourism/pois/category/22.geojson?geometry_as=point&short_description=true',
      { body: poisCategory22 },
    )

    cy.get('.category-selector').wait(1000).click()
    cy.contains('Aire de passage', { timeout: 30000 }).click()

    cy.get('th').contains(
      poisCategory22.features[0].properties.editorial.list_fields[0].field,
    )
    cy.get('td').contains(poisCategory22.features[0].properties.name)

    // Unselect the selector before validate
    cy.get('body').click()

    cy.htmlvalidate()
  })
})
