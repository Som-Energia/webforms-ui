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

      cy.chooseTariff(this.data.isIndexed)

      cy.identifyOwner(this.data.member.vat)

      cy.enterVoluntaryCent(this.data.holder.voluntaryCent)

      cy.enterPaymentData(this.data.holder.iban)

      cy.reviewAndConfirmData()

      cy.get('[data-cy=submit]').should('not.have.class', 'Mui-disabled')

    })
  })
})
