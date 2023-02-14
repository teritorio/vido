import { mockSSRAPI } from '../../support/mock'

import teritorioReferenceAPIFixture from '~/cypress/fixtures/teritorio/references/teritorioReferenceAPIFixture'

const hostnames = {
  'https://dev.appcarto.teritorio.xyz':
    '/content/api.teritorio/geodata/v0.1/dev/tourism/',
  'http://localhost:3000': '/fixtures/teritorio/references/',
}

describe('home content', () => {
  beforeEach(() => {
    mockSSRAPI(hostnames, teritorioReferenceAPIFixture, {
      'poi/2/deps.geojson?geometry_as=bbox&short_description=false':
        teritorioReferenceAPIFixture.deps[2],
    })
    cy.viewport(1024, 768)
    cy.visit('/poi/2/details')
  })

  it('contain basic details', () => {
    cy.get('h1').contains(
      // @ts-ignore
      teritorioReferenceAPIFixture.deps[2].features[0].properties.name
    )

    cy.get('#FieldsGroup--download')
      // @ts-ignore
      .contains('download')

    // Check for descript on right column
    cy.get('.detail-right #FieldsGroup--description')

    // Waypoint
    cy.get('#PoiCardLight-10002')

    // POI
    cy.get('#PoiCardLight-1')

    cy.htmlvalidate()
  })
})
