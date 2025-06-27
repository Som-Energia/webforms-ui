describe('Contract', () => {
  Cypress.on('uncaught:exception', (error, runnable) => {
    console.error(error)
    return false
  })

  beforeEach(() => {
    cy.visit('/es/contract-20')
    cy.fixture('contract.json').as('data')
  })

  describe('Contract with CUPS without service', function () {
    beforeEach(function () {
      cy.oldIidentifyMember(this.data.member.number, this.data.member.vat)
      cy.identifySupplyPoint(
        this.data.supplyPoint.cups,
        this.data.supplyPoint.hasNoService
      )
      cy.enterSupplyPointData(this.data.supplyPoint)
    })

     it('Can not contract 3.0TD', function () {
      if (Cypress.env('FEATURE_FLAGS').is30ContractEnabled) {
        this.skip()
      }
      const moreThan15Kw = true

      cy.choosePhase(this.data.phase)

      cy.chooseMoreOrLessThan15Kw(moreThan15Kw)

      cy.get('.MuiAlert-message').contains('no es posible contratar')
    })

    it('Contract with 2.0TD', function () {
      const moreThan15Kw = false
      const powers = [this.data.power, this.data.power2]

      cy.choosePhase(this.data.phase)

      cy.enterPowerFare(moreThan15Kw, powers)

      cy.oldChooseTariff(this.data.isIndexed)

      cy.identifyOwner(this.data.member.vat)

      cy.enterVoluntaryCent(this.data.holder.voluntaryCent)

      cy.enterPaymentData(this.data.holder.iban)

      cy.reviewAndConfirmData()

      cy.get('[data-cy=submit]').should('not.have.class', 'Mui-disabled')

    })
  })

  describe('Contract with service, no selfconsumption, correct data', function () {
    beforeEach(function () {
      cy.oldIidentifyMember(this.data.member.number, this.data.member.vat)
      cy.identifySupplyPoint(
        this.data.supplyPoint.cups,
        this.data.supplyPoint.hasService
      )
      cy.enterSupplyPointData(this.data.supplyPoint
      )
    })

     it('Can not contract 3.0TD', function () {
      if (Cypress.env('FEATURE_FLAGS').is30ContractEnabled) {
        this.skip()
      }
      const moreThan15Kw = true

      cy.chooseMoreOrLessThan15Kw(moreThan15Kw)

      cy.get('.MuiAlert-message').contains('no es posible contratar')
    })

    it('Contract with 2.0TD', function () {
      const moreThan15Kw = false
      const powers = [this.data.power, this.data.power2]

      cy.enterPowerFare(moreThan15Kw, powers)

      cy.oldChooseTariff(this.data.isIndexed)

      cy.enterSelfConsumption(this.data.selfConsumption.have_no_installation)

      cy.identifyOwner(this.data.member.vat, this.data.holder.previousHolder)

      cy.enterVoluntaryCent(this.data.holder.voluntaryCent)

      cy.enterPaymentData(this.data.holder.iban)

      cy.reviewAndConfirmData()

      cy.get('[data-cy=submit]').should('not.have.class', 'Mui-disabled')

    })
  })
})
