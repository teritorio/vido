import { mockSSRAPI } from '../support/mock'

import teritorioReferenceAPIFixture from '~/cypress/fixtures/teritorio/references/teritorioReferenceAPIFixture'
const hostnames = {
  'https://dev.appcarto.teritorio.xyz':
    '/content/api.teritorio/geodata/v0.1/dev/tourism/',
  'http://localhost:3000': '/fixtures/teritorio/references/',
}

describe('home content', () => {
  before(() => {
    mockSSRAPI(hostnames, teritorioReferenceAPIFixture)
    cy.viewport(1024, 768)
    cy.visit('/#favs=1')
  })

  /**
   * then add some favourites,
   * browse the favourites notebook
   * check for the list of favourites, available actions and closing of the notebook
   */
  it('with some favourites, check the favourites notebook', () => {
    cy.get('#favourites_counter').contains('1')
    cy.get('#button_burger_favourites_notebook')
      .should('be.visible')
      .should('not.be.disabled')
      .click()

    cy.get('#favourite_notebook').should('exist')
    cy.get('.menu-actions').should('exist')
    cy.get('#PoiCard-1', { timeout: 30000 }).should('exist')

    cy.get('#close_button_favourite_notebook').should('exist').click()
    cy.get('#favourite_notebook').should('not.exist')

    cy.htmlvalidate()
  })
})
