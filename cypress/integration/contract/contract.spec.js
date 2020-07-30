describe('Contract', () => {
  beforeEach(() => {
    cy.visit('http://localhost:3000/contract')
    cy.fixture('contract.json').as('data')
  })

  it('Contract 2.0A', function () {
    cy.get('#memberNumber')
      .clear()
      .type(this.data.member.number)
      .should('have.value', this.data.member.number)

    cy.get('#vat')
      .clear()
      .type(this.data.member.vat)
      .should('have.value', this.data.member.vat)

    cy.get('[data-cy=next]').click()

    cy.get('#cups')
      .clear()
      .type(this.data.supply_point.cups)
      .should('have.value', this.data.supply_point.cups)

    cy.wait(500)
    cy.get('[data-cy=option1]').click()

    cy.get('[data-cy=next]').click()

    cy.get('#supply_point_address')
      .clear()
      .type(this.data.supply_point.address)
      .should('have.value', this.data.supply_point.address)

    cy.get('#supply_point_number')
      .clear()
      .type(this.data.supply_point.number)
      .should('have.value', this.data.supply_point.number)

    cy.get('#supply_point_postal_code')
      .clear()
      .type(this.data.supply_point.postal_code)
      .should('have.value', this.data.supply_point.postal_code)

    cy.get('#supply_point_state').click()
    cy.get(`[data-value="${this.data.supply_point.state}"]`).click()

    cy.get('#supply_point_city').click()
    cy.get(`[data-value="${this.data.supply_point.city}"]`).click()

    cy.get('#supply_point_is_housing').click()
    cy.get(`[data-value="${this.data.supply_point.is_housing}"]`).click()

    cy.get('#supply_point_cnae')
      .should('have.value', this.data.supply_point.cnae)

    cy.get('[data-cy=next]').click()

    cy.get('#rate').click()
    cy.get(`[data-value="${this.data.fare20A}"]`).click()

    cy.get('#power')
      .type(this.data.power).should('have.value', this.data.power)

    cy.get('[data-cy=next]').click()
  })

  /*
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
  */

})
