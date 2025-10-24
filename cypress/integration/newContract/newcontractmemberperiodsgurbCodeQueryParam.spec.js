export const WAIT_TIME = 3000


describe('New Contract: results with gurbCode query param', () => {
  const gurbCode = 'a_valid_gurb_code';

  Cypress.on('uncaught:exception', (error, runnable) => {
    console.error(error)
    return false
  })

  beforeEach(() => {
    cy.visit(`/ca/formulario-contratacion-periodos?gurb-code=${gurbCode}`)
    cy.fixture('newContractMember.json').as('data')
  })

  describe('New contract ok with gurb code', function () {
    it('renders the redirect component', function () {
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
      cy.acceptTermsAndsubmitNewContractWithGurbCode(true)
      cy.resultRedirectComponent(gurbCode)
    })
  })
})