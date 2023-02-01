import { mockSSRAPI } from '../../support/mock'

import teritorioReferenceAPIFixture from '~/cypress/fixtures/teritorio/references/teritorioReferenceAPIFixture'

const hostnames = {
  'https://dev.appcarto.teritorio.xyz':
    '/content/api.teritorio/geodata/v0.1/dev/tourism/',
  'http://localhost:3000': '/fixtures/teritorio/references/',
}

describe('pois table', () => {
  before(() => {
    mockSSRAPI(hostnames, teritorioReferenceAPIFixture, {
      'pois/category/211.geojson?geometry_as=point&short_description=true':
        teritorioReferenceAPIFixture.deps[1],
    })
    cy.viewport(1024, 768)
    cy.visit('/category/211')
  })

  it('contain basic table', () => {
    cy.get('th').contains(
      // @ts-ignore
      teritorioReferenceAPIFixture.pois.features[0].properties.editorial
        .list_fields[0].field
    )

    cy.get('td')
      // @ts-ignore
      .contains(teritorioReferenceAPIFixture.pois.features[0].properties.name)

    cy.htmlvalidate()
  })
})
