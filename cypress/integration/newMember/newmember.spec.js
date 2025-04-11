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

  describe('Modify summary member code ', function () {
    it('New member', function () {
      cy.identifyNewMember(this.data.personaldata.nif)
      cy.personalDataMember(this.data.personaldata, this.data.validAddress)
      cy.choosePaymentMethod()
      cy.paymentData(this.data.personaldata.iban)
      // cy.checkReviewMemberStep(this.personaldata.memberNumber)

      // cy.get('button').contains('518').click()
      // cy.get('[data-cy=next]').click()
      // cy.checkReviewMemberStep(this.personaldata.memberNumber)
    })
  })
})
