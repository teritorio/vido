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
      'pois.geojson?ids=1&geometry_as=undefined&short_description=true':
        teritorioReferenceAPIFixture.deps[1],
    })
    cy.viewport(1024, 768)
    cy.visit('/pois/1/map')
  })

  it('contain map and poi', () => {
    cy.get('#1')

    cy.htmlvalidate()
  })
})
