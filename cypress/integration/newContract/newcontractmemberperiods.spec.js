export const WAIT_TIME = 3000

describe('New Contract with New Member', () => {
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
      cy.contractMemberCheckReviewNewMemberStep(
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
      cy.contractMemberCheckReviewNewMemberStep(
        this.data.personalPhysicalData.nif
      )
    })
  })

  describe('New contract and legal member without optional data', function () {
    it('New contract and legal member without option data', function () {
      cy.contractMemberQuestion()
      cy.identifyNewMember(this.data.personalLegalData.nif)
      cy.personalLegalDataMember(
        this.data.personalLegalData,
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
      cy.contractMemberCheckReviewNewMemberStep(this.data.personalLegalData.nif)
    })
  })
})

describe('New Contract: results', () => {
  Cypress.on('uncaught:exception', (error, runnable) => {
    console.error(error)
    return false
  })

  beforeEach(() => {
    cy.visit('/ca/new-contract-form/periods')
    cy.fixture('newContractMember.json').as('data')
  })

  describe('New contract ok final screen', function () {
    it('shows ok result', function () {
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
      cy.contractMemberCheckReviewNewMemberStep(
        this.data.personalPhysicalData.nif
      )
      cy.acceptTermsAndsubmitNewContract(true)
    })
  })

  describe('New contract ko final screen', function () {
    it('shows ko result', function () {
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
      cy.contractMemberCheckReviewNewMemberStep(
        this.data.personalPhysicalData.nif
      )
      cy.acceptTermsAndsubmitNewContract(false)
    })
  })
})
