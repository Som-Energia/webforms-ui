describe('Contract', () => {
  beforeEach(() => {
    cy.visit('http://localhost:3000/contract')
    cy.fixture('contract.json').as('data')
  })

  it('Contract 2.0A', function () {
    cy.get('#rate').click()
    cy.get(`[data-value="${this.data.fare20A}"]`).click()

    cy.get('#power')
      .type(this.data.power).should('have.value', this.data.power)

    cy.get('[data-cy=next]').click()
  })

  it('Contract 3.0A', function () {
    cy.get('#rate').click()
    cy.get(`[data-value="${this.data.fare30A}"]`).click()

    cy.get('#power')
      .type(this.data.power).should('have.value', this.data.power)

    cy.get('#power2')
      .type(this.data.power2).should('have.value', this.data.power2)

    cy.get('#power3')
      .type(this.data.power3).should('have.value', this.data.power3)

    cy.get('[data-cy=next]').click()
  })

  it('Contract 3.0A less than 15kW', function () {
    cy.get('#rate').click()
    cy.get(`[data-value="${this.data.fare30A}"]`).click()

    cy.get('#power')
      .type(this.data.power).should('have.value', this.data.power)

    cy.get('#power2')
      .type(this.data.power3).should('have.value', this.data.power3)

    cy.get('#power3')
      .type(this.data.power3).should('have.value', this.data.power3)

    cy.contains('Alguno de los periodos debe ser superior')
  })

  it('Contract 2.0A more than 10kW', function () {
    cy.get('#rate').click()
    cy.get(`[data-value="${this.data.fare20A}"]`).click()

    cy.get('#power')
      .type(this.data.power2).should('have.value', this.data.power2).blur()

    cy.contains('La potencia debe ser inferior a')
  })

})
