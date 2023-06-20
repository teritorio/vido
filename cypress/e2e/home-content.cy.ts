import { mockSSRAPI } from '../support/mock'

import teritorioReferenceAPIFixture from '~/cypress/fixtures/teritorio/references/teritorioReferenceAPIFixture'

const hostnames = {
  'https://dev.appcarto.teritorio.xyz':
    '/content/api.teritorio/geodata/v0.1/dev/tourism/',
  'http://127.0.0.1:3000': '/fixtures/teritorio/references/',
}

describe('home content', () => {
  beforeEach(() => {
    mockSSRAPI(hostnames, teritorioReferenceAPIFixture)
    cy.viewport(1024, 768)
    cy.visit('/')
  })

  // cy.url().should('include', '#map=')

  it('usage map', () => {
    cy.get('#background-selector-map-vector').click()

    cy.intercept(
      'https://merge-proxy-dev.teritorio.xyz/styles/teritorio-bicycle-tourism/style.json?*'
    ).as('style-bicycle')
    cy.get('#background-selector-map-bicycle', { timeout: 20000 }).click()
    // cy.wait('@style-bicycle').its('response.statusCode').should('eq', 200)

    cy.intercept(
      'https://merge-proxy-dev.teritorio.xyz/styles/satellite-hybrid/style.json?*'
    ).as('style-satellite')
    cy.get('#background-selector-map-aerial').click()
    // cy.wait('@style-satellite').its('response.statusCode').should('eq', 200)

    // Use 3D on aerial
    cy.get('#3D-selector-map').click()

    cy.htmlvalidate()
  })

  it('bugger menu content entry item', () => {
    cy.get('#nav-menu button').click()
    cy.get('#nav-menu-dropdown').contains(
      teritorioReferenceAPIFixture.articles[0].title
    )

    cy.htmlvalidate()
  })
})
