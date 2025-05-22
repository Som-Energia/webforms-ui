Cypress.Commands.add('contractMemberQuestion', (has_member = true) => {
  const optionValue = has_member ? 'member-on' : 'member-off'
  cy.get('[data-cy="member-question"]')
    .get(`[data-cy="${optionValue}"]`)
    .click()
})

Cypress.Commands.add('contractMemberHolderQuestion', (previous_holder = true) => {
  const optionValue = previous_holder ? 'previous-holder-yes' : 'previous-holder-no'
  cy.get('[data-cy="holder-question"]')
    .get(`[data-cy="${optionValue}"]`)
    .click()
  
  cy.get('[data-cy=next]').click()
})

Cypress.Commands.add('contractMemberDonationQuestion', (donation = true) => {
  cy.get('[data-cy="donation_question"]')
    .get(`[data-cy="${donation}"]`)
    .click()
  
  cy.get('[data-cy=next]').click()
})

Cypress.Commands.add('newContractIdentifySupplyPoint', (cups, has_light, statusCode = 200) => {
  //Intercept call to check CUPS
  cy.intercept('GET', '/check/cups/status/*', {
    statusCode: statusCode,
    body: {
      data: {
        cups: cups,
        status: 'new',
        tariff_type: null
      },
      state: statusCode === 200,
      status: 'ONLINE'
    }
  }).as('checkCUPS')

  cy.get('[data-cy="cups"]').type(cups)

  cy.get('[data-cy="light-question"]').get(`[data-cy="${has_light}"]`).click()

  cy.get('[data-cy=next]').click()
})

Cypress.Commands.add('newContractSupplyPointData', (data, house = 'no') => {
  cy.get('[data-cy="supply_point_address-street"]').type(data.validAddress.input)
  cy.contains(data.supplyPointData.street).click()

  cy.get('[data-cy="supply_point_address.number"]').type('2')

  cy.get('[data-cy=select_component]').click()
  cy.get(`[data-cy="${house}"]`).click()

  cy.get(`[data-cy="cnae"]`).find('input').then(($ele) => {
    console.log('ele', $ele)
    if ($ele.is(":enabled")) {
      cy.get(`[name="cnae"]`).type(data.supplyPoint.cnae_no_house)
    }
    if ($ele.is(":disabled")) {
      cy.get(`[name="cnae"]`).type(data.supplyPoint.cnae_house, {force:true})
    }
  })

  cy.get('[data-cy="supply_point_accepted"]').click()
  cy.get('[data-cy=accept]').click()

  cy.get('[data-cy=next]').click()
})

Cypress.Commands.add('selfconsumptionData', (selfConsumption) => {
  cy.get('[data-cy="self_consumption.cau"]').type(selfConsumption.cau)

  const collectiveOptionValue = selfConsumption.collective_installation
  cy.get('[data-cy="collective_installation_question"]')
    .get(`[data-cy="${collectiveOptionValue}"]`)
    .click()

  cy.get('[data-cy="self_consumption.installation_power"]').type(selfConsumption.installation_power)
  
  cy.get('[id="self_consumption.installation_type"]').click()
  cy.get('[id="self_consumption.installation_type-01"]').click()

  cy.get('[id="self_consumption.technology"]').click()
  cy.get('[id="self_consumption.technology-b11"]').click()

  const auxserviceOptionValue = selfConsumption.aux_services
  cy.get('[data-cy="aux_services_question"]')
    .get(`[data-cy="${auxserviceOptionValue}"]`)
    .click()
    
  cy.get('[data-cy=next]').click()

})

Cypress.Commands.add('contractMemberPaymentData', (paymentdata) => {
  cy.get('[data-cy="iban_number"]').type(paymentdata.iban)

  cy.choosePaymentMethod()

  cy.get('[data-cy="iban_check"]').click()
  cy.get('[data-cy=accept]').click()

  cy.get('[data-cy=next]').click()
})

Cypress.Commands.add('contractMemberCheckReviewNewMemberStep', (nif) => {
  cy.get('[data-cy="privacy_policy"]').click()

  cy.get('[data-cy="generic_conditions_accepted"]').click()
  cy.get('[data-cy=accept]').click()

  cy.get('[data-cy="statutes"]').click()

  cy.get('[id="edit_button"]').click()

  cy.get('button').contains(nif)
})

