/// <reference types="cypress" />

const SUCCESS_TITLE = "Has sol·licitat la tarifa:"


describe('Modify Tariff', () => {
  Cypress.on('uncaught:exception', (error, runnable) => {
    console.error(error)
    return false
  })
  beforeEach(() => {
    cy.fixture('generalContractTerms.html').as('html')
    cy.visit('/ca/contract/indexed')
    cy.intercept('GET', '/ping', {
      statusCode: 200,
      body: {
        state: true,
        status: "ONLINE"
      }
    })

    cy.intercept('GET', '/procedures/can_turn_contract_indexed', {
      statusCode: 200,
      body: {
        data: {
          k_coefficient_eurkwh: null,
          target_tariff: "2.0TD_SOM"
        }
      },
    });

    cy.intercept('POST', '/procedures/contract_indexed',{
      statusCode: 200,
      body:{
        data:{
          status: "OK"
        }
      }
    })
    
  })

  it('Change Tariff to indexada', function () {
    cy.intercept('GET', `/static/docs/ca/general-contract-terms.html`, {
      statusCode: 200,
      headers: {'content-type':'text/html'},
      body: this.html
    }).as('generalTerms')

    cy.get('[data-cy="next"]').click()

    cy.get('[data-cy="next"]').click()

    cy.get('[id=change-tarif-terms-check]').click()

    cy.wait('@generalTerms')
    .its('response.statusCode')
    .should('be.oneOf', [200, 304])

    cy.get('[id=terms-dialog-accept-btn]').click()

    cy.get('[id=change-tariff-indexada-terms-check]').click()

    cy.get('[id=tariff-change-submit]').click()

    cy.get('[id=success-page-title]').should(
      'contain',
      SUCCESS_TITLE
    )
  })
})
