/// <reference types="cypress" />

describe('Holder Change', () => {
  beforeEach(() => {
    cy.visit('http://localhost:3000/holder-change')
    cy.fixture('holderChange.json').as('data')
  })

  describe('Enter VAT', function () {
    it('Enter invalid VAT', function () {
      cy.get('[name="holder.vat"]')
        .type(this.data.vatInvalid).should('have.value', this.data.vatInvalid)

      cy.contains('No has introducido un NIF correcto')

      cy.get('[data-cy=next]').should('have.class', 'Mui-disabled')
    })

    it('Enter valid VAT', function () {
      cy.get('[name="holder.vat"]')
        .type(this.data.vat).should('have.value', this.data.vat)

        cy.get('[data-cy=next]').should('not.have.class', 'Mui-disabled')
    })
  })

  describe('Enter CUPS', function () {
    beforeEach(function () {
      cy.get('[name="holder.vat"]')
        .type(this.data.vat).should('have.value', this.data.vat)

      cy.get('[data-cy=next]').click()
    })

    it('Enter invalid CUPS', function () {
      cy.get('[name="supply_point.cups"]')
        .type(this.data.cupsInvalid).should('have.value', this.data.cupsInvalid)
        .blur()

      cy.contains('CUPS incorrecto')
    })

    it('Enter valid CUPS', function () {
      cy.get('[name="supply_point.cups"]')
        .type(this.data.cups).should('have.value', this.data.cups)

      cy.get('#cupsaddress').should('have.value', this.data.cupsAddress)

      cy.get('[data-cy=next]').should('have.class', 'Mui-disabled')

      cy.get('[name="supply_point.verified"]').click()

      cy.get('[data-cy=next]').should('not.have.class', 'Mui-disabled')
    })
  })

  describe('Enter personal data', function () {
    beforeEach(function () {
      cy.get('[name="holder.vat"]')
        .type(this.data.vat).should('have.value', this.data.vat)

      cy.get('[data-cy=next]').click()

      cy.get('[name="supply_point.cups"]')
        .type(this.data.cups).should('have.value', this.data.cups)

      cy.get('[name="supply_point.verified"]').click()

      cy.get('[data-cy=next]').click()
    })

    it('Enter name', function () {
      cy.get('[name="holder.name"]')
        .type(this.data.name).should('have.value', this.data.name)

      cy.get('[name="holder.surname1"]')
      .type(this.data.surname1).should('have.value', this.data.surname1)

      cy.get('[name="holder.surname2"]')
      .type(this.data.surname2).should('have.value', this.data.surname2)

      cy.get('[name="holder.address"]')
      .type(this.data.address).should('have.value', this.data.address)

      cy.get('[name="holder.postal_code"]')
      .type(this.data.postalCode).should('have.value', this.data.postalCode)

    })
  })
})
