/// <reference types="cypress" />

// @ts-ignore
declare global {
  namespace Cypress {
    interface Chainable {
      mockSSR: (options?: any) => void
      clearSSRMocks: () => void
    }
  }
}

// @ts-ignore
Cypress.Commands.add('mockSSR', (payload) => {
  // @ts-ignore
  cy.request('POST', '/__cypress_server_mock', payload)
})

// @ts-ignore
Cypress.Commands.add('clearSSRMocks', () => {
  cy.request('/__cypress_clear_mocks')
})

beforeEach(() => {
  // @ts-ignore
  cy.clearSSRMocks()
})

after(() => {
  // @ts-ignore
  cy.clearSSRMocks()
})
