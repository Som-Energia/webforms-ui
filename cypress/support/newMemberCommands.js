Cypress.Commands.add('identifyNewMember', (nif) => {
  cy.get('[data-cy="vat"]').type(nif)
  cy.get('[data-cy=next]').click()
})

Cypress.Commands.add('personalDataMember', (personalData, validAddress, statusCode = 200) => {
  console.log(personalData)
  cy.get('[data-cy="new_member.name"]').type(personalData.name)
  cy.get('[data-cy="new_member.surname1"]').type(personalData.surname1)
  cy.get('[data-cy="new_member.surname2"]').type(personalData.surname2)
  cy.get('[data-cy="address-street"]').type(validAddress.input)
  cy.contains(personalData.street).click()

  cy.get('[data-cy="address.number"]').type('2')
  cy.get('[data-cy="address.floor"]').type('1')
  cy.get('[data-cy="address.door"]').type('3')
  cy.get('[data-cy="address.stairs"]').type('B')
  cy.get('[data-cy="address.bloc"]').type('Omega')
  cy.get('[data-cy="email"]').type(personalData.email)
  cy.get('[data-cy="repeat_email"]').type(personalData.email2)
  cy.get('[data-cy="new_member.phone1"]').type(personalData.phone1)

  cy.get('[data-cy="privacy_policy"]').click()

  cy.get('[data-cy=next]').click()
})

Cypress.Commands.add('choosePaymentMethod', ( creditCard = false ) => {
  const optionValue = creditCard ? 'credit-card':'iban'
  cy.get('[data-cy="method-payment-question"]').get(`[data-cy="${optionValue}"]`).click()
})

Cypress.Commands.add('paymentData', (iban) => {
  cy.get('[data-cy="iban_number"]').type(iban)

  cy.get('[data-cy="iban_check"]').click()

  cy.get('[data-cy=next]').click()
})

Cypress.Commands.add('checkReviewNewMemberStep', (memberNumber) => {
  cy.get('p').contains(memberNumber)
})


