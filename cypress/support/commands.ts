/// <reference types="cypress" />

// @ts-expect-error
declare global {
  namespace Cypress {
    interface Chainable {
      clearSSRMocks: () => void
    }
  }
}

// @ts-expect-error
Cypress.Commands.add('clearSSRMocks', () => {
  cy.request('POST', '/__cypress_set_mocks', [])
})

after(() => {
  // @ts-expect-error
  cy.clearSSRMocks()
})
