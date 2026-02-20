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

    cy.contains('No has introducido el teléfono', { matchCase: false })

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

describe('Language', () => {
  it('is set for "ca"', function () {
    cy.visit('/ca/cancellation')
    cy.contains('La baixa de subministrament elèctric implica el tall de servei', {
      matchCase: false
    })
  })
  it('is set for "es"', function () {
    cy.visit('/es/cancellation')
    cy.contains('La baja de suministro eléctrico implica cortar el servicio', {
      matchCase: false
    })
  })
  it('is set for "gl"', function () {
    cy.visit('/gl/cancellation')
    cy.contains('A baixa de subministración eléctrica implica cortar o servizo', {
      matchCase: false
    })
  })
  it('is set for "eu"', function () {
    cy.visit('/eu/cancellation')
    cy.contains('Horniduran baja emanez gero', {
      matchCase: false
  })
  })
})

describe('Calendar language', () => {
  beforeEach(() => {
    cy.fixture('cancellation.json').as('data')
  })

  it('is set for "ca"', function () {
    cy.visit('/ca/cancellation')

    cy.get('[data-cy=next]').click()

    cy.get('[placeholder="DD/MM/YYYY"').type('01/01/2026', { delay: 500 })

    cy.wait(1000) // eslint-disable-line

    cy.get('[aria-label="Choose date, selected date is 1 Gen. 2026"]').click()
    cy.contains('Gener', {
      matchCase: false
    })
  })
  it('is set for "es"', function () {
    cy.visit('/es/cancellation')

    cy.get('[data-cy=next]').click()

    cy.get('[placeholder="DD/MM/YYYY"').type('01/01/2026', { delay: 500 })

    cy.get('[aria-label="Choose date, selected date is 1 de ene de 2026"]').click()
    cy.contains('Enero', {
      matchCase: false
    })
  })
  it('is set for "gl"', function () {
    cy.visit('/gl/cancellation')

    cy.get('[data-cy=next]').click()

    cy.get('[placeholder="DD/MM/YYYY"').type('01/01/2026', { delay: 500 })

    cy.get('[aria-label="Choose date, selected date is 1 de xan. de 2026"]').click()
    cy.contains('xaneiro', {
      matchCase: false
    })
  })
  it('is set for "eu"', function () {
    cy.visit('/eu/cancellation')

    cy.get('[data-cy=next]').click()

    cy.get('[placeholder="DD/MM/YYYY"').type('01/01/2026', { delay: 500 })

    cy.get('[aria-label="Choose date, selected date is 2026ko urt. 1a"]').click()
    cy.contains('Urtarrila', {
      matchCase: false
    })
  })
})

