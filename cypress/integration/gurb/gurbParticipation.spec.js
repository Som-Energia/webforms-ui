export const WAIT_TIME = 3000
const STATUS_ACTIVE = 'active'

describe('Gurb Participation', () => {
  Cypress.on('uncaught:exception', (error, runnable) => {
    console.error(error)
    return false
  })

  beforeEach(() => {
    cy.visit('/ca/gurb/g003/join')
    cy.fixture('gurb.json').as('data')
    cy.fixture('holderChangePersonaldata.json').as('personaldata')
  })

  describe('Gurb Joining', function () {  // TODO: before and after
    it('New member', function () {
      console.log(this.data)
      cy.identifyPartnerToJoinGurb(this.data.supplyPoint.existing_cups, this.personaldata.vat, this.personaldata.memberNumber, STATUS_ACTIVE)
      cy.selectParticipationOnGurb()
    })
  })
})
