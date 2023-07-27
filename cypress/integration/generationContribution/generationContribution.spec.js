/// <reference types="cypress" />

describe('Generation Form', () => {
    Cypress.on('uncaught:exception', (error, runnable) => {
      console.error(error)
      return false
    })
  
    beforeEach(() => {
      cy.visit('/generation/contribution')
      cy.fixture('generationContribution.json').as('data')
    })
  
    it('Reject D1', function () {
      cy.get(`[data-value="${false}"]`).click()
      cy.get('[type=submit]').click()
    })
  
  })
  