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
    cy.fixture('gurbPersonaldata.json').as('personalData')
  })

  describe('Gurb Joining', function () {
    // TODO: before and after
    it('New member', function () {
      cy.identifyPartnerToJoinGurb(
        this.personalData.cups,
        this.personalData.vat,
        STATUS_ACTIVE
      )
      cy.selectParticipationOnGurb()
      cy.acceptAllConditionsOnGurb()
    })
  })
})
