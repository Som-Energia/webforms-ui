/// <reference types="cypress" />

describe('Modify Contract', () => {
  beforeEach(() => {
    cy.visit('/modify-contract')
    cy.fixture('modifyContract.json').as('data')
  })

  it('Change power 3.0', function () {
    cy.get('[type=submit]').click()

    cy.get('[name=changePower]').click()

    cy.get('[name=moreThan15Kw]').click()

    cy.get('[name=power]')
      .type(this.data.power).should('have.value', this.data.power)

      cy.get('[name=power2]')
      .type(this.data.power2).should('have.value', this.data.power2)

      cy.get('[name=power3]')
      .type(this.data.power3).should('have.value', this.data.power3)

    cy.get('[type=submit]').click()

    cy.get('[name=contactName]')
      .type(this.data.name).should('have.value', this.data.name)
    cy.get('[name=contactSurname]')
      .type(this.data.surname).should('have.value', this.data.surname)
    cy.get('[name=phone]')
      .type(this.data.phone).should('have.value', this.data.phone)

    cy.get('[type=submit]').click()

    cy.get('[data-cy=power]').should('contain', this.data.power)
    cy.get('[data-cy=power2]').should('contain', this.data.power2)
    cy.get('[data-cy=power3]').should('contain', this.data.power3)

    cy.get(`[data-cy=tariff]`).should('contain', this.data.tariff30)

    cy.get('[data-cy=contact]').should('contain', `${this.data.phone} (${this.data.name} ${this.data.surname})`)

    // cy.get('[type=submit]').click({ multiple: true })
  })

  it('Change power 3.0 no more 15kW', function () {
    cy.get('[type=submit]').click()

    cy.get('[name=changePower]').click()

    cy.get('[name=moreThan15Kw]').click()

    cy.get('[name=power]')
      .type(this.data.power).should('have.value', this.data.power)

      cy.get('[name=power2]')
      .type(this.data.power3).should('have.value', this.data.power3)

      cy.get('[name=power3]')
      .type(this.data.power3).should('have.value', this.data.power3)

    cy.get('[type=submit]').click()

    cy.contains('Alguno de los tres periodos debe tener más de 15kW')
  })

  it('Change power 3.0 no values', function () {
    cy.get('[type=submit]').click()

    cy.get('[name=changePower]').click()

    cy.get('[name=moreThan15Kw]').click()

    cy.get('[type=submit]').click()

    cy.contains('No has especificado la potencia')
  })


  it('Change power', function () {
    cy.get('[type=submit]').click()

    cy.get('[name=changePower]').click()

    cy.get('[name=power]')
      .type(this.data.power).should('have.value', this.data.power)

    cy.get('[type=submit]').click()

    cy.get('[name=contactName]')
      .type(this.data.name).should('have.value', this.data.name)
    cy.get('[name=contactSurname]')
      .type(this.data.surname).should('have.value', this.data.surname)
    cy.get('[name=phone]')
      .type(this.data.phone).should('have.value', this.data.phone)

    cy.get('[type=submit]').click()

    cy.get('[data-cy=power]').should('contain', this.data.power)
    cy.get('[data-cy=contact]').should('contain', `${this.data.phone} (${this.data.name} ${this.data.surname})`)

    // cy.get('[type=submit]').click({ multiple: true })
  })

  it('Change phases', function () {
    cy.get('[type=submit]').click()

    cy.get('[name=changePhases]').click()

    cy.get('#phases').click()
    cy.get(`[data-value=${this.data.phases}]`).click()

    const fileName = this.data.certificate

    cy.fixture(fileName, 'binary')
      .then(Cypress.Blob.binaryStringToBlob)
      .then((fileContent) =>
        cy.get('[name=uploads]').attachFile({
          fileContent,
          fileName,
          mimeType: 'image/jpg',
          encoding: 'utf8'
        })
      )

    cy.wait(500)

    cy.get('[type=submit]').click()

    cy.get('[name=contactName]')
      .type(this.data.name).should('have.value', this.data.name)
    cy.get('[name=contactSurname]')
      .type(this.data.surname).should('have.value', this.data.surname)
    cy.get('[name=phone]')
      .type(this.data.phone).should('have.value', this.data.phone)

    cy.get('[type=submit]').click()

    cy.get(`[data-cy=${this.data.phases}]`).should('exist')
    cy.get('[data-cy=contact]').should('contain', `${this.data.phone} (${this.data.name} ${this.data.surname})`)

    // cy.get('[type=submit]').click({ multiple: true })
  })

  it('Change phases attachment required', function () {
    cy.get('[type=submit]').click()

    cy.get('[name=changePhases]').click()

    cy.get('#phases').click()
    cy.get(`[data-value=${this.data.phases}]`).click()

    cy.get('[type=submit]').click()

    cy.contains('No has adjuntado la documentación requerida')
  })

  it('Change fare', function () {
    cy.get('[type=submit]').click()

    cy.get('[name=changeFare]').click()

    cy.get('#fare').click()
    cy.get(`[data-value=${this.data.fare}]`).click()

    cy.get('[type=submit]').click()

    cy.get('[name=contactName]')
      .type(this.data.name).should('have.value', this.data.name)
    cy.get('[name=contactSurname]')
      .type(this.data.surname).should('have.value', this.data.surname)
    cy.get('[name=phone]')
      .type(this.data.phone).should('have.value', this.data.phone)

    cy.get('[type=submit]').click()

    cy.get(`[data-cy=${this.data.fare}]`).should('exist')
    cy.get('[data-cy=contact]').should('contain', `${this.data.phone} (${this.data.name} ${this.data.surname})`)

    // cy.get('[type=submit]').click({ multiple: true })
  })

  it('Incorrect phone number', function () {
    cy.get('[type=submit]').click()

    cy.get('[name=changeFare]').click()

    cy.get('#fare').click()
    cy.get('[data-value=dh]').click()

    cy.get('[type=submit]').click()

    cy.get('[name=contactName]')
      .type(this.data.name).should('have.value', this.data.name)
    cy.get('[name=contactSurname]')
      .type(this.data.surname).should('have.value', this.data.surname)
    cy.get('[name=phone]')
      .type(this.data.phoneIncomplete).should('have.value', this.data.phoneIncomplete)
      .blur()
      .parent()
      .should('have.class', 'Mui-error')
  })
})
