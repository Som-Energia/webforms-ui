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
      .type(this.data.supplyPoint.cups)
      .should('have.value', this.data.supplyPoint.cups)

    cy.wait(500)
    cy.get(`[data-value="${this.data.supplyPoint.hasService}"]`).click()

    cy.get('[data-cy=next]').click()

    cy.get('#supply_point_address')
      .clear()
      .type(this.data.supplyPoint.address)
      .should('have.value', this.data.supplyPoint.address)

    cy.get('#supply_point_number')
      .clear()
      .type(this.data.supplyPoint.number)
      .should('have.value', this.data.supplyPoint.number)

    cy.get('#supply_point_postal_code')
      .clear()
      .type(this.data.supplyPoint.postalCode)
      .should('have.value', this.data.supplyPoint.postalCode)

    cy.get('#supply_point_state').click()
    cy.get(`[data-value="${this.data.supplyPoint.state}"]`).click()

    cy.get('#supply_point_city').click()
    cy.get(`[data-value="${this.data.supplyPoint.city}"]`).click()

    cy.get('#supply_point_is_housing').click()
    cy.get(`[data-value="${this.data.supplyPoint.isHousing}"]`).click()

    cy.get('#supply_point_cnae')
      .should('have.value', this.data.supplyPoint.cnae)

    cy.get('[data-cy=next]').click()

    cy.get('#rate').click()
    cy.get(`[data-value="${this.data.fare20A}"]`).click()

    cy.get('#power')
      .type(this.data.power).should('have.value', this.data.power)

    cy.get('[data-cy=next]').click()

    cy.get('[name="holder.vat"]')
      .type(this.data.holder.vat).should('have.value', this.data.holder.vat)

    cy.wait(500)
    cy.get(`[data-value="${this.data.holder.previousHolder}"]`).click()

    cy.get('[data-cy=next]').click()

    cy.get('[name="holder.name"]')
      .type(this.data.holder.name).should('have.value', this.data.holder.name)

    cy.get('[name="holder.surname1"]')
      .type(this.data.holder.surname1).should('have.value', this.data.holder.surname1)

    cy.get('[name="holder.surname2"]')
      .type(this.data.holder.surname2).should('have.value', this.data.holder.surname2)

    cy.get('[name="holder.address"]')
      .type(this.data.holder.address).should('have.value', this.data.holder.address)

    cy.get('[name="holder.postal_code"]')
      .type(this.data.holder.postalCode).should('have.value', this.data.holder.postalCode)

    cy.get('#holder_state').click()
    cy.get(`[data-value="${this.data.holder.stateCode}"]`).click()

    cy.get('#holder_city').click()
    cy.get(`[data-value="${this.data.holder.cityCode}"]`).click()

    cy.get('[name="holder.email"]')
      .type(this.data.holder.email).should('have.value', this.data.holder.email)

    cy.get('[name="holder.email2"]')
      .type(this.data.holder.email).should('have.value', this.data.holder.email)

    cy.get('[name="holder.phone1"]')
      .type(this.data.holder.phone).should('have.value', this.data.holder.phone)

    cy.get('#holder_lang').click()
    cy.get('[data-value="ca_ES"]').click()

    cy.get('[name="privacy_policy_accepted"]').click()

    cy.get('[data-cy=accept]').click()

    cy.get('[data-cy=next]').click()

    cy.get(`[data-value="${this.data.holder.voluntaryCent}"]`).click()

    cy.get('[data-cy=next]').click()

    cy.get('[name="payment.iban"]')
      .clear()
      .type(this.data.holder.bad_iban).should('have.value', this.data.holder.bad_iban)
      .blur()

    cy.contains('IBAN incorrecto')

    cy.get('[name="payment.iban"]')
      .clear()
      .type(this.data.holder.iban).should('have.value', this.data.holder.iban)

    cy.get('[name="payment.sepa_accepted"]').click()
    cy.get('[data-cy=accept]').click()
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
