Cypress.Commands.add('identifyMember', (memberNumber, memberVat) => {
  cy.intercept('GET', '/data/soci/**').as('checkMember')

  cy.get('#memberNumber')
    .clear()
    .type(memberNumber)
    .should('have.value', memberNumber)

  cy.get('#vat').clear().type(memberVat).should('have.value', memberVat)

  cy.wait('@checkMember')

  cy.get('[data-cy=next]').click()
})

Cypress.Commands.add('identifySupplyPoint', (cups, hasService) => {
  cy.intercept('GET', '/check/cups/**').as('checkCups')

  cy.get('#cups').clear().type(cups).should('have.value', cups)

  cy.wait('@checkCups')

  cy.get(`[data-value="${hasService}"]`).click()

  cy.get('[data-cy=next]').click()
})

Cypress.Commands.add('enterSupplyPointData', (supplyPoint) => {
  cy.get('#supply_point_address')
    .clear()
    .type(supplyPoint.address)
    .should('have.value', supplyPoint.address)

  cy.get('#supply_point_number')
    .clear()
    .type(supplyPoint.number)
    .should('have.value', supplyPoint.number)

  cy.get('#supply_point_postal_code')
    .clear()
    .type(supplyPoint.postalCode)
    .should('have.value', supplyPoint.postalCode)

  cy.get('#supply_point_state').click()
  cy.get(`[data-value="${supplyPoint.state}"]`).click()

  cy.get('#supply_point_city').click()
  cy.get(`[data-value="${supplyPoint.city}"]`).click()

  cy.get('#supply_point_is_housing').click()
  cy.get(`[data-value="${supplyPoint.isHousing}"]`).click()

  cy.get('#supply_point_cnae').should('have.value', supplyPoint.cnae)

  cy.get('[name="supply_point_accepted"]').click()
  cy.get('[data-cy=accept]').click()

  cy.get('[data-cy=next]').click()
})

Cypress.Commands.add('enterPowerFare', (phase, moreThan15Kw, powers) => {
  cy.get('#phases').click()
  cy.get(`[data-value="${phase}"]`).click()

  cy.get('[data-cy="moreThan15Kw"]')
    .get(`[data-value="${moreThan15Kw}"]`)
    .click()

  powers.forEach((power, index) => {
    cy.get(`[name="contract.power${index > 0 ? index + 1 : ''}"]`)
      .clear()
      .type(power)
      .should('have.value', power)
  })

  cy.get('[data-cy=next]').click()
})

// ***********************************************
// This example commands.js shows you how to
// create various custom commands and overwrite
// existing commands.
//
// For more comprehensive examples of custom
// commands please read more here:
// https://on.cypress.io/custom-commands
// ***********************************************
//
//
// -- This is a parent command --
// Cypress.Commands.add("login", (email, password) => { ... })
//
//
// -- This is a child command --
// Cypress.Commands.add("drag", { prevSubject: 'element'}, (subject, options) => { ... })
//
//
// -- This is a dual command --
// Cypress.Commands.add("dismiss", { prevSubject: 'optional'}, (subject, options) => { ... })
//
//
// -- This will overwrite an existing command --
// Cypress.Commands.overwrite("visit", (originalFn, url, options) => { ... })

import 'cypress-file-upload'
