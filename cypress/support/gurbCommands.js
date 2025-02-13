Cypress.Commands.add('identifySupplyPointGURB', (cups, statusCode = 200) => {

  //Intercept call to check CUPS
  cy.intercept('GET', '/check/cups/status/*',
    {
      statusCode: statusCode,
      body: {
        data: {
          cups: cups,
          status: "new",
          tariff_type: null
        },
        state: statusCode === 200,
        status: "ONLINE"
      }
    }).as('checkCUPS')

  cy.get('[data-cy="cups"]')
    .type(cups)

  cy.get('[data-cy=next]').click()
})

Cypress.Commands.add('lightQuestion', (lightOn = true) => {

  const optionValue = lightOn ? 'light-on' : 'light-off'

  cy.get('[data-cy="light-question"]')
    .get(`[data-cy="${optionValue}"]`)
    .click()
  cy.get('[data-cy=next]').click()
})

Cypress.Commands.add('gurbAddress', (street) => {

  cy.get('[data-cy="address-street"]')
    .type(street.input)
  cy.contains(street.value).click()

  cy.get('[data-cy="address.number"]')
    .clear()
    .type('2')
  // .should('have.value', '2')

  cy.get('[data-cy="address.floor"]')
    .clear()
    .type('1')
  // .should('have.value', '1')

  cy.get('[data-cy="address.door"]')
    .clear()
    .type('3')
  // .should('have.value', '3')

  cy.get('[data-cy="address.stairs"]')
    .clear()
    .type('B')
  // .should('have.value', 'B')

  cy.get('[data-cy="address.bloc"]')
    .clear()
    .type('Omega')
  // .should('have.value', '2')

  cy.get('[data-cy=next]').click()
})

Cypress.Commands.add('selfconsumptionQuestion', (selfconsumption = true) => {

  const optionValue = selfconsumption ? 'selfconsumption-on' : 'selfconsumption-off'

  cy.get('[data-cy="selfconsumption-question"]')
    .get(`[data-cy="${optionValue}"]`)
    .click()
  cy.get('[data-cy=next]').click()
})

Cypress.Commands.add('memberQuestion', (optionValue = 'member-on') => {

  cy.get('[data-cy="member-question"]')
    .get(`[data-cy="${optionValue}"]`)
    .click()
  cy.get('[data-cy=next]').click()
})

Cypress.Commands.add('personalDataMember', (personalData, statusCode = 200) => {

  //Intercept call to check vat
  cy.intercept('GET', '/check/vat/exists/*',
    {
      statusCode: statusCode,
      body: {
        data: {
          exists: false,
          is_member: false,
          is_selfconsumption_owner: false,
          valid: true
        },
        state: statusCode === 200,
        status: "ONLINE"
      }
    }).as('checkVAT')

  cy.get('[data-cy="new_member.nif"]')
    // .clear()
    .type(personalData.vat)
  cy.get('[data-cy="new_member.name"]')
    // .clear()
    .type(personalData.name)
  cy.get('[data-cy="new_member.surname1"]')
    // .clear()
    .type(personalData.surname1)
  cy.get('[data-cy="new_member.surname2"]')
    // .clear()
    .type(personalData.surname2)
  cy.get('[data-cy="email"]')
    // .clear()
    .type(personalData.email)
  cy.get('[data-cy="repeat_email"]')
    // .clear()
    .type(personalData.repeat_email)
  cy.get('[data-cy="new_member.phone1"]')
    // .clear()
    .type(personalData.phone1)

  cy.get('[data-cy="privacy_policy"]').click()

  cy.get('[data-cy=next]').click()
})

Cypress.Commands.add('identifyHolderGURB', (vat, statusCode = 200) => {

  //Intercept call to check vat
  cy.intercept('GET', '/check/vat/*',
    {
      statusCode: statusCode,
      body: {
        data: true,
        state: statusCode === 200,
        status: "ONLINE"
      }
    }).as('checkSyntaxVAT')

  cy.get('[data-cy="holder_vat"]')
    // .clear()
    .type(vat)

  cy.get('[data-cy="has_holder"]')
    .get('[data-cy="holder-same"]')
    .click()

  cy.get('[data-cy=next]').click()
})

Cypress.Commands.add('personalDataHolder', (personalData) => {

  cy.get('[data-cy="holder.name"]')
    // .clear()
    .type(personalData.name)
  cy.get('[data-cy="holder.surname1"]')
    // .clear()
    .type(personalData.surname1)
  cy.get('[data-cy="holder.surname2"]')
    // .clear()
    .type(personalData.surname2)
  cy.get('[data-cy="email"]')
    // .clear()
    .type(personalData.email)
  cy.get('[data-cy="repeat_email"]')
    // .clear()
    .type(personalData.repeat_email)
  cy.get('[data-cy="holder.phone1"]')
    // .clear()
    .type(personalData.phone1)

  cy.get('[data-cy=next]').click()
})

Cypress.Commands.add('taxAddress', ({sameDirection = true, input, value}) => {

  const optionValue = sameDirection ? 'supplypoint-tax-address-same' : 'supplypoint-tax-address-different'

  cy.get('[data-cy="sameDirection"]')
    .get(`[data-cy="${optionValue}"]`)
    .click()

  if (!sameDirection) {
    cy.get('[data-cy="tax_address-street"]')
      .type(input)
    cy.contains(value).click()
  
    cy.get('[data-cy="tax_address.number"]')
      .clear()
      .type('24')
    // .should('have.value', '2')
  
    cy.get('[data-cy="tax_address.floor"]')
      .clear()
      .type('6')
    // .should('have.value', '1')
  
    cy.get('[data-cy="tax_address.door"]')
      .clear()
      .type('2')
    // .should('have.value', '3')
  }

  cy.get('[data-cy=next]').click()
})

Cypress.Commands.add('choosePower', ({moreThan15Kw = false, powers}) => {

  const optionValue = moreThan15Kw ? 'power-higher-15kw' : 'power-lower-15kw'

  cy.get('[data-cy="power_question"]')
    .get(`[data-cy="${optionValue}"]`)
    .click()

  powers.forEach((power, index) => {
    cy.get(`[data-cy="contract.power.power${index+1}"]`)
      // .clear()
      .type(power)
    // .should('have.value', power)
  })

  cy.get('[data-cy=next]').click()
})

Cypress.Commands.add('supplyPointData', () => {

  cy.get('[data-cy="supply_point_accepted"]').click()
  cy.get('[data-cy=accept]').click()

  cy.get('[data-cy=next]').click()
})

Cypress.Commands.add('donationQuestion', (donation = true) => {

  const optionValue = donation ? 'voluntary-donation-on' : 'voluntary-donation-off'

  cy.get('[data-cy="donation_question"]')
    .get(`[data-cy="${optionValue}"]`)
    .click()
  cy.get('[data-cy=next]').click()
})

Cypress.Commands.add('paymentData', (iban) => {

  cy.get('[data-cy="iban"]')
  // .clear()
  .type(iban)

  cy.get('[data-cy="iban_check"]').click()

  cy.get('[data-cy=next]').click()
})

// TODO: Check clear and should
// TODO: ibanCheck, iban-check or iban_check?