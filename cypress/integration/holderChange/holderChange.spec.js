/// <reference types="cypress" />

describe('Holder Change', () => {
  Cypress.on('uncaught:exception', (error, runnable) => {
    console.error(error)
    return false
  })

  beforeEach(() => {
    cy.visit('/holder-change')
    cy.fixture('holderChange.json').as('data')
    cy.fixture('contract.json').as('dataContract')
  })

  describe('Enter VAT', function () {
    it('Enter invalid VAT', function () {
      const ERROR_STATUS_CODE = 400
      cy.identifyHolder(this.data.vatInvalid, ERROR_STATUS_CODE)

      cy.contains('El NIF no es correcto')
      cy.get('[data-cy=next]').should('have.class', 'Mui-disabled')
    })

    it('Enter valid VAT', function () {
      cy.identifyHolder(this.data.vat)

      cy.get('[data-cy=next]').should('not.have.class', 'Mui-disabled')
      cy.get('[data-cy=next]').click()
    })
  })

  describe('Enter CUPS', function () {
    beforeEach(function () {
      cy.identifyHolder(this.data.vat)
      cy.get('[data-cy=next]').click()
    })

    it('Enter invalid CUPS', function () {
      const ERROR_STATUS_CODE = 400

      cy.intercept('GET', '/check/cups/**').as('checkCups')

      cy.get('#cups')
        .clear()
        .type(this.data.cupsInvalid)
        .should('have.value', this.data.cupsInvalid)

      cy.wait('@checkCups')
        .its('response.statusCode')
        .should('be.oneOf', [ERROR_STATUS_CODE])

      cy.get('#cups').focus().blur()
      cy.contains('CUPS incorrecto')
    })

    it('Enter valid CUPS', function () {
      cy.get('[data-cy=next]').should('have.class', 'Mui-disabled')

      cy.holderChangeIdentSupplyPoint(this.data.cups)

      cy.get('[data-cy=next]').should('not.have.class', 'Mui-disabled')
      cy.get('[data-cy=next]').click()
    })
  })

  describe.skip('Enter personal data', function () {
    beforeEach(function () {
      cy.identifyHolder(this.data.vat)
      cy.get('[data-cy=next]').click()

      cy.holderChangeIdentSupplyPoint(this.data.cups)
      cy.get('[data-cy=next]').click()
    })

    it('Enter personal data', function () {
      cy.get('[data-cy=next]').should('have.class', 'Mui-disabled')

      cy.holderChangePersonalData(this.data)

      cy.get('[data-cy=next]').should('not.have.class', 'Mui-disabled')
      cy.get('[data-cy=next]').click()
    })
  })

  describe('Become member step', function () {
    beforeEach(function () {
      cy.identifyHolder(this.data.vat)
      cy.get('[data-cy=next]').click()

      cy.holderChangeIdentSupplyPoint(this.data.cups)
      cy.get('[data-cy=next]').click()

      cy.holderChangePersonalData(this.data)
      cy.get('[data-cy=next]').click()
    })

    it('Check become member option', function () {
      // cy.get('[data-cy=next]').should('have.class', 'Mui-disabled')

      cy.get(`[data-value="${this.data.becomeMember}"]`).click()
      cy.get('[data-cy=next]').should('not.have.class', 'Mui-disabled')

      cy.get('[data-cy=next]').click()
    })
  })

  describe('Voluntary cent step', function () {
    beforeEach(function () {
      cy.identifyHolder(this.data.vat)
      cy.get('[data-cy=next]').click()

      cy.holderChangeIdentSupplyPoint(this.data.cups)
      cy.get('[data-cy=next]').click()

      cy.holderChangePersonalData(this.data)
      cy.get('[data-cy=next]').click()

      cy.get(`[data-value="${this.data.becomeMember}"]`).click()
      cy.get('[data-cy=next]').click()
    })

    it('Check voluntary cent option', function () {
      // cy.get('[data-cy=next]').should('have.class', 'Mui-disabled')

      cy.get(`[data-value="${this.data.voluntaryCent}"]`).click()
      cy.get('[data-cy=next]').should('not.have.class', 'Mui-disabled')

      cy.get('[data-cy=next]').click()
    })
  })

  describe('Special cases step', function () {
    beforeEach(function () {
      cy.identifyHolder(this.data.vat)
      cy.get('[data-cy=next]').click()

      cy.holderChangeIdentSupplyPoint(this.data.cups)
      cy.get('[data-cy=next]').click()

      cy.holderChangePersonalData(this.data)
      cy.get('[data-cy=next]').click()

      cy.get(`[data-value="${this.data.becomeMember}"]`).click()
      cy.get('[data-cy=next]').click()

      cy.get(`[data-value="${this.data.voluntaryCent}"]`).click()
      cy.get('[data-cy=next]').click()
    })

    it('Check special cases default', function () {
      cy.get('[data-cy=next]').should('not.have.class', 'Mui-disabled')

      cy.get('input[name="especial_cases.reason_death"]').click()
      cy.get('[data-cy=next]').should('have.class', 'Mui-disabled')

      cy.get('input[name="especial_cases.reason_default"]').click()
      cy.get('[data-cy=next]').should('not.have.class', 'Mui-disabled')

      cy.get('[data-cy=next]').click()
    })
  })

  describe('Payment step', function () {
    beforeEach(function () {
      cy.identifyHolder(this.data.vat)
      cy.get('[data-cy=next]').click()

      cy.holderChangeIdentSupplyPoint(this.data.cups)
      cy.get('[data-cy=next]').click()

      cy.holderChangePersonalData(this.data)
      cy.get('[data-cy=next]').click()

      cy.get(`[data-value="${this.data.becomeMember}"]`).click()
      cy.get('[data-cy=next]').click()

      cy.enterVoluntaryCent(this.data.voluntaryCent)

      cy.get('[data-cy=next]').click()
    })

    it('Enter IBAN number', function () {
      cy.get('input[name="payment.iban"]')
        .type(this.data.iban)
        .should('have.value', this.data.iban)

      cy.get('[data-cy=next]').should('have.class', 'Mui-disabled')

      cy.get('input[name="payment.sepa_accepted"]').click()
      cy.get('[data-cy=accept]').click()

      cy.get('[data-cy=next]').should('not.have.class', 'Mui-disabled')

      cy.get('[data-cy=next]').click()
    })
  })

  describe('Review step', function () {
    beforeEach(function () {
      cy.identifyHolder(this.data.vat)
      cy.get('[data-cy=next]').click()

      cy.holderChangeIdentSupplyPoint(this.data.cups)
      cy.get('[data-cy=next]').click()

      cy.holderChangePersonalData(this.data)
      cy.get('[data-cy=next]').click()

      cy.get(`[data-value="${this.data.becomeMember}"]`).click()
      cy.get('[data-cy=next]').click()

      cy.enterVoluntaryCent(this.data.voluntaryCent)

      cy.get('[data-cy=next]').click()

      cy.enterPaymentData(this.data.iban)
    })

    it('Review holder change data', function () {
      cy.contains('revisa y confirma el contrato', { matchCase: false })
      cy.contains(this.data.vat, { matchCase: false })

      cy.get('[data-cy=next]').should('have.class', 'Mui-disabled')

      cy.contains('acepto las condiciones', { matchCase: false }).click()
      cy.contains('condiciones generales', { matchCase: false })
      cy.get('[data-cy=accept]').click()

      cy.get('[data-cy=next]').should('not.have.class', 'Mui-disabled')

      cy.intercept('POST', '/form/holderchange').as('holderChangePost')

      cy.get('[data-cy=next]').click()

      cy.wait('@holderChangePost')
        .its('response.statusCode')
        .should('be.oneOf', [200, 300])

      cy.contains('hemos tramitado con éxito tu solicitud', {
        matchCase: false
      })
    })
  })
})
