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
      'poi/1/deps.geojson': teritorioReferenceAPIFixture.deps[1],
    })
    cy.viewport(1024, 768)
    cy.visit('/poi/1/details')
  })

  it('contain basic details', () => {
    cy.get('h1').contains(
      teritorioReferenceAPIFixture.deps[1].features[0].properties.name as string,
    )

    cy.get('#FieldsGroup--contact_standard')
      .parent()
      .contains('contact_standard')

    cy.get('#FieldsGroup--contact_card')
      .parent()
      .contains('contact_card')

    cy.htmlvalidate()
  })
})
