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
      cy.identifyMember(this.data.member.number, this.data.member.vat)
      cy.identifySupplyPoint(
        this.data.supplyPoint.cups,
        this.data.supplyPoint.hasNoService
      )
      cy.enterSupplyPointData(this.data.supplyPoint)
    })

    it('Can not contract 3.0TD', function () {
      const moreThan15Kw = true

      cy.choosePhase(this.data.phase)

      cy.chooseMoreOrLessThan15Kw(moreThan15Kw)

      cy.get('.MuiAlert-message').contains('no es posible contratar')
    })

    it('Contract with 2.0TD', function () {
      const moreThan15Kw = false
      const powers = [this.data.power, this.data.power2]

      cy.enterPowerFare(this.data.phase, moreThan15Kw, powers)

      cy.identifyOwner(this.data.member.vat)

      cy.enterVoluntaryCent(this.data.holder.voluntaryCent)

      cy.enterPaymentData(this.data.holder.iban)

      cy.reviewAndConfirmData()
    })

    // contract 3.0TD not allowed
    it.skip('3.0TD no incremental powers', function () {
      const moreThan15Kw = true
      const powers = [
        this.data.power,
        this.data.power2,
        this.data.power3,
        this.data.power6,
        this.data.power6,
        this.data.power
      ]

      cy.noIncrementalPowers(this.data.phase, moreThan15Kw, powers)
    })
  })
})
