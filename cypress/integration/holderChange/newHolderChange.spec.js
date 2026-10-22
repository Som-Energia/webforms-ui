const specialReasons = ["reason_death", "reason_merge", "reason_electrodep"]
const specialReasonsWithManyAttachments = ["reason_electrodep"]

describe('Holder Change', () => {
  Cypress.on('uncaught:exception', (error) => {
    console.error(error)
    return false
  })

  beforeEach(() => {
    cy.wait(2000) // Avoid pre-api maintance dialog
    cy.visit('/es/formuario-cambio-titular')
    cy.fixture('holderChange.json').as('data')
    cy.fixture('holderChangePersonaldata.json').as('personaldata')
    cy.fixture('contract.json').as('dataContract')

    // New member
    cy.fixture('newContractMember.json').as('newMember')
  })

  const enterCups = (cups, statusCode) => {
    cy.intercept('GET', '/check/cups/**').as('checkCups')

    cy.get('[data-cy=cups-input]')
      .clear()
      .type(cups)
      .should('have.value', cups)

    cy.wait('@checkCups')
      .its('response.statusCode')
      .should('eq', statusCode)

    cy.get('[data-cy=cups-input]').blur()
  }

  const completeStep1 = (cups) => {
    cy.get('[data-cy=next]').should('have.class', 'Mui-disabled')

    enterCups(cups, 200)

    cy.get('[data-cy=supply_point_accepted]').click()
    cy.get('[data-cy=accept]').click()
    cy.get('input[name="supply_point.verified"]').click()
    cy.get('[data-cy=next]').should('not.have.class', 'Mui-disabled')
    cy.get('[data-cy=next]').click()
  }

  const completeStep2 = () => {
    cy.contractMemberQuestion('member-off')
    cy.get('[data-cy=next]').click()
  }

  const completeStep3 = (vat) => {
    cy.identifyNewMember(vat)
  }

  const completeStep4 = ({ personalPhysicalData, validAddress }) => {
    cy.personalPhysicalDataMember(personalPhysicalData, validAddress)
  }

  const completeStep5_SelectHolderChangeReason = (reason, fileName) => {
    cy.get(`[data-cy="${reason}"]`).click()
    // Attach file
    if (specialReasons.includes(reason)) {

      cy.get('[data-cy=next]').should('have.class', 'Mui-disabled')
      cy.get('input[type=file]').first().selectFile({
        contents: Cypress.Buffer.from('file contents'),
        fileName: fileName,
        mimeType: 'application/pdf',
        lastModified: Date.now(),
        }, {
          force: true // because input[type=file] has display none style
        }
      )

      cy.wait(500)

      if (specialReasonsWithManyAttachments.includes(reason)) {
        cy.get('[data-cy=next]').should('have.class', 'Mui-disabled')
        cy.get('input[type=file]').eq(1).selectFile({
          contents: Cypress.Buffer.from('file contents'),
          fileName: fileName,
          mimeType: 'application/pdf',
          lastModified: Date.now(),
        }, {
          force: true // because input[type=file] has display none style
        })
        cy.wait(500)
      }
    }

    cy.get('[data-cy=next]').should('not.have.class', 'Mui-disabled')
    cy.get('[data-cy=next]').click()
  }

  const completeStep6_DonationQuestion = () => {
    cy.contractMemberDonationQuestion()
  }

  const completeStep7_PaymentData = (newMember) => {
    cy.contractMemberPaymentData(newMember.paymentData)
  }

  const completeStep8_SummaryReview = (newMember) => {
    cy.intercept('GET','/data/prices_by_cups?cups=*&taxes=*', {
      statusCode: 200,
    })

    cy.contractMemberCheckReviewNewMemberStep(
      newMember.personalPhysicalData.nif
    )
  }

  const completeStep9_Signaturit = (cups) => {
    cy.acceptTermsAndsubmitNewContractWithHolderChangeService({ status: true, cups: cups })
  }

  const goToEspecialCasesStep = function () {
    completeStep1(this.personaldata.cups)
    completeStep2()
    completeStep3(this.newMember.personalPhysicalData.nif)
    completeStep4(this.newMember)
  }

  const goToFinalStep = function () {
    completeStep6_DonationQuestion()
    completeStep7_PaymentData(this.newMember)
    completeStep8_SummaryReview(this.newMember)
    completeStep9_Signaturit(this.personaldata.cups)
  }

  it('shows an error when CUPS is invalid', function () {
    const ERROR_STATUS_CODE = 400
    enterCups(this.data.cupsInvalid, ERROR_STATUS_CODE)
    cy.contains('Campo incorrecto')
  })

  it('allows completing the holder change happy path as a new member', function () {
    goToEspecialCasesStep.call(this)
    completeStep5_SelectHolderChangeReason("reason_holder_change")
    goToFinalStep.call(this)
  })

  specialReasons.forEach((reason) => {
    it(`allows completing the holder change with special reason: ${reason}`, function() {
        goToEspecialCasesStep.call(this)
        completeStep5_SelectHolderChangeReason(reason, this.data.attachment)
        goToFinalStep.call(this)
      })
  })
 
})
