import { mockSSRAPI } from '../../support/mock'
import teritorioReferenceAPIFixture from '../../fixtures/teritorio/references/teritorioReferenceAPIFixture'

const hostnames = {
  'https://dev.appcarto.teritorio.xyz':
    '/content/api.teritorio/geodata/v0.1/dev/tourism/',
  'http://127.0.0.1:3000': '/fixtures/teritorio/references/',
}

describe('home content', () => {
  beforeEach(() => {
    mockSSRAPI(hostnames, teritorioReferenceAPIFixture, {
      // ?geometry_as=bbox&short_description=false
      'poi/2/deps.geojson': teritorioReferenceAPIFixture.deps[2],
    })
    cy.viewport(1024, 768)
    cy.visit('/poi/2/details')
  })

  it('contain basic details', () => {
    cy.get('h1').contains(
      teritorioReferenceAPIFixture.deps[2].features[0].properties.name?.['fr-FR'] as string,
    )

    cy.get('#FieldsGroup--download')
      .parent()
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
