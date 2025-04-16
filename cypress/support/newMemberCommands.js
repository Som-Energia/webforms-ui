Cypress.Commands.add('identifyNewMember', (nif) => {
  cy.get('[data-cy="new_member.nif"]').type(nif)
  cy.get('[data-cy=next]').click()
})

Cypress.Commands.add('personalPhysicalDataMember', (personalData, validAddress, optionalData = false) => {
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
  cy.get('[data-cy="new_member.email"]').type(personalData.email)
  cy.get('[data-cy="new_member.email2"]').type(personalData.email2)
  cy.get('[data-cy="new_member.phone"]').type(personalData.phone).focused().blur()

  if (optionalData)
  {
    cy.get('[id="new_member.gender"]').click()
    cy.get('[id="new_member.gender-nonbinary"]').click()
    cy.get('[placeholder="DD/MM/YYYY"').type(personalData.birthdate)
    cy.get('[id="new_member.how_meet_us"]').click()
    cy.get('[id="new_member.how_meet_us-O1"]').click()
  }

  cy.get('[data-cy="privacy_policy"]').click()

  cy.get('[data-cy=next]').click()
})

Cypress.Commands.add('personalLegalDataMember', (personalData, validAddress, optionalData = false) => {
  cy.get('[data-cy="new_member.name"]').type(personalData.name)
  cy.get('[data-cy="new_member.proxyname"]').type(personalData.proxyname)
  cy.get('[data-cy="new_member.proxynif"]').type(personalData.proxynif)
  cy.get('[data-cy="address-street"]').type(validAddress.input)
  cy.contains(personalData.street).click()

  cy.get('[data-cy="address.number"]').type('2')
  cy.get('[data-cy="address.floor"]').type('1')
  cy.get('[data-cy="address.door"]').type('3')
  cy.get('[data-cy="address.stairs"]').type('B')
  cy.get('[data-cy="address.bloc"]').type('Omega')
  cy.get('[data-cy="new_member.email"]').type(personalData.email)
  cy.get('[data-cy="new_member.email2"]').type(personalData.email2)
  cy.get('[data-cy="new_member.phone"]').type(personalData.phone).focused().blur()

  if (optionalData)
  {
    cy.get('[id="new_member.how_meet_us"]').click()
    cy.get('[id="new_member.how_meet_us-O1"]').click()
  }

  cy.get('[data-cy="privacy_policy"]').click()
  cy.get('[data-cy="legal_person"]').click()

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

Cypress.Commands.add('checkReviewNewMemberStep', (nif) => {
  cy.get('button').contains(nif)
})


