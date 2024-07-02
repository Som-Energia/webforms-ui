/// <reference types="cypress" />

const SUCCESS_TITLE = "Has sol·licitat la tarifa comercialitzadora:"


describe('Modify Tariff', () => {
    Cypress.on('uncaught:exception', (error, runnable) => {
      console.error(error)
      return false
    })
  
    beforeEach(() => {
      cy.visit('/ca/contract/indexed')
    })
  
    it('Change Tariff to indexada', function () {
      cy.get('[id=change-tariff-next-step-button]').click()

      cy.get('[id=change-tariff-next-step-button]').click()
  
      cy.get('[id=change-tarif-terms-check]').click()

      cy.get('[id=terms-dialog-accept-btn]').click()

      cy.get('[id=change-tariff-indexada-terms-check]').click()

      cy.get('[id=change-tariff-indexada-legal-terms-check]').click()
  
      cy.get('[id=tariff-change-submit]').click()

      cy.get('[id=success-page-title]').should(
        'contain',
        SUCCESS_TITLE
      )
    })
  })
  