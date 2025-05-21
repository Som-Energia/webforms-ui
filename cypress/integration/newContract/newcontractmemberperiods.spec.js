export const WAIT_TIME = 3000

describe('Member', () => {
  Cypress.on('uncaught:exception', (error, runnable) => {
    console.error(error)
    return false
  })

  beforeEach(() => {
    cy.visit('/ca/new-contract-form/periods')
    cy.fixture('newContractMember.json').as('data')
  })

  describe('New contract and physical member without optional data', function () {
    it('New contract and physical member without option data', function () {
      cy.contractMemberQuestion()
      cy.identifyNewMember(this.data.personalPhysicalData.nif)
      cy.personalPhysicalDataMember(
        this.data.personalPhysicalData,
        this.data.validAddress
      )
      cy.newContractIdentifySupplyPoint(
        this.data.supplyPoint.cups,
        this.data.supplyPoint.has_light
      )
      cy.newContractSupplyPointData(this.data)
      cy.choosePower({ powers: [2, 3] })
      cy.selfconsumptionQuestion(true)
      cy.selfconsumptionData(this.data.selfConsumption)
      cy.contractMemberHolderQuestion()
      cy.contractMemberDonationQuestion()
      cy.contractMemberPaymentData(this.data.paymentData)
      cy.contractMemberPersonalPhysicalcheckReviewNewMemberStep(
        this.data.personalPhysicalData.nif
      )
    })
  })

  describe('New contract and physical member with optional data', function () {
    it('New contract and physical member with optional data', function () {
      cy.contractMemberQuestion()
      cy.identifyNewMember(this.data.personalPhysicalData.nif)
      cy.personalPhysicalDataMember(
        this.data.personalPhysicalData,
        this.data.validAddress,
        true
      )
      cy.newContractIdentifySupplyPoint(
        this.data.supplyPoint.cups,
        this.data.supplyPoint.has_light
      )
      cy.newContractSupplyPointData(this.data)
      cy.choosePower({ powers: [2, 3] })
      cy.selfconsumptionQuestion(true)
      cy.selfconsumptionData(this.data.selfConsumption)
      cy.contractMemberHolderQuestion()
      cy.contractMemberDonationQuestion()
      cy.contractMemberPaymentData(this.data.paymentData)
      cy.contractMemberPersonalPhysicalcheckReviewNewMemberStep(
        this.data.personalPhysicalData.nif
      )
    })
  })
})
