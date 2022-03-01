Cypress.Commands.add('identifyHolder', (holderVat, statusCode = 200) => {
  cy.intercept('GET', '/check/vat/exists/**').as('checkVat')

  cy.get('[name="holder.vat"]').type(holderVat).should('have.value', holderVat)

  cy.wait('@checkVat')
    .its('response.statusCode')
    .should('be.oneOf', [200, 304, statusCode])
})

Cypress.Commands.add(
  'holderChangeIdentSupplyPoint',
  (cups, statusCode = 200) => {
    cy.intercept('GET', '/check/cups/**').as('checkCups')

    cy.get('#cups').clear().type(cups).should('have.value', cups)

    cy.wait('@checkCups')
      .its('response.statusCode')
      .should('be.oneOf', [200, 30, statusCode])

    cy.get('[name="supply_point_accepted"]').click()
    cy.get('[data-cy=accept]').click()

    cy.get('[name="supply_point.verified"]').click()
  }
)

Cypress.Commands.add('holderChangePersonalData', (data) => {
  cy.get('[name="holder.name"]').type(data.name).should('have.value', data.name)

  cy.get('[name="holder.surname1"]')
    .type(data.surname1)
    .should('have.value', data.surname1)

  cy.get('[name="holder.surname2"]')
    .type(data.surname2)
    .should('have.value', data.surname2)

  cy.get('[name="holder.address"]')
    .type(data.address)
    .should('have.value', data.address)

  cy.get('[name="holder.number"]')
    .type(data.number)
    .should('have.value', data.number)

  cy.get('[name="holder.postal_code"]')
    .type(data.postalCode)
    .should('have.value', data.postalCode)

  /*
  * Postal code autocomplete state and city codes
  cy.get('#holder_state').click()
  cy.get(`[data-value="${data.stateCode}"]`).click()

  cy.get('#holder_city').click()
  cy.get(`[data-value="${data.cityCode}"]`).click()
  */

  cy.get('[name="holder.email"]')
    .type(data.email)
    .should('have.value', data.email)

  cy.get('[name="holder.email2"]')
    .type(data.email)
    .should('have.value', data.email)

  cy.get('[name="holder.phone1"]')
    .type(data.phone)
    .should('have.value', data.phone)

  cy.get('#holder_lang').click()
  cy.get('[data-value="ca_ES"]').click()

  cy.get('[name="privacy_policy_accepted"]').click()
})
