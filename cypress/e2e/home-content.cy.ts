import { mockSSRAPI } from './mock'

import teritorioReferenceAPIFixture from '~/cypress/fixtures/teritorio/references/teritorioReferenceAPIFixture'

const hostname = 'https://dev.appcarto.teritorio.xyz'

describe('home content', () => {
  before(() => {
    mockSSRAPI(hostname, teritorioReferenceAPIFixture)
    cy.visit('/')
  })

  // cy.url().should('include', '#map=')

  it('usage map', () => {
    cy.get('#background-selector-map-vector').click()

    cy.intercept(
      'https://merge-proxy-dev.teritorio.xyz/styles/teritorio-bicycle-tourism/style.json?*'
    ).as('style-bicycle')
    cy.get('#background-selector-map-bicycle').click()
    cy.wait('@style-bicycle').its('response.statusCode').should('eq', 200)

    cy.intercept(
      'https://merge-proxy-dev.teritorio.xyz/styles/satellite-hybrid/style.json?*'
    ).as('style-satellite')
    cy.get('#background-selector-map-aerial').click()
    cy.wait('@style-satellite').its('response.statusCode').should('eq', 200)

    // Use 3D on aerial
    cy.get('#3D-selector-map').click()
  })

  it('bugger menu content entry item', () => {
    cy.get('#nav-menu')
      .click()
      .contains(teritorioReferenceAPIFixture.articles[0].title)
    cy.get('#nav-menu')
      .click()
      .contains(teritorioReferenceAPIFixture.articles[0].title)
      .should('not.exist')
  })
})
