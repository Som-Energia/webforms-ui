/// <reference types="cypress" />

describe('Modify Contract', () => {
  beforeEach(() => {
    cy.visit('http://localhost:3000/modify-contract')
    cy.fixture('modifyContract.json').as('data')
  })

  // it('Change Power', function () {
  //   cy.get('[type=submit]').click()

  //   cy.get('[name=changePower]').click()

  //   cy.get('[name=power]')
  //     .type(this.data.power).should('have.value', this.data.power)

  //   cy.get('[type=submit]').click()

  //   cy.get('[name=contactName]')
  //     .type(this.data.name).should('have.value', this.data.name)
  //   cy.get('[name=contactSurname]')
  //     .type(this.data.surname).should('have.value', this.data.surname)
  //   cy.get('[name=phone]')
  //     .type(this.data.phone).should('have.value', this.data.phone)

  //   cy.get('[type=submit]').click()

  //   cy.get('[data-cy=power]').should('contain', this.data.power)
  //   cy.get('[data-cy=contact]').should('contain', `${this.data.phone} (${this.data.name} ${this.data.surname})`)

  //   // cy.get('[type=submit]').click({ multiple: true })
  // })

  it('Change Phases', function () {
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

  // it('Change Fare', function () {
  //   cy.get('[type=submit]').click()

  //   cy.get('[name=changeFare]').click()

  //   cy.get('#fare').click()
  //   cy.get(`[data-value=${this.data.fare}]`).click()

  //   cy.get('[type=submit]').click()

  //   cy.get('[name=contactName]')
  //     .type(this.data.name).should('have.value', this.data.name)
  //   cy.get('[name=contactSurname]')
  //     .type(this.data.surname).should('have.value', this.data.surname)
  //   cy.get('[name=phone]')
  //     .type(this.data.phone).should('have.value', this.data.phone)

  //   cy.get('[type=submit]').click()

  //   cy.get(`[data-cy=${this.data.fare}]`).should('exist')
  //   cy.get('[data-cy=contact]').should('contain', `${this.data.phone} (${this.data.name} ${this.data.surname})`)

  //   // cy.get('[type=submit]').click({ multiple: true })
  // })

  // it('Incorrect phone number', function () {
  //   cy.get('[type=submit]').click()

  //   cy.get('[name=changeFare]').click()

  //   cy.get('#fare').click()
  //   cy.get('[data-value=dh]').click()

  //   cy.get('[type=submit]').click()

  //   cy.get('[name=contactName]')
  //     .type(this.data.name).should('have.value', this.data.name)
  //   cy.get('[name=contactSurname]')
  //     .type(this.data.surname).should('have.value', this.data.surname)
  //   cy.get('[name=phone]')
  //     .type(this.data.phoneIncomplete).should('have.value', this.data.phoneIncomplete)
  //     .blur()
  //     .parent()
  //     .should('have.class', 'Mui-error')
  // })
})
