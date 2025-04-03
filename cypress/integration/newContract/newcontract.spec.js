export const WAIT_TIME = 3000

describe('Contract', () => {
  Cypress.on('uncaught:exception', (error, runnable) => {
    console.error(error)
    return false
  })

  beforeEach(() => {
    cy.visit('/ca/new-contract-form')
    cy.fixture('newContract.json').as('data')
    cy.fixture('holderChangePersonaldata.json').as('personaldata')
    cy.fixture('contracts/prices.json').as('prices')
  })

  describe('Modify summary member code ', function () {
    it('New member', function () {
      cy.identifyMember({ vat: this.personaldata.memberVat, number: this.personaldata.memberNumber })
      cy.identifyHolder(this.personaldata.vat)
      cy.personalDataHolder(this.data.personalData)
      cy.taxAddress({ ...this.personaldata.invalidGurbAddress, sameDirection: true })
      cy.supplyPointData()
      cy.choosePower({ powers: [2, 3] })
      cy.chooseTariff()
      cy.donationQuestion()
      cy.paymentData(this.data.randomIban)
      cy.prices(this.prices)
      cy.checkReviewContractStep(this.personaldata.memberNumber)

      cy.get('button').contains('518').click()
      cy.get('[data-cy=next]').click()
      cy.checkReviewContractStep(this.personaldata.memberNumber)
    })
  })
})
