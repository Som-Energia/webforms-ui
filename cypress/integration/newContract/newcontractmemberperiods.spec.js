export const WAIT_TIME = 3000

describe('New Contract with New Member', () => {
  Cypress.on('uncaught:exception', (error, runnable) => {
    console.error(error)
    return false
  })

  beforeEach(() => {
    cy.visit('/ca/formulario-contratacion-periodos')
    cy.fixture('newContractMember.json').as('data')
  })

  describe('New contract and physical member without optional data', function () {
    it('New contract and physical member without option data', function () {
      cy.contractMemberQuestion('member-off')
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

  describe('New contract light-off member-off', function () {
    it('New contract light-off member-off', function () {
      cy.contractMemberQuestion('member-off')
      cy.identifyNewMember(this.data.personalPhysicalData.nif)
      cy.personalPhysicalDataMember(
        this.data.personalPhysicalData,
        this.data.validAddress
      )
      cy.newContractIdentifySupplyPoint(
        this.data.supplyPoint.cups,
        "light-off"
      )
      cy.newContractSupplyPointData(this.data)
      cy.choosePower({ powers: [2, 3] })
      cy.contractMemberDonationQuestion()
      cy.contractMemberPaymentData(this.data.paymentData)
      cy.contractMemberCheckReviewNewMemberStep(
        this.data.personalPhysicalData.nif
      )
    })
  })

  describe('New contract light-off member-on', function () {
    it('New contract light-off member-on', function () {
      cy.contractMemberQuestion('member-on')
      cy.identifyMember(this.data.linkMember)
      cy.newContractIdentifySupplyPoint(
        this.data.supplyPoint.cups,
        "light-off"
      )
      cy.newContractSupplyPointData(this.data)
      cy.choosePower({ powers: [2, 3] })
      cy.contractMemberDonationQuestion()
      cy.contractMemberPaymentData(this.data.paymentData, 'member-on')
      cy.contractMemberCheckReviewNewMemberStep(
        this.data.linkMember.nif, 'member-on'
      )
    })
  })

  describe('New contract light-on member-link', function () {
    it('New contract light-on member-link', function () {
      cy.contractMemberQuestion('member-link')
      cy.identifyMember(this.data.linkMember)
      cy.newContractIdentifySupplyPoint(
        this.data.supplyPoint.cups,
        "light-on"
      )
      cy.newContractSupplyPointData(this.data)
      cy.choosePower({ powers: [2, 3] })
      cy.selfconsumptionQuestion(false)
      cy.contractMemberHolderQuestion("light-on")
      cy.nifAndPersonalLegalDataMember(
        this.data.personalLegalData.nif,
        this.data.personalLegalData,
        this.data.validAddress,
        true
      )
      cy.contractMemberDonationQuestion()
      cy.contractMemberPaymentData(this.data.paymentData, 'member-on')
      cy.contractMemberCheckReviewNewMemberStep(
        this.data.personalLegalData.nif, 'member-on'
      )
    })
  })

  describe('New contract light-off member-link', function () {
    it('New contract light-off member-link', function () {
      cy.contractMemberQuestion('member-link')
      cy.identifyMember(this.data.linkMember)
      cy.newContractIdentifySupplyPoint(
        this.data.supplyPoint.cups,
        "light-off"
      )
      cy.newContractSupplyPointData(this.data)
      cy.choosePower({ powers: [2, 3] })
      cy.nifAndPersonalLegalDataMember(
        this.data.personalLegalData.nif,
        this.data.personalLegalData,
        this.data.validAddress,
        true
      )
      cy.contractMemberDonationQuestion()
      cy.contractMemberPaymentData(this.data.paymentData, 'member-on')
      cy.contractMemberCheckReviewNewMemberStep(
        this.data.personalLegalData.nif, 'member-on'
      )
    })
  })

  describe('New contract and physical member with optional data', function () {
    it('New contract and physical member with optional data', function () {
      cy.contractMemberQuestion('member-off')
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
      cy.contractMemberQuestion('member-off')
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
    cy.visit('/ca/formulario-contratacion-periodos')
    cy.fixture('newContractMember.json').as('data')
  })

  describe('New contract ok final screen', function () {
    it('shows ok result', function () {
      cy.contractMemberQuestion('member-off')
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
      cy.contractMemberQuestion('member-off')
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
