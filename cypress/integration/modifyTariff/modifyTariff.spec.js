/// <reference types="cypress" />

const SUCCESS_TITLE = "Has solicitat la tarifa comercialitzadora:"


describe('Modify Tariff', () => {
    Cypress.on('uncaught:exception', (error, runnable) => {
      console.error(error)
      return false
    })
  
    beforeEach(() => {
      cy.visit('/ca/contract/indexada')
    })
  
    it('Change Tariff to indexada', function () {
      cy.get('[id=change-tariff-next-step-button]').click()

      cy.get('[id=change-tariff-next-step-button]').click()
  
      cy.get('[id=change-tarif-first-check]').click()

      cy.get('[id=terms-dialog-accept-btn]').click()

      cy.get('[id=change-tarif-second-check]').click()
  
      cy.get('[id=tariff-change-submit]').click()

      cy.get('[id=success-page-title]').should(
        'contain',
        SUCCESS_TITLE
      )
    })
  })
  