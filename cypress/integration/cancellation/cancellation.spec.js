describe('Cancellation', () => {
  Cypress.on('uncaught:exception', (error, runnable) => {
    console.error(error)
    return false
  })

  beforeEach(() => {
    cy.visit('/cancellation')
    cy.fixture('cancellation.json').as('data')
  })

  it('Should display contract number and address', function () {
    cy.contains(this.data.number)
    cy.contains(this.data.address)

    cy.get('[data-cy=next]').should('not.have.class', 'Mui-disabled')
    cy.get('[data-cy=next]').click()

    cy.contains(this.data.number)
    cy.contains(this.data.address)
  })

  it('Should validate CUPS and phone number', function () {
    cy.get('[data-cy=next]').should('not.have.class', 'Mui-disabled')
    cy.get('[data-cy=next]').click()

    cy.get('input[name=cups]')
      .clear()
      .type(this.data.invalidCups)
      .should('have.value', this.data.invalidCups)
      .blur()
      .should('have.attr', 'aria-invalid', 'true')

    cy.contains('El cups especificado no corresponde al cups del contrato', { matchCase: false })

    cy.get('input[name=phone]')
      .clear()
      .type(this.data.invalidPhone)
      .should('have.value', this.data.invalidPhone)
      .blur()
      .should('have.attr', 'aria-invalid', 'true')

    cy.contains('teléfono no es correcto', { matchCase: false })

    cy.get('[data-cy=submit]').should('have.class', 'Mui-disabled')
  })

  it('Should fill form fields and post', function () {
    cy.get('[data-cy=next]').click()

    cy.get('[data-cy=submit]').should('have.class', 'Mui-disabled')

    cy.get('input[name=cups]')
      .clear()
      .type(this.data.cups)
      .should('have.value', this.data.cups)
      .blur()
      .should('have.attr', 'aria-invalid', 'false')

    cy.get('[data-cy=submit]').should('have.class', 'Mui-disabled')

    cy.get('input[name=phone]')
      .clear()
      .type(this.data.phone)
      .should('have.value', this.data.phone)
      .blur()
      .should('have.attr', 'aria-invalid', 'false')

    cy.get('[data-cy=submit]').should('have.class', 'Mui-disabled')

    cy.get('input[name=privacy_policy]').click()

    cy.get('[data-cy=submit]').should('have.class', 'Mui-disabled')

    cy.get('input[name=terms_accepted]').click()
    cy.get('[data-cy=accept]').click()

    cy.get('[data-cy=submit]').should('have.not.class', 'Mui-disabled').click()
  })
})
