Cypress.Commands.add('identifySupplyPointGURB', (cups, cupsStatus, statusCode = 200,) => {
  //Intercept call to check CUPS
  cy.intercept('GET', '/check/cups/status/*', {
    statusCode: statusCode,
    body: {
      data: {
        address: "Rue del percebe 13",
        cups: cups,
        knowledge_of_distri: true,
        status: cupsStatus,
        tariff_type: null,
        tariff_name: '2.0TD'
      },
      state: statusCode === 200,
      status: 'ONLINE'
    }
  }).as('checkCUPS')

  cy.get('[data-cy="cups"]').type(cups)

  cy.get('[data-cy=next]').click()
})

Cypress.Commands.add('lightQuestion', (lightOn = true) => {
  const optionValue = lightOn ? 'light-on' : 'light-off'
  cy.get('[data-cy="light-question"]').get(`[data-cy="${optionValue}"]`).click()

  cy.get('[data-cy=next]').click()
})

Cypress.Commands.add('fillGurbAddress', (aValidGurbCode, street, lat, long, statusCode, getAutocompleteResponse, getPlaceResponse) => {
  cy.intercept('POST', 'https://places.googleapis.com/$rpc/google.maps.places.v1.Places/AutocompletePlaces', {
    statusCode: statusCode,
    body: getAutocompleteResponse
  }).as('googleAutocomplete')

  cy.intercept('POST', 'https://places.googleapis.com/$rpc/google.maps.places.v1.Places/GetPlace', {
    statusCode: statusCode,
    body: getPlaceResponse
  }).as('googleGetPlace')

  cy.get('[data-cy="street"]').type(street.input)
  cy.wait('@googleAutocomplete')
  cy.contains(street.value).click()
  cy.wait('@googleGetPlace')


  cy.get('[data-cy="number"]').type('2')

  cy.intercept('GET', `/check/gurb/${aValidGurbCode}?lat=${lat}&long=${long}`, {
    statusCode: statusCode,
    body: {
      data: true,
      state: statusCode === 200,
      status: 'ONLINE'
    }
  }).as('checkGurb')

  cy.get('[data-cy=validate-address]').click()
  cy.wait('@checkGurb')

  cy.get('[data-cy=next]').should('not.be.disabled').click()
})

Cypress.Commands.add('selfconsumptionQuestion', (selfconsumption = true) => {
  const optionValue = selfconsumption
    ? 'selfconsumption-on'
    : 'selfconsumption-off'
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

Cypress.Commands.add('identifyMemberGURB', ({ vat, number }) => {
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

Cypress.Commands.add('identifyHolderGURB', (vat, statusCode = 200) => {
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

    cy.get('[data-cy="tax_address.number"]').type('24')
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

Cypress.Commands.add('checkReviewContractStep', (vat) => {
  cy.get('p').contains(vat)
})

Cypress.Commands.add('powerChoice', (choice) => {
  cy.get('[data-cy="select_component"]').click()
  cy.get(`[data-cy="${choice}"]`).click()
  cy.get('[data-cy=next]').click()
})

Cypress.Commands.add('chooseTariffGURB', (isIndexed = true) => {
  const optionValue = isIndexed ? 'indexed' : 'periods'
  cy.get('[data-cy="tariffMode"]').get(`[data-cy="${optionValue}"]`).click()

  cy.get('[data-cy=next]').click()
})

Cypress.Commands.add('acceptAllTerms', () => {
  cy.get('[data-cy="generic_especific_conditons_checkbox"]').click()
  cy.get('[data-cy="privacy_policy_checkbox"]').click()
  cy.get('[data-cy="tariff_payment_checkbox"]').click()
  cy.get('[data-cy="gurb_adhesion_payment_checkbox"]').click()

  cy.get('[data-cy=next]').click()
})

Cypress.Commands.add('interceptAvailablePowers', () => {
  cy.intercept('GET', '/data/gurb/*/available_powers', {
    statusCode: 200,
    body: {
      data: [
        { id: '0_5_kwh', value: '0.5 KWh', text: '0.5 KWh' },
        { id: '1_kwh', value: '1 KWh', text: '1 KWh' }
      ]
    },
    state: true,
    status: 'ONLINE'
  }).as('availablePowers')

  cy.get('[data-cy=next]').click()

  cy.wait('@availablePowers')
})
