/// <reference types="cypress" />

describe('Modify Contract', () => {
  Cypress.on('uncaught:exception', (error, runnable) => {
    console.error(error)
    return false
  })

  beforeEach(() => {
    cy.visit('/modify-contract')
    cy.fixture('modifyContract.json').as('data')
  })

  it('Change power 2.0TD', function () {
    cy.get('[type=submit]').click()

    cy.get('[name=changePower]').click()

    cy.get('[name=power]')
      .type(this.data.power)
      .should('have.value', this.data.power)

    cy.get('[name=power2]')
      .type(this.data.power2)
      .should('have.value', this.data.power2)

    cy.get('[type=submit]').click()

    cy.get('[name=contactName]')
      .type(this.data.name)
      .should('have.value', this.data.name)
    cy.get('[name=contactSurname]')
      .type(this.data.surname)
      .should('have.value', this.data.surname)
    cy.get('[name=phone]')
      .type(this.data.phone)
      .should('have.value', this.data.phone)

    cy.get('[type=submit]').click()

    cy.get('[data-cy=power]').should('contain', this.data.power)
    cy.get('[data-cy=power2]').should('contain', this.data.power2)

    cy.get('[data-cy=tariff]').should('contain', this.data.tariff20)

    cy.get('[data-cy=contact]').should(
      'contain',
      `${this.data.phone} (${this.data.name} ${this.data.surname})`
    )

    // cy.get('[type=submit]').click({ multiple: true })
  })

  it('Change power 3.0TD', function () {
    cy.get('[type=submit]').click()

    cy.get('[name=changePower]').click()

    cy.get('[name=moreThan15Kw]').get('[data-value="true"]').click()

    cy.get('[name=power]')
      .type(this.data.power)
      .should('have.value', this.data.power)

    cy.get('[name=power2]')
      .type(this.data.power2)
      .should('have.value', this.data.power2)

    cy.get('[name=power3]')
      .type(this.data.power3)
      .should('have.value', this.data.power3)

    cy.get('[name=power4]')
      .type(this.data.power4)
      .should('have.value', this.data.power4)

    cy.get('[name=power5]')
      .type(this.data.power5)
      .should('have.value', this.data.power5)

    cy.get('[name=power6]')
      .type(this.data.power6)
      .should('have.value', this.data.power6)

    cy.get('[type=submit]').click()

    cy.get('[name=contactName]')
      .type(this.data.name)
      .should('have.value', this.data.name)
    cy.get('[name=contactSurname]')
      .type(this.data.surname)
      .should('have.value', this.data.surname)
    cy.get('[name=phone]')
      .type(this.data.phone)
      .should('have.value', this.data.phone)

    cy.get('[type=submit]').click()

    cy.get('[data-cy=power]').should('contain', this.data.power)
    cy.get('[data-cy=power2]').should('contain', this.data.power2)
    cy.get('[data-cy=power3]').should('contain', this.data.power3)
    cy.get('[data-cy=power4]').should('contain', this.data.power4)
    cy.get('[data-cy=power5]').should('contain', this.data.power5)
    cy.get('[data-cy=power6]').should('contain', this.data.power6)

    cy.get('[data-cy=tariff]').should('contain', this.data.tariff30)

    cy.get('[data-cy=contact]').should(
      'contain',
      `${this.data.phone} (${this.data.name} ${this.data.surname})`
    )

    // cy.get('[type=submit]').click({ multiple: true })
  })

  it('Change power 3.0TD no more 15kW', function () {
    cy.get('[type=submit]').click()

    cy.get('[name=changePower]').click()

    cy.get('[name=moreThan15Kw]').get('[data-value="true"]').click()

    cy.get('[name=power]')
      .type(this.data.power)
      .should('have.value', this.data.power)

    cy.get('[name=power2]')
      .type(this.data.power2)
      .should('have.value', this.data.power2)

    cy.get('[name=power3]')
      .type(this.data.power2)
      .should('have.value', this.data.power2)

    cy.get('[name=power4]')
      .type(this.data.power2)
      .should('have.value', this.data.power2)

    cy.get('[name=power5]')
      .type(this.data.power2)
      .should('have.value', this.data.power2)

    cy.get('[name=power6]')
      .type(this.data.power2)
      .should('have.value', this.data.power2)

    cy.get('[type=submit]').click()

    cy.contains('Alguno de los periodos debe ser superior a 15.001 kW')
  })

  it('Change power 2.0TD no values', function () {
    cy.get('[type=submit]').click()

    cy.get('[name=changePower]').click()

    cy.wait(500)

    cy.get('[type=submit]').click()

    cy.contains('No has introducido la potencia para el periodo')
  })

  it('Change power 3.0TD no values', function () {
    cy.get('[type=submit]').click()

    cy.get('[name=changePower]').click()

    cy.get('[name=moreThan15Kw]').get('[data-value="true"]').click()

    cy.get('[type=submit]').click()

    cy.contains('No has introducido la potencia para el periodo')
  })

  it('Change phases attachment required', function () {
    cy.get('[type=submit]').click()

    cy.get('[name=changePhases]').click()

    cy.get('#phases').click()
    cy.get(`[data-value=${this.data.phases}]`).click()

    cy.get('[type=submit]').click()

    cy.contains('No has adjuntado la documentación requerida')
  })

  it('Incorrect phone number', function () {
    cy.get('[type=submit]').click()

    cy.get('[name=changePower]').click()

    cy.get('[name=power]')
      .type(this.data.power)
      .should('have.value', this.data.power)

    cy.get('[name=power2]')
      .type(this.data.power2)
      .should('have.value', this.data.power2)

    cy.get('[type=submit]').click()

    cy.get('[name=contactName]')
      .type(this.data.name)
      .should('have.value', this.data.name)

    cy.get('[name=contactSurname]')
      .type(this.data.surname)
      .should('have.value', this.data.surname)

    cy.get('[name=phone]')
      .type(this.data.phoneIncomplete)
      .should('have.value', this.data.phoneIncomplete)
      .blur()
      .parent()
      .should('have.class', 'Mui-error')
  })
})
