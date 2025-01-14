Cypress.Commands.add('statusCode500', () => {
  cy.intercept('GET', '/ping', {
    statusCode: 500,
    body: {}
  }).as('unexpected')
})

Cypress.Commands.add('statusOffline', () => {
  cy.intercept('GET', '/ping', {
    statusCode: 200,
    body: {
      data: true,
      state: false,
      status: 'OFFLINE'
    }
  }).as('offline')
})

Cypress.Commands.add('stateFalse', () => {
  cy.intercept('GET', '/ping', {
    statusCode: 200,
    body: {
      data: true,
      state: false,
      status: 'ONLINE'
    }
  }).as('stateFalse')
})
