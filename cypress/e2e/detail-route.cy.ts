import { mockSSRAPI } from './mock'

import teritorioReferenceAPIFixture from '~/cypress/fixtures/teritorio/references/teritorioReferenceAPIFixture'

const hostname = 'https://dev.appcarto.teritorio.xyz'

describe('home content', () => {
  before(() => {
    mockSSRAPI(hostname, teritorioReferenceAPIFixture, {
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

    cy.get('#FieldsGroup-download')
      // @ts-ignore
      .contains('download')

    // Check for descript on right column
    cy.get('.detail-right #FieldsGroup-description')

    // Waypoint
    cy.get('#PoiCardLight-10002')

    // POI
    cy.get('#PoiCardLight-1')
  })
})
