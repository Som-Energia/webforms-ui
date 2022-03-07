/// <reference types="cypress" />

describe('New Member', () => {
  Cypress.on('uncaught:exception', (error, runnable) => {
    console.log(error)
    return false
  })

  beforeEach(() => {
    cy.visit('/new-member')
    cy.fixture('member.json').as('data')
  })

  describe('New Member Sign In (legal)', function () {
    function mainTest(data) {
      cy.get('[name="member.name"]')
        .type(data.legalName)
        .should('have.value', data.legalName)

      cy.get('[name="member.proxyname"]')
        .type(`${data.name} ${data.surname1}`)
        .should('have.value', `${data.name} ${data.surname1}`)

      cy.get('[name="member.proxynif"]')
        .type(data.vat)
        .should('have.value', data.vat)

      cy.get('[name="member.address"]')
        .type(data.address)
        .should('have.value', data.address)

      cy.get('[name="member.postal_code"]')
        .type(data.postalCode)
        .should('have.value', data.postalCode)

      cy.get('#member_state').click()
      cy.get(`[data-value="${data.stateCode}"]`).click()

      cy.get('#member_city').click()
      cy.get(`[data-value="${data.cityCode}"]`).click()

      cy.get('[name="member.email"]')
        .type(data.email)
        .should('have.value', data.email)

      cy.get('[name="member.email2"]')
        .type(data.email)
        .should('have.value', data.email)

      cy.get('[name="member.phone1"]')
        .type(data.phone)
        .should('have.value', data.phone)

      cy.get('#member_lang').click()
      cy.get('[data-value="ca_ES"]').click()

      cy.get('[name="legal_person_accepted"]').click()
      cy.get('[data-cy=accept]').click()

      cy.get('[name="privacy_policy_accepted"]').click()

      cy.get('[data-cy=next]').click()

      // Payment method

      cy.get(`[data-value="${data.paymentMethod}"]`).click()

      if (data.paymentMethod === 'iban') {
        cy.get('[name="payment.iban"]')
          .type(data.iban)
          .should('have.value', data.iban)

        cy.get('[name="payment.sepa_accepted"]').click()
      }

      cy.get('[data-cy=accept]').click()
      cy.get('[data-cy=next]').click()

      // Review

      cy.get('[name="terms_accepted"]').click()

      //cy.get('[data-cy=submit]').click()
      cy.wait(2000)
    }

    it('Enter personal data for existing member', function () {
      cy.get('[name="member.vat"]')
        .type(this.data.existingCif)
        .should('have.value', this.data.existingCif)
      cy.get('[data-cy=next]').click()

      mainTest(this.data)

      // cy.contains('Ya existe un socio/a con este NIF/CIF')
    })

    it('Enter personal data for non existing member', function () {
      cy.get('[name="member.vat"]')
        .type(this.data.cif)
        .should('have.value', this.data.cif)
      cy.get('[data-cy=next]').click()

      mainTest(this.data)

      // cy.contains('Hemos tramitado con éxito tu solicitud')
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
