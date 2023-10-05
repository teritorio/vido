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
  cy.request('POST', '/__cypress_set_mocks', [])
})

after(() => {
  // @ts-ignore
  cy.clearSSRMocks()
})
