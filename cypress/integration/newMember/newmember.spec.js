export const WAIT_TIME = 3000

describe('Member', () => {
  Cypress.on('uncaught:exception', (error, runnable) => {
    console.error(error)
    return false
  })

  beforeEach(() => {
    cy.visit('/ca/new-member-form')
    cy.fixture('newMember.json').as('data')
  })

  describe('Modify summary physical member code ', function () {
    it('New physical member', function () {
      cy.identifyNewMember(this.data.personalPhysicalData.nif)
      cy.personalPhysicalDataMember(this.data.personalPhysicalData, this.data.validAddress)
      cy.choosePaymentMethod()
      cy.paymentData(this.data.personalPhysicalData.iban)
      cy.checkReviewNewMemberStep(this.data.personalPhysicalData.nif)

      cy.get('button').contains('74865726J').click()
      cy.get('[data-cy=next]').click()
      cy.get('[data-cy=next]').click()
      cy.checkReviewNewMemberStep(this.data.personalPhysicalData.nif)
    })
  })

  describe('Modify summary legal member code ', function () {
    it('New legal member', function () {
      cy.identifyNewMember(this.data.personalLegalData.nif)
      cy.personalLegalDataMember(this.data.personalLegalData, this.data.validAddress, this.is_physical)
      cy.choosePaymentMethod()
      cy.paymentData(this.data.personalLegalData.iban)
      cy.checkReviewNewMemberStep(this.data.personalLegalData.nif)

      cy.get('button').contains('Q9213530J').click()
      cy.get('[data-cy=next]').click()
      cy.get('[data-cy=next]').click()
      cy.checkReviewNewMemberStep(this.data.personalLegalData.nif)
    })
  })
})
