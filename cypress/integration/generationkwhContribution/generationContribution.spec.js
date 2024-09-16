/// <reference types="cypress" />

describe('Generation Form', () => {
  Cypress.on('uncaught:exception', (error, runnable) => {
    console.error(error)
    return false
  })

  function fillInData(data) {

    cy.get('#member_name')
      .type(data.new_member.name)
      .should('have.value', data.new_member.name)

    cy.get('#member_surname1')
      .type(data.new_member.surname1)
      .should('have.value', data.new_member.surname1)

    cy.get('#member_surname2')
      .type(data.new_member.surname2)
      .should('have.value', data.new_member.surname2)

    cy.get('#member_address')
      .type(data.new_member.address)
      .should('have.value', data.new_member.address)

    cy.get('#member_number')
      .type(data.new_member.number)
      .should('have.value', data.new_member.number)

    cy.get('#member_email')
      .type(data.new_member.email)
      .should('have.value', data.new_member.email)

    cy.get('#member_email2')
      .type(data.new_member.email)
      .should('have.value', data.new_member.email)

    cy.get('#member_phone')
      .type(data.new_member.phone)
      .should('have.value', data.new_member.phone)

    cy.get('#member_phone2')
      .type(data.new_member.phone)
      .should('have.value', data.new_member.phone)

    cy.get('[name="privacy_policy_accepted"]').click()
    cy.get('[data-cy=next]').click()

  }

  beforeEach(() => {
    cy.intercept('GET', '/ping', {
      statusCode: 200,
      body: {
        state: true,
        status: "ONLINE"
      }
    })
    cy.visit('/generationkwh/contribution')
    cy.fixture('generationkwhContribution.json').as('data')
    cy.fixture('generationLocationData/provincies.json').as('provincies')
    cy.fixture('generationLocationData/municipis.json').as('municipis')
    cy.fixture('generationLocationData/ine.json').as('ine')
  })

    context('Member - Success Tests', () => {

      it('Contribute with an action', function () {
  
        //Member page
        cy.generationkwhIdentifyMember(this.data.member.number, this.data.member.vat, true)
        cy.get('[data-cy=next]').click()
  
        //Contribution page
        cy.get('#annual_use')
          .clear()
          .type(this.data.annual_use.low)
          .should('have.value', this.data.annual_use.low)
  
        for (let n = 0; n < this.data.number_of_action.normal; n++) {
          cy.get('#add_action').click()
        }
  
        //Insert IBAN
        cy.typeIbanGenerationkwh(this.data.payment_data.iban,200)
  
        cy.get('[data-cy=next]').click()
  
        //Review page
        cy.get('#privacy_plicy_check').check()
      })
  
      it('Try to contribute with out of zone member', function () {
        //Member page
        let memberNumber = this.data.member_out_first_fase_zone.number
        let memberVat = this.data.member_out_first_fase_zone.vat
  
        cy.generationkwhIdentifyMember(memberNumber, memberVat, false)
  
        cy.get('[data-cy=exit]').click()
  
      })
    })

  context(' NO Member - Success Tests', () => {
    it('Contribute with an action', function () {

      cy.intercept('GET', '/data/generationkwh/can_join/**', {
        statusCode: 200,
        body: {
          data: true,
          state: true,
          status: "ONLINE"
        }
      }).as('canJoin')

      //Member page
      let postal_code = this.data.new_member.postal_code
      let vat = this.data.new_member.vat

      cy.get('#member-choose-no').click()
      cy.get('#input_postalcode')
        .clear()
        .type(postal_code)
        .should('have.value', postal_code)

      cy.wait('@canJoin')
        .its('response.statusCode')
        .should('be.oneOf', [200, 304])

      cy.intercept('GET', '/check/vat/exists/*', {
        statusCode: 200,
        body: {
          data: {
            exists: false,
            is_member: false,
            is_selfconsumption_owner: false,
            valid: true
          },
          state: true,
          status: "ONLINE"
        }
      }).as('vatExists')

      cy.get('#vat').clear().type(vat).should('have.value', vat)

      cy.wait('@vatExists')
        .its('response.statusCode')
        .should('be.oneOf', [200, 304])

      cy.intercept('GET', '/data/provincies', {
        statusCode: 200,
        body: this.provincies
      })

      cy.intercept('GET', '/data/municipis/*', {
        statusCode: 200,
        body: this.municipis
      })

      cy.intercept('GET', '/data/ine/*', {
        statusCode: 200,
        body: this.ine
      })

      cy.get('[data-cy=next]').click()

      fillInData(this.data)
      //Contribution page
      cy.get('#annual_use')
        .clear()
        .type(this.data.annual_use.low)
        .should('have.value', this.data.annual_use.low)

      for (let n = 0; n < this.data.number_of_action.normal; n++) {
        cy.get('#add_action').click()
      }

      //Insert IBAN
      cy.typeIbanGenerationkwh(this.data.payment_data.iban,200)

      cy.get('[data-cy=next]').click()

      //Review page
      cy.get('#privacy_plicy_check').check()
      //cy.get('[data-cy=next]').click()
    })

    it('Try to contribute with out of zone postal code', function () {
      //Member page
      let postal_code = this.data.out_zone_data.postal_code

      cy.intercept('GET', `/data/generationkwh/can_join/${postal_code}`, {
        statusCode: 200,
        body: {
          data: false
        }
      }).as('canJoin')

      cy.get('#member-choose-no').click()
      cy.get('#input_postalcode')
        .clear()
        .type(postal_code)
        .should('have.value', postal_code)



      cy.wait('@canJoin')
        .its('response.statusCode')
        .should('be.oneOf', [200, 304])

      cy.get('[data-cy=exit]').click()
    })
  })

  context('Member - Fail Tests', () => {
    it('Try to contribute with erroneous credentials', function () {
      //Member page
      let memberNumber = this.data.member.number
      let memberVat = this.data.member.badVat

      cy.intercept('GET', '/check/vat/*', {
        statusCode: 400,
      }).as('checkVat')

      cy.intercept('GET', '/data/soci/**',
        {
          statusCode: 200,
          body: {
            data: { soci: {} },
            state: true
          }
        }).as('checkMember')

      cy.intercept('GET', '/data/generationkwh/can_join/**',
        {
          statusCode: 400,
          body: {
            data: {},
            state: false
          }
        }).as('canJoin')

      cy.get('#memberNumber')
        .clear()
        .type(memberNumber)
        .should('have.value', memberNumber)

      cy.get('#vat').clear().type(memberVat).should('have.value', memberVat)




      cy.wait('@checkVat')
        .its('response.statusCode')
        .should('be.oneOf', [400])

      cy.wait('@checkMember')
        .its('response.statusCode')
        .should('be.oneOf', [200, 304])

      cy.get('[data-cy=next]').should('be.disabled')
    })

    it('Try to contribute with erroneous annual use', function () {

      //Member page
      cy.generationkwhIdentifyMember(this.data.member.number, this.data.member.vat, true)
      cy.get('[data-cy=next]').click()
      //Contribution page
      cy.get('#annual_use')
        .clear()
        .type(this.data.annual_use.not_enough)
        .should('have.value', this.data.annual_use.not_enough)

      for (let n = 0; n < this.data.number_of_action.normal; n++) {
        cy.get('#add_action').click()
      }

      cy.typeIbanGenerationkwh(this.data.payment_data.iban, 200)
      cy.get('[data-cy=next]').should('be.disabled')
    })

    it('Not enough number of actions', function () {
      //Member page
      cy.generationkwhIdentifyMember(this.data.member.number, this.data.member.vat, true)
      cy.get('[data-cy=next]').click()

      //Contribution page
      cy.get('#annual_use')
        .clear()
        .type(this.data.annual_use.normal)
        .should('have.value', this.data.annual_use.normal)

      for (let n = 0; n < this.data.number_of_action.not_enough; n++) {
        cy.get('#add_action').click()
      }

      cy.typeIbanGenerationkwh(this.data.payment_data.iban, 200)
      cy.get('[data-cy=next]').should('be.disabled')
    })

    it('Erroneous IBAN', function () {
      //Member page
      cy.generationkwhIdentifyMember(this.data.member.number, this.data.member.vat, true)
      cy.get('[data-cy=next]').click()

      //Contribution page
      cy.get('#annual_use')
        .clear()
        .type(this.data.annual_use.normal)
        .should('have.value', this.data.annual_use.normal)

      for (let n = 0; n < this.data.number_of_action.normal; n++) {
        cy.get('#add_action').click()
      }

      cy.typeIbanGenerationkwh(this.data.payment_data.err_iban, 400)

      cy.get('[data-cy=next]').should('be.disabled')
    })
  })
})
