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

  it('Contribute with an action', function () {
    //Member page
    cy.identifyMember(this.data.member.number, this.data.member.vat)

    //Contribution page
    cy.get('#annual_use')
      .clear()
      .type(this.data.annual_use.low)
      .should('have.value', this.data.annual_use.low)

    for (let n = 0; n < this.data.number_of_action.normal; n++) {
      cy.get('#add_action').click()
    }

    cy.get('[name="payment.iban"]')
      .clear()
      .type(this.data.payment_data.iban)
      .should('have.value', this.data.payment_data.iban)
    cy.get('[data-cy=next]').click()

    //Review page
    cy.get('#privacy_plicy_check').check()
    cy.get('[data-cy=next]').click()
  })

  it('Try to contribute with out of zone member', function () {
    //Member page
    let memberNumber = this.data.member_out_first_fase_zone.number
      let memberVat = this.data.member_out_first_fase_zone.vat

      cy.intercept('GET', '/data/soci/**').as('checkMember')

      cy.get('#memberNumber')
        .clear()
        .type(memberNumber)
        .should('have.value', memberNumber)

      cy.get('#vat').clear().type(memberVat).should('have.value', memberVat)
      cy.wait('@checkMember')
      .its('response.statusCode')
      .should('be.oneOf', [200, 304])
      cy.get('[data-cy=exit]').click()
  })


  context('Fail Tests', () => {
    it('Try to contribute with erroneous credentials', function () {
      //Member page
      let memberNumber = this.data.member.number
      let memberVat = this.data.member.badVat

      cy.intercept('GET', '/data/soci/**').as('checkMember')

      cy.get('#memberNumber')
        .clear()
        .type(memberNumber)
        .should('have.value', memberNumber)

      cy.get('#vat').clear().type(memberVat).should('have.value', memberVat)

      cy.wait('@checkMember')
        .its('response.statusCode')
        .should('be.oneOf', [200, 304])
      cy.get('[data-cy=next]').should('be.disabled')
    })

    it('Try to contribute with erroneous annual use', function () {
      //Member page
      cy.identifyMember(this.data.member.number, this.data.member.vat)

      //Contribution page
      cy.get('#annual_use')
        .clear()
        .type(this.data.annual_use.not_enough)
        .should('have.value', this.data.annual_use.not_enough)

      for (let n = 0; n < this.data.number_of_action.normal; n++) {
        cy.get('#add_action').click()
      }

      cy.get('[name="payment.iban"]')
        .clear()
        .type(this.data.payment_data.iban)
        .should('have.value', this.data.payment_data.iban)
      cy.get('[data-cy=next]').should('be.disabled')
    })
    it('Not enough number of actions', function () {
      //Member page
      cy.identifyMember(this.data.member.number, this.data.member.vat)

      //Contribution page
      cy.get('#annual_use')
        .clear()
        .type(this.data.annual_use.normal)
        .should('have.value', this.data.annual_use.normal)

      for (let n = 0; n < this.data.number_of_action.not_enough; n++) {
        cy.get('#add_action').click()
      }

      cy.get('[name="payment.iban"]')
        .clear()
        .type(this.data.payment_data.iban)
        .should('have.value', this.data.payment_data.iban)
      cy.get('[data-cy=next]').should('be.disabled')
    })

    it('Erroneous IBAN', function () {
        //Member page
        cy.identifyMember(this.data.member.number, this.data.member.vat)
  
        //Contribution page
        cy.get('#annual_use')
          .clear()
          .type(this.data.annual_use.normal)
          .should('have.value', this.data.annual_use.normal)
  
        for (let n = 0; n < this.data.number_of_action.normal; n++) {
          cy.get('#add_action').click()
        }
  
        cy.get('[name="payment.iban"]')
          .clear()
          .type(this.data.payment_data.err_iban)
          .should('have.value', this.data.payment_data.err_iban)
        cy.get('[data-cy=next]').should('be.disabled')
      })
  })
})
