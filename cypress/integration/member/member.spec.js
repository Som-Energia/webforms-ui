/// <reference types="cypress" />

describe('New Member', () => {
  beforeEach(() => {
    cy.visit('http://localhost:3000/new-member')
    cy.fixture('member.json').as('data')
  })

  describe('New Member Sign In (legal)', function () {
    beforeEach(function () {
      cy.get('[name="member.vat"]')
        .type(this.data.cif).should('have.value', this.data.cif)

      cy.get('[data-cy=next]').click()
    })

    it('Enter personal data', function () {
      cy.get('[name="member.name"]')
        .type(this.data.legalName).should('have.value', this.data.legalName)

      cy.get('[name="member.proxyname"]')
        .type(`${this.data.name} ${this.data.surname1}`).should('have.value', `${this.data.name} ${this.data.surname1}`)

      cy.get('[name="member.proxynif"]')
        .type(this.data.vat).should('have.value', this.data.vat)

      cy.get('[name="member.address"]')
        .type(this.data.address).should('have.value', this.data.address)

      cy.get('[name="member.postal_code"]')
        .type(this.data.postalCode).should('have.value', this.data.postalCode)

      cy.get('#member_state').click()
      cy.get(`[data-value="${this.data.stateCode}"]`).click()

      cy.get('#member_city').click()
      cy.get(`[data-value="${this.data.cityCode}"]`).click()

      cy.get('[name="member.email"]')
        .type(this.data.email).should('have.value', this.data.email)

      cy.get('[name="member.email2"]')
        .type(this.data.email).should('have.value', this.data.email)

      cy.get('[name="member.phone1"]')
        .type(this.data.phone).should('have.value', this.data.phone)

      cy.get('#member_lang').click()
      cy.get('[data-value="ca_ES"]').click()

      cy.get('[name="legal_person_accepted"]').click()
      cy.get('[data-cy=accept]').click()

      cy.get('[name="privacy_policy_accepted"]').click()

      cy.get('[data-cy=next]').click()

      // Payment method

      cy.get(`[data-value="${this.data.paymentMethod}"]`).click()

      if (this.data.paymentMethod === 'iban') {
        cy.get('[name="payment.iban"]')
          .type(this.data.iban).should('have.value', this.data.iban)

        cy.get('[name="payment.sepa_accepted"]').click()
      }

      cy.get('[data-cy=accept]').click()

      cy.get('[data-cy=next]').click()

    })
  })

  /*

  describe('New Member Sign In (phisical)', function () {
    beforeEach(function () {
      cy.get('[name="member.vat"]')
        .type(this.data.vat).should('have.value', this.data.vat)

      cy.get('[data-cy=next]').click()
    })

    it('Enter personal data', function () {
      cy.get('[name="member.name"]')
        .type(this.data.name).should('have.value', this.data.name)

      cy.get('[name="member.surname1"]')
        .type(this.data.surname1).should('have.value', this.data.surname1)

      cy.get('[name="member.surname2"]')
        .type(this.data.surname2).should('have.value', this.data.surname2)

      cy.get('[name="member.address"]')
        .type(this.data.address).should('have.value', this.data.address)

      cy.get('[name="member.postal_code"]')
        .type(this.data.postalCode).should('have.value', this.data.postalCode)

      cy.get('#member_state').click()
      cy.get(`[data-value="${this.data.stateCode}"]`).click()

      cy.get('#member_city').click()
      cy.get(`[data-value="${this.data.cityCode}"]`).click()

      cy.get('[name="member.email"]')
        .type(this.data.email).should('have.value', this.data.email)

      cy.get('[name="member.email2"]')
        .type(this.data.email).should('have.value', this.data.email)

      cy.get('[name="member.phone1"]')
        .type(this.data.phone).should('have.value', this.data.phone)

      cy.get('#member_lang').click()
      cy.get('[data-value="ca_ES"]').click()

      cy.get('[name="privacy_policy_accepted"]').click()

      cy.get('[data-cy=next]').click()

      // Payment method

      cy.get('[data-value="iban"]').click()

      cy.get('[name="payment.iban"]')
        .type(this.data.iban).should('have.value', this.data.iban)

      cy.get('[name="payment.sepa_accepted"]').click()

      cy.get('[data-cy=accept]').click()

      cy.get('[data-cy=next]').click()

    })
  })

  */

})
