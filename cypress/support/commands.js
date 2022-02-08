Cypress.Commands.add('identifyMember', (memberNumber, memberVat) => {
  cy.intercept('GET', '/data/soci/**').as('checkMember')

  cy.get('#memberNumber')
    .clear()
    .type(memberNumber)
    .should('have.value', memberNumber)

  cy.get('#vat').clear().type(memberVat).should('have.value', memberVat)

  cy.wait('@checkMember')
    .its('response.statusCode')
    .should('be.oneOf', [200, 304])

  cy.get('[data-cy=next]').click()
})

Cypress.Commands.add('identifySupplyPoint', (cups, hasService) => {
  cy.intercept('GET', '/check/cups/**').as('checkCups')

  cy.get('#cups').clear().type(cups).should('have.value', cups)

  cy.wait('@checkCups')
    .its('response.statusCode')
    .should('be.oneOf', [200, 304])

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

  /*  
  cy.get('#supply_point_state').click()
  cy.get(`[data-value="${supplyPoint.state}"]`).click()

  cy.get('#supply_point_city').click()
  cy.get(`[data-value="${supplyPoint.city}"]`).click()
  */

  cy.get('#supply_point_is_housing').click()
  cy.get(`[data-value="${supplyPoint.isHousing}"]`).click()

  cy.get('#supply_point_cnae').should('have.value', supplyPoint.cnae)

  cy.get('[name="supply_point_accepted"]').click()
  cy.get('[data-cy=accept]').click()

  cy.get('[data-cy=next]').click()
})

Cypress.Commands.add('enterPowerFare', (phase, moreThan15Kw, powers) => {
  if (phase !== undefined) {
    cy.get('#phases').click()
    cy.get(`[data-value="${phase}"]`).click()
  }
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

Cypress.Commands.add(
  'enterSelfConsumption',
  (haveSelfConsumption, selfConsumptionData) => {
    cy.get(`[data-value="${haveSelfConsumption}"]`).click()
    cy.get('[data-cy=next]').click()

    if (haveSelfConsumption) {
      cy.get('#self_consumption_cau')
        .clear()
        .type(selfConsumptionData.cau)
        .should('have.value', selfConsumptionData.cau)

      cy.get('[data-cy="self_consumption.collective_installation"]')
        .find(`[data-value="${selfConsumptionData.collective_installation}"]`)
        .click()

      cy.get('#self_consumption_install_power')
        .clear()
        .type(selfConsumptionData.installation_power)
        .should('have.value', selfConsumptionData.installation_power)

      cy.get('#self_consumption_installation_type').click()
      cy.get(`[data-value="${selfConsumptionData.installation_type}"]`).click()

      cy.get('#self_consumption_technology').click()
      cy.get(`[data-value="${selfConsumptionData.technology}"]`).click()

      cy.get('[data-cy="self_consumption.aux_services"]')
        .find(`[data-value="${selfConsumptionData.aux_services}"]`)
        .click()

      cy.get('[data-cy=next]').click()
    }
  }
)

Cypress.Commands.add('choosePhase', (phase) => {
  cy.get('#phases').click()
  cy.get(`[data-value="${phase}"]`).click()
})

Cypress.Commands.add('chooseMoreOrLessThan15Kw', (moreThan15Kw) => {
  cy.get('[data-cy="moreThan15Kw"]')
    .get(`[data-value="${moreThan15Kw}"]`)
    .click()
})

Cypress.Commands.add('noIncrementalPowers', (phase, moreThan15Kw, powers) => {
  cy.choosePhase(phase)
  cy.chooseMoreOrLessThan15Kw(moreThan15Kw)

  powers.forEach((power, index) => {
    cy.get(`[name="contract.power${index > 0 ? index + 1 : ''}"]`)
      .clear()
      .type(power)
      .should('have.value', power)
      .blur()
  })

  cy.contains('La potencia de este periodo no puede ser inferior al anterior')
})

Cypress.Commands.add('identifyOwner', (ownerVat, previousHolder) => {
  cy.intercept('GET', '/check/vat/exists/**').as('checkVat')

  cy.get('[name="holder.vat"]').type(ownerVat).should('have.value', ownerVat)

  cy.wait('@checkVat').its('response.statusCode').should('be.oneOf', [200, 304])

  if (previousHolder !== undefined) {
    cy.get(`[data-value="${previousHolder}"]`).click()
  }

  cy.get('[data-cy=next]').click()
})

Cypress.Commands.add('enterVoluntaryCent', (voluntaryCent) => {
  cy.get(`[data-value="${voluntaryCent}"]`).click()

  cy.get('[data-cy=next]').click()
})

Cypress.Commands.add('enterPaymentData', (paymentIban) => {
  cy.get('[name="payment.iban"]')
    .clear()
    .type(paymentIban)
    .should('have.value', paymentIban)

  cy.get('[name="payment.sepa_accepted"]').click()
  cy.get('[data-cy=accept]').click()
  cy.get('[data-cy=next]').click()
})

Cypress.Commands.add('reviewAndConfirmData', () => {
  cy.contains('€/kWh')
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
