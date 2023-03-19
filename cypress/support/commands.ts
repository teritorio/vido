/// <reference types="cypress" />

// @ts-ignore
declare global {
  namespace Cypress {
    interface Chainable {
      clearSSRMocks: () => void
    }
  }
}

// @ts-ignore
Cypress.Commands.add('clearSSRMocks', () => {
  cy.request('/__cypress_clear_mocks')
})

after(() => {
  // @ts-ignore
  cy.clearSSRMocks()
})
