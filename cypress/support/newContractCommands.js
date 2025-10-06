Cypress.Commands.add('gurbAddress', (street) => {
  cy.get('[data-cy="address"]').type(street.input)
  cy.contains(street.value).click()

  cy.get('[data-cy="address.number"]').clear().type(22, { delay: 100 })
  cy.get('[data-cy="address.floor"]').type('1')
  cy.get('[data-cy="address.door"]').type('3')
  cy.get('[data-cy="address.stairs"]').type('B')
  cy.get('[data-cy="address.bloc"]').type('Omega')

  cy.get('[data-cy=next]').click()
})

Cypress.Commands.add('identifyMember', ({ vat, number }) => {
  cy.get('[data-cy="vat"]').type(vat)
  cy.get('[data-cy="code"]').type(number)

  cy.get('[data-cy=next]').click()
})

Cypress.Commands.add('personalDataMember', (personalData, statusCode = 200) => {
  //Intercept call to check vat
  cy.intercept('GET', '/check/vat/exists/*', {
    statusCode: statusCode,
    body: {
      data: {
        exists: false,
        is_member: false,
        is_selfconsumption_owner: false,
        valid: true
      },
      state: statusCode === 200,
      status: 'ONLINE'
    }
  }).as('checkVAT')

  cy.get('[data-cy="new_member.nif"]').type(personalData.vat)
  cy.get('[data-cy="new_member.name"]').type(personalData.name)
  cy.get('[data-cy="new_member.surname1"]').type(personalData.surname1)
  cy.get('[data-cy="new_member.surname2"]').type(personalData.surname2)
  cy.get('[data-cy="email"]').type(personalData.email)
  cy.get('[data-cy="repeat_email"]').type(personalData.repeat_email)
  cy.get('[data-cy="new_member.phone1"]').type(personalData.phone1)

  cy.get('[data-cy="privacy_policy"]').click()

  cy.get('[data-cy=next]').click()
})

Cypress.Commands.add('identifyHolder', (vat, statusCode = 200) => {
  cy.get('[data-cy="holder_vat"]').type(vat)

  cy.get('[data-cy="has_holder"]').get('[data-cy="holder-same"]').click()

  cy.get('[data-cy=next]').click()
})

Cypress.Commands.add('personalDataHolder', (personalData) => {
  cy.get('[data-cy="holder.name"]').type(personalData.name)
  cy.get('[data-cy="holder.surname1"]').type(personalData.surname1)
  cy.get('[data-cy="holder.surname2"]').type(personalData.surname2)
  cy.get('[data-cy="email"]').type(personalData.email)
  cy.get('[data-cy="repeat_email"]').type(personalData.repeat_email)
  cy.get('[data-cy="holder.phone1"]').type(personalData.phone1)

  cy.get('[data-cy=next]').click()
})

Cypress.Commands.add('taxAddress', ({ sameDirection = true, input, value }) => {
  const optionValue = sameDirection
    ? 'supplypoint-tax-address-same'
    : 'supplypoint-tax-address-different'
  cy.get('[data-cy="sameDirection"]').get(`[data-cy="${optionValue}"]`).click()

  if (!sameDirection) {
    cy.get('[data-cy="tax_address-street"]').type(input)
    cy.contains(value).click()

    cy.get('[data-cy="tax_address.number"]').clear().type(22, { delay: 100 })
    cy.get('[data-cy="tax_address.floor"]').type('6')
    cy.get('[data-cy="tax_address.door"]').type('2')
  }

  cy.get('[data-cy=next]').click()
})

Cypress.Commands.add('choosePower', ({ moreThan15Kw = false, powers }) => {
  const optionValue = moreThan15Kw ? 'power-higher-15kw' : 'power-lower-15kw'
  cy.get('[data-cy="power_question"]').get(`[data-cy="${optionValue}"]`).click()

  powers.forEach((power, index) => {
    cy.get(`[data-cy="contract.power.power${index + 1}"]`).type(power)
  })

  cy.get('[data-cy=next]').click()
})

Cypress.Commands.add('supplyPointData', () => {
  cy.get('[data-cy=select_component]').click()
  cy.get('[data-cy=yes]').click()

  cy.get('[data-cy="supply_point_accepted"]').click()
  cy.get('[data-cy=accept]').click()

  cy.get('[data-cy=next]').click()
})

Cypress.Commands.add('donationQuestion', (donation = true) => {
  const optionValue = donation
    ? 'voluntary-donation-on'
    : 'voluntary-donation-off'
  cy.get('[data-cy="donation_question"]')
    .get(`[data-cy="${optionValue}"]`)
    .click()

  cy.get('[data-cy=next]').click()
})

Cypress.Commands.add('paymentData', (iban, statusCode = 200) => {
  cy.get('[data-cy="iban"]').type(iban)

  cy.get('[data-cy="iban_check"]').click()

  cy.get('[data-cy=next]').click()
})

Cypress.Commands.add('checkReviewContractStep', (memberNumber) => {
  cy.get('p').contains(memberNumber)
})

Cypress.Commands.add('powerChoice', (choice) => {
  cy.get('[data-cy="select_component"]').click()
  cy.get(`[data-cy="${choice}"]`).click()
  cy.get('[data-cy=next]').click()
})

Cypress.Commands.add('chooseTariff', (isIndexed = true) => {
  const optionValue = isIndexed ? 'indexed' : 'periods'
  cy.get('[data-cy="tariffMode"]').get(`[data-cy="${optionValue}"]`).click()

  cy.get('[data-cy=next]').click()
})

Cypress.Commands.add('prices', (prices)=> {
  cy.intercept('GET', '/data/prices*', {
    statusCode: 200,
    body: prices
  })
})

