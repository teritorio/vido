Cypress.Commands.add('clearSSRMocks', () => {
  cy.request('POST', '/__cypress_set_mocks', [])
})

after(() => {
  cy.clearSSRMocks()
})
