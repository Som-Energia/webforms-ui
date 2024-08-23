/// <reference types="cypress" />

describe('Modify Contract', () => {
  Cypress.on('uncaught:exception', (error, runnable) => {
    console.error(error)
    return false
  })

  beforeEach(() => {
    cy.visit('/ca/d1-detail')
    cy.fixture('d1Detail.json').as('data')
  })

  it('Reject D1', function () {
    cy.get(`[data-value="${false}"]`).click()
    cy.get('[type=submit]').click()
  })

  it('Accept D1 and no M1', function () {
    cy.get(`[data-value="${true}"]`).click()
    cy.get('[type=submit]').click()

    const fileName = this.data.d1Attachment
    cy.fixture(fileName, 'binary')
      .then(Cypress.Blob.binaryStringToBlob)
      .then((fileContent) =>
        cy.get('[name=uploads]').attachFile({
          fileContent,
          fileName,
          mimeType: 'pdf',
          encoding: 'utf8'
        })
      )
    cy.wait(500)
    cy.get('[type=submit]').click()
  })

  it('Accept D1 and no M1 without attachment', function () {
    cy.get(`[data-value="${true}"]`).click()
    cy.get('[type=submit]').click()

    cy.wait(500)

    cy.get('[type=submit]').should('not.have.class', 'Mui-disabled')
  })

  it('Accept D1 and M1', function () {
    cy.get(`[data-value="${true}"]`).click()
    cy.get('[type=submit]').click()

    const fileName = this.data.d1Attachment
    cy.fixture(fileName, 'binary')
      .then(Cypress.Blob.binaryStringToBlob)
      .then((fileContent) =>
        cy.get('[name=uploads]').attachFile({
          fileContent,
          fileName,
          mimeType: 'pdf',
          encoding: 'utf8'
        })
      )

    cy.wait(500)

    // Mock the response
    cy.intercept('POST', '/procedures/d1_confirmation/398891', {
      statusCode: 200,
      body: {
        'status': 'ONLINE',
        'state': true,
        'data': {
          'd1_case_id': 398891,
          'm1_case_id': 398892
        }
      }
    }).as('secondClick')
    cy.get('[type=submit]').click()
    cy.wait('@secondClick')

    // TODO: parametritzar be els params de la URL de intercept
    // TODO: revisart el color de background del numero
    // TODO: lo d'aqui sota és necessari?
    // cy.get('[name=changePower]').click()
    // cy.get('[name=power]')
    //   .type(this.data.power)
    //   .should('have.value', this.data.power)
    // cy.get('[name=power2]')
    //   .type(this.data.power)
    //   .should('have.value', this.data.power)
    // cy.get('[type=submit]').click()

    // cy.get('[name=contactName]')
    //   .type(this.data.name)
    //   .should('have.value', this.data.name)
    // cy.get('[name=contactSurname]')
    //   .type(this.data.surname)
    //   .should('have.value', this.data.surname)
    // cy.get('[name=phone]')
    //   .type(this.data.phone)
    //   .should('have.value', this.data.phone)
    // cy.get('[type=submit]').click()

    // cy.get('[data-cy=power]').should('contain', this.data.power)
    // cy.get('[data-cy=contact]').should(
    //   'contain',
    //   `${this.data.phone} (${this.data.name} ${this.data.surname})`
    // )
  })
})
