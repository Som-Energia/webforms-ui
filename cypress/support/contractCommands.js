Cypress.Commands.add('generationkwhIdentifyMember', (memberNumber, memberVat, canJoin) => {

  cy.intercept('GET', '/check/soci/**',
    {
      statusCode: 200,
      body: {
        data: true,
        state: true
      }
    }).as('checkMember')

  cy.intercept('GET', '/data/generationkwh/can_join/**', {
    statusCode: 200,
    body: {
      data: canJoin,
      state: true,
      status: "ONLINE"
    }
  }).as('canJoin')

  cy.get('#memberNumber')
    .clear()
    .type(memberNumber)
    .should('have.value', memberNumber)

  cy.get('#vat').clear().type(memberVat).should('have.value', memberVat)

  cy.wait('@checkMember')
    .its('response.statusCode')
    .should('be.oneOf', [200, 304])

  cy.wait('@canJoin')
    .its('response.statusCode')
    .should('be.oneOf', [200, 304])

})



Cypress.Commands.add('identifyGenerationCanJoin', (memberNumber, memberVat) => {
  cy.intercept('GET', '/data/generationkwh/can_join/**', {
    statusCode: 200,
    body: {
      data: true,
      state: true,
      status: 'ONLINE'
    }
  }).as('canJoin')

  cy.get('#memberNumber')
    .clear()
    .type(memberNumber)
    .should('have.value', memberNumber)

  cy.get('#vat').clear().type(memberVat).should('have.value', memberVat)

  cy.wait('@canJoin').its('response.statusCode').should('be.oneOf', [200, 304])
})


Cypress.Commands.add('typeIbanGenerationkwh', (iban, statusCode) => {

  cy.get('[name="payment.iban"]')
    .clear()
    .type(iban)
    .should('have.value', iban)

})



Cypress.Commands.add('identifySupplyPoint', (cups, hasService) => {

  cy.intercept('GET', '/check/cups/status/*',
    {
      statusCode: 200,
      body: {
        data: {
          cups: cups,
          status: "new",
          tariff_type: null
        },
        state: true,
        status: "ONLINE"
      }
    }).as('checkCUPS')

  cy.get('#cups')
    .clear()
    .type(cups)
    .should('have.value', cups)
    // Extra validation is done when bluring so blur before continue
    .blur()

  cy.wait('@checkCUPS')
  // Wait for the cups to be validated
  cy.get('#cups[aria-invalid=false]', { timeout: 3000 })

  cy.get(`[data-value="${hasService}"]`).click()

  cy.get('[data-cy=next]').click()
})

Cypress.Commands.add('enterVoluntaryCent', (voluntaryCent) => {
  cy.get(`[data-value="${voluntaryCent}"]`).click()

  cy.get('[data-cy=next]').click()
})

Cypress.Commands.add('enterPaymentData', (paymentIban) => {
  cy.get('[name="payment.iban"]')
    .clear()
    .type(paymentIban)
    .should('have.value', paymentIban)

  cy.get('[name="payment.sepa_accepted"]').click()
  cy.get('[data-cy=accept]').click()
  cy.get('[data-cy=next]').click()
})
