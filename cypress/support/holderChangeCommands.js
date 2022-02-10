Cypress.Commands.add('identifyHolder', (holderVat, statusCode = 200) => {
  cy.intercept('GET', '/check/vat/exists/**').as('checkVat')

  cy.get('[name="holder.vat"]').type(holderVat).should('have.value', holderVat)

  cy.wait('@checkVat')
    .its('response.statusCode')
    .should('be.oneOf', [200, 304, statusCode])
})

Cypress.Commands.add('identifyHCSupplyPoint', (cups) => {
  cy.intercept('GET', '/check/cups/**').as('checkCups')

  cy.get('#cups').clear().type(cups).should('have.value', cups)

  cy.wait('@checkCups')
    .its('response.statusCode')
    .should('be.oneOf', [200, 304])
})
