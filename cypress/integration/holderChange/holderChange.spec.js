/// <reference types="cypress" />

describe('Holder Change', () => {
  Cypress.on('uncaught:exception', (error, runnable) => {
    console.error(error)
    return false
  })

  beforeEach(() => {
    cy.visit('/holder-change')
    cy.fixture('holderChange.json').as('data')
    cy.fixture('holderChangePersonaldata.json').as('personaldata')
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
      cy.identifyHolder(this.personaldata.vat)

      cy.get('[data-cy=next]').should('not.have.class', 'Mui-disabled')
      cy.get('[data-cy=next]').click()
    })
  })

  describe('Enter CUPS', function () {
    beforeEach(function () {
      cy.identifyHolder(this.personaldata.vat)
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

      cy.holderChangeIdentSupplyPoint(this.personaldata.cups)

      cy.get('[data-cy=next]').should('not.have.class', 'Mui-disabled')
      cy.get('[data-cy=next]').click()
    })
  })

  describe('Become member step', function () {

    it('Check become member option: skip if holder is member', function () {
      cy.identifyHolder(this.personaldata.memberVat)
      cy.get('[data-cy=next]').click()

      cy.holderChangeIdentSupplyPoint(this.personaldata.cups)
      cy.get('[data-cy=next]').click()

      cy.contains('Datos personales de la nueva persona titular', {
        matchCase: false
      })

      it('Check become member option: yes', function () {
        cy.identifyHolder(this.data.randomVat)
        cy.get('[data-cy=next]').click()

        cy.holderChangeIdentSupplyPoint(this.personaldata.cups)
        cy.get('[data-cy=next]').click()

        cy.get(`[data-value="${this.data.becomeMember}"]`).click()
        cy.get('[data-cy=next]').should('not.have.class', 'Mui-disabled')
        cy.get('[data-cy=next]').click()

        cy.contains('Datos personales de la nueva persona titular', {
          matchCase: false
        })
      })

      it('Check become member option: no', function () {
        cy.identifyHolder(this.data.randomVat)
        cy.get('[data-cy=next]').click()

        cy.holderChangeIdentSupplyPoint(this.data.cups)
        cy.get('[data-cy=next]').click()

        cy.get(`[data-value="${this.data.noBecomeMember}"]`).click()
        cy.get('[data-cy=next]').should('not.have.class', 'Mui-disabled')

        cy.contains('Cuál es tu caso', { matchCase: false })
      })
    })

    describe('Select your case step', function () {
      beforeEach(function () {
        cy.identifyHolder(this.data.randomVat)
        cy.get('[data-cy=next]').click()

        cy.holderChangeIdentSupplyPoint(this.personaldata.cups)
        cy.get('[data-cy=next]').click()

        // TODO: create a cy.function for this
        cy.get(`[data-value="${this.data.noBecomeMember}"]`).click()
        cy.get('[data-cy=next]').click()
      })

      it('Select your case option: link member', function () {
        cy.get(`[data-value="${this.data.linkMember}"]`).click()
        cy.get('[data-cy=next]').should('not.have.class', 'Mui-disabled')
        cy.get('[data-cy=next]').click()

        cy.contains('Asóciate o vincula tu contrato', { matchCase: false })
      })

      it('Select your case option: trial period', function () {
        cy.get(`[data-value="${this.data.noLinkMember}"]`).click()
        cy.get('[data-cy=next]').should('not.have.class', 'Mui-disabled')
        cy.get('[data-cy=next]').click()

        cy.contains('¡Contrata ahora y decide más adelante si quieres asociarte a la cooperativa!', {
          matchCase: false
        })
      })
    })

    describe('Link member step', function () {
      beforeEach(function () {
        cy.identifyHolder(this.data.randomVat)
        cy.get('[data-cy=next]').click()

        cy.holderChangeIdentSupplyPoint(this.personaldata.cups)
        cy.get('[data-cy=next]').click()

        // TODO: create a cy.function for this
        cy.get(`[data-value="${this.data.noBecomeMember}"]`).click()
        cy.get('[data-cy=next]').click()

        // TODO: create a cy.function for this
        cy.get(`[data-value="${this.data.linkMember}"]`).click()
        cy.get('[data-cy=next]').click()
      })

      it('Link member step: link member', function () {
        cy.get('[name="member.number"]')
          .type(this.personaldata.memberNumber)
          .should('have.value', this.personaldata.memberNumber)
        cy.get('[name="member.vat"]')
          .type(this.personaldata.memberVat)
          .should('have.value', this.personaldata.memberVat)
        cy.get('[data-cy=next]').click()

        cy.contains('Datos personales de la nueva persona titular', {
          matchCase: false
        })
      })
    })

    describe.skip('Enter personal data', function () {
      beforeEach(function () {
        cy.identifyHolder(this.data.vat)
        cy.get('[data-cy=next]').click()

        cy.holderChangeIdentSupplyPoint(this.personaldata.cups)
        cy.get('[data-cy=next]').click()
      })

      it('Enter personal data', function () {
        cy.get('[data-cy=next]').should('have.class', 'Mui-disabled')

        cy.holderChangePersonalData(this.data)

        cy.get('[data-cy=next]').should('not.have.class', 'Mui-disabled')
        cy.get('[data-cy=next]').click()
      })
    })

    describe('Voluntary cent step', function () {
      beforeEach(function () {
        cy.identifyHolder(this.personaldata.memberVat)
        cy.get('[data-cy=next]').click()

        cy.holderChangeIdentSupplyPoint(this.personaldata.cups)
        cy.get('[data-cy=next]').click()

        cy.holderChangePersonalData(this.data)
        cy.get('[data-cy=next]').click()
      })

      it('Check voluntary cent option', function () {
        cy.get(`[data-value="${this.data.voluntaryCent}"]`).click()
        cy.get('[data-cy=next]').should('not.have.class', 'Mui-disabled')

        cy.get('[data-cy=next]').click()
      })
    })

    describe('Special cases step', function () {
      beforeEach(function () {
        cy.identifyHolder(this.personaldata.memberVat)
        cy.get('[data-cy=next]').click()

        cy.holderChangeIdentSupplyPoint(this.personaldata.cups)
        cy.get('[data-cy=next]').click()

        cy.holderChangePersonalData(this.data)
        cy.get('[data-cy=next]').click()

        cy.get(`[data-value="${this.data.voluntaryCent}"]`).click()
        cy.get('[data-cy=next]').click()
      })

      it('Check special cases default', function () {
        cy.get('[data-cy=next]').should('not.have.class', 'Mui-disabled')

        cy.get('input[name="especial_cases.reason_death"]').click()
        cy.get('[data-cy=next]').should('have.class', 'Mui-disabled')
        cy.get('input[name="especial_cases.reason_death"]').click()

        cy.get('input[name="especial_cases.reason_default"]').click()
        cy.get('[data-cy=next]').should('not.have.class', 'Mui-disabled')

        cy.get('[data-cy=next]').click()
      })
    })

    describe('Payment step', function () {
      beforeEach(function () {
        cy.identifyHolder(this.personaldata.memberVat)
        cy.get('[data-cy=next]').click()

        cy.holderChangeIdentSupplyPoint(this.personaldata.cups)
        cy.get('[data-cy=next]').click()

        cy.holderChangePersonalData(this.data)
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
      it('Review holder change data: holder in trial period', function () {
        cy.identifyHolder(this.data.randomVat)
        cy.get('[data-cy=next]').click()

        cy.holderChangeIdentSupplyPoint(this.personaldata.cups)
        cy.get('[data-cy=next]').click()

        // TODO: create a cy.function for this
        cy.get(`[data-value="${this.data.noBecomeMember}"]`).click()
        cy.get('[data-cy=next]').click()

        // TODO: create a cy.function for this
        cy.get(`[data-value="${this.data.noLinkMember}"]`).click()
        cy.get('[data-cy=next]').click()

        cy.holderChangePersonalData(this.data)
        cy.get('[data-cy=next]').click()

        cy.enterVoluntaryCent(this.data.voluntaryCent)

        cy.get('[data-cy=next]').click()

        cy.enterPaymentData(this.data.iban)

        // Review page
        cy.contains('revisa y confirma el contrato', { matchCase: false })

        cy.contains(
          'ofrecemos la posibilidad de contratar durante un año el suministro eléctrico',
          { matchCase: false }
        )

        cy.contains('socio o socia vinculado', { matchCase: false }).should(
          'not.exist'
        )
      })

      it('Review holder change data', function () {
        cy.identifyHolder(this.personaldata.memberVat)
        cy.get('[data-cy=next]').click()

        cy.holderChangeIdentSupplyPoint(this.personaldata.cups)
        cy.get('[data-cy=next]').click()

        cy.holderChangePersonalData(this.data)
        cy.get('[data-cy=next]').click()

        cy.enterVoluntaryCent(this.data.voluntaryCent)

        cy.get('[data-cy=next]').click()

        cy.enterPaymentData(this.data.iban)

        // Review page
        cy.contains('revisa y confirma el contrato', { matchCase: false })
        cy.contains(this.personaldata.memberVat, { matchCase: false })

        cy.contains(
          'ofrecemos la posibilidad de contratar durante un año el suministro eléctrico',
          { matchCase: false }
        ).should('not.exist')
        cy.contains('socio o socia vinculado', { matchCase: false })

        cy.get('[data-cy=submit]').should('have.class', 'Mui-disabled')

        cy.contains('acepto las condiciones', { matchCase: false }).click()
        cy.contains('condiciones generales', { matchCase: false })
        cy.get('[data-cy=accept]').click()

        cy.get('[data-cy=submit]').should('not.have.class', 'Mui-disabled')

        cy.intercept('POST', '/form/holderchange', {
          statusCode: 200
        }).as('holderChangePost')

        cy.get('[data-cy=submit]').click()

        cy.wait('@holderChangePost')
          .its('response.statusCode')
          .should('be.oneOf', [200, 300])

        cy.contains('hemos tramitado con éxito tu solicitud', {
          matchCase: false
        })
      })
    })
  })
})
