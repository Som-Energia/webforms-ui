export const WAIT_TIME = 3000

describe('Contract', () => {
  Cypress.on('uncaught:exception', (error, runnable) => {
    console.error(error)
    return false
  })

  beforeEach(() => {
    cy.visit('/ca/gurb/validations')
    cy.fixture('gurb.json').as('data')
    cy.fixture('holderChangePersonaldata.json').as('personaldata')
  })

  describe('New contract', function () {  // TODO: before and after
    it('New member', function () {
      cy.identifySupplyPointGURB(this.data.supplyPoint.cups)

      cy.lightQuestion()

      cy.gurbAddress(this.personaldata.validGurbAddress)

      cy.selfconsumptionQuestion(false)

      cy.memberQuestion('member-off')

      cy.personalDataMember(this.data.personalData)

      cy.get('[data-cy="success_link"]').click()

      cy.identifyHolderGURB(this.personaldata.vat)  // Test whats happend if VAT is same as newMember VAT

      cy.personalDataHolder(this.data.personalData)

      cy.taxAddress({ ...this.personaldata.invalidGurbAddress, sameDirection: true })

      cy.choosePower({ powers: [2, 3] })

      cy.supplyPointData()

      cy.donationQuestion()

      cy.paymentData(this.data.randomIban)
    })

    it('Already member', function () {
      cy.identifySupplyPointGURB(this.data.supplyPoint.cups)

      cy.lightQuestion()

      cy.gurbAddress(this.personaldata.validGurbAddress)

      cy.selfconsumptionQuestion(false)

      cy.memberQuestion('member-on')

      cy.identifyMemberGURB({ vat: this.personaldata.memberVat, number: this.personaldata.memberNumber })

      cy.identifyHolderGURB(this.personaldata.vat)  // Test whats happend if VAT is same as newMember VAT

      cy.personalDataHolder(this.data.personalData)

      cy.taxAddress({ ...this.personaldata.invalidGurbAddress, sameDirection: true })

      cy.choosePower({ powers: [2, 3] })

      cy.supplyPointData()

      cy.donationQuestion()

      cy.paymentData(this.data.randomIban)
    })

    it('Apadrinating', function () {
      cy.identifySupplyPointGURB(this.data.supplyPoint.cups)

      cy.lightQuestion()

      cy.gurbAddress(this.personaldata.validGurbAddress)

      cy.selfconsumptionQuestion(false)

      cy.memberQuestion('apadrinating')

      cy.identifyMemberGURB({ vat: this.personaldata.memberVat, number: this.personaldata.memberNumber })

      cy.identifyHolderGURB(this.personaldata.vat)  // Test whats happend if VAT is same as newMember VAT

      cy.personalDataHolder(this.data.personalData)

      cy.taxAddress({ ...this.personaldata.invalidGurbAddress, sameDirection: true })

      cy.choosePower({ powers: [2, 3] })

      cy.supplyPointData()

      cy.donationQuestion()

      cy.paymentData(this.data.randomIban)
    })
  })
})
