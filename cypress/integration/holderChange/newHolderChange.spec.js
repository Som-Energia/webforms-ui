describe('Holder Change', () => {
  Cypress.on('uncaught:exception', (error) => {
    console.error(error)
    return false
  })

  beforeEach(() => {
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

  const completeStep5 = () => {
    cy.get('[data-cy="reason_holder_change"]').click()
    cy.get('[data-cy=next]').should('not.have.class', 'Mui-disabled')
    cy.get('[data-cy=next]').click()
  }

  const completeStep6 = () => {
    cy.contractMemberDonationQuestion()
  }

  const completeStep7 = (newMember) => {
    cy.contractMemberPaymentData(newMember.paymentData)
  }

  const completeStep8 = (newMember) => {
    cy.contractMemberCheckReviewNewMemberStep(
      newMember.personalPhysicalData.nif
    )
  }

  const goToEspecialCasesStep = function () {
    completeStep1(this.personaldata.cups)
    completeStep2()
    completeStep3(this.newMember.personalPhysicalData.nif)
    completeStep4(this.newMember)
  }

  it('shows an error when CUPS is invalid', function () {
    const ERROR_STATUS_CODE = 400

    enterCups(this.data.cupsInvalid, ERROR_STATUS_CODE)
    cy.contains('El CUPS no tiene ningún contrato activo con Som Energia')
  })

  it('allows completing the holder change happy path as a new member', function () {
    goToEspecialCasesStep.call(this)
    completeStep5()
    completeStep6()
    completeStep7(this.newMember)
    completeStep8(this.newMember)
    // TODO: signaturit
    // TODO: payment
  })

  /*
  cups-input('requires documentation for death reason', function () {
    goToEspecialCasesStep.call(this)

    cy.get('[data-cy="reason_death"]').click()
    cy.get('[data-cy=next]').should('have.class', 'Mui-disabled')

    const fileName = this.data.d1Attachment
    cy.fixture(fileName, 'binary')
      .then(Cypress.Blob.binaryStringToBlob)
      .then((fileContent) =>
        cy.get('input[type=file]').attachFile({
          fileContent,
          fileName,
          mimeType: 'pdf',
          encoding: 'utf8'
        })
      )

    cy.wait(500)
    cy.get('[data-cy=next]').should('not.have.class', 'Mui-disabled')
  })
  */

})
