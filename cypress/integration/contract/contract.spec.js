describe('Contract', () => {
  const WAIT_TIME = 2000

  Cypress.on('uncaught:exception', (error, runnable) => {
    console.log(error)
    return false
  })

  beforeEach(() => {
    cy.visit('/contract')
    cy.fixture('contract.json').as('data')
  })

  describe('Contract whith CUPS has no service', function () {
    beforeEach(function () {
      cy.get('#memberNumber')
        .clear()
        .type(this.data.member.number)
        .should('have.value', this.data.member.number)

      cy.intercept('GET', '/data/soci/**').as('checkMember')

      cy.get('#vat')
        .clear()
        .type(this.data.member.vat)
        .should('have.value', this.data.member.vat)

      cy.wait('@checkMember')

      cy.get('[data-cy=next]').click()

      cy.intercept('GET', '/check/cups/**').as('checkCups')

      cy.get('#cups')
        .clear()
        .type(this.data.supplyPoint.cups)
        .should('have.value', this.data.supplyPoint.cups)

      cy.wait('@checkCups')

      cy.get(`[data-value="${this.data.supplyPoint.hasNoService}"]`).click()

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

      cy.get('#supply_point_cnae').should(
        'have.value',
        this.data.supplyPoint.cnae
      )

      cy.get('[name="supply_point_accepted"]').click()
      cy.get('[data-cy=accept]').click()

      cy.get('[data-cy=next]').click()
    })

    afterEach(function () {
      cy.get('[name="holder.vat"]')
        .type(this.data.member.vat)
        .should('have.value', this.data.member.vat)

      // cy.wait(WAIT_TIME)

      cy.get('[data-cy=next]').click()

      cy.get(`[data-value="${this.data.holder.voluntaryCent}"]`).click()

      cy.get('[data-cy=next]').click()

      cy.get('[name="payment.iban"]')
        .clear()
        .type(this.data.holder.iban)
        .should('have.value', this.data.holder.iban)

      cy.get('[name="payment.sepa_accepted"]').click()
      cy.get('[data-cy=accept]').click()

      cy.get('[data-cy=next]').click()

      cy.get('[name="terms_accepted"]').click()
      cy.get('[data-cy=accept]').click()

      // No prices defined yet
      //cy.contains('€/kWh')
    })

    it('Monofasic 2.0TD', function () {
      cy.get('#phases').click()
      cy.get(`[data-value="${this.data.phase}"]`).click()

      cy.get('[name="contract.power"]')
        .clear()
        .type(this.data.power)
        .should('have.value', this.data.power)

      cy.get('[name="contract.power2"]')
        .clear()
        .type(this.data.power)
        .should('have.value', this.data.power)

      cy.get('[data-cy=next]').click()
    })

    it('Monofasic 3.0TD', function () {
      cy.get('#phases').click()
      cy.get(`[data-value="${this.data.phase}"]`).click()

      cy.get('[data-cy="moreThan15Kw"]').get('[data-value="true"]').click()

      cy.get('[name="contract.power"]')
        .clear()
        .type(this.data.power)
        .should('have.value', this.data.power)

      cy.get('[name="contract.power2"]')
        .clear()
        .type(this.data.power2)
        .should('have.value', this.data.power2)

      cy.get('[name="contract.power3"]')
        .clear()
        .type(this.data.power3)
        .should('have.value', this.data.power3)

      cy.get('[name="contract.power4"]')
        .clear()
        .type(this.data.power6)
        .should('have.value', this.data.power6)

      cy.get('[name="contract.power5"]')
        .clear()
        .type(this.data.power6)
        .should('have.value', this.data.power6)

      cy.get('[name="contract.power6"]')
        .clear()
        .type(this.data.power6)
        .should('have.value', this.data.power6)

      cy.get('[data-cy=next]').click()
    })

    it.only('3.0TD no incremental powers', function () {
      cy.get('#phases').click()
      cy.get(`[data-value="${this.data.phase}"]`).click()

      cy.get('[data-cy="moreThan15Kw"]').get('[data-value="true"]').click()

      cy.get('[name="contract.power"]')
        .clear()
        .type(this.data.power)
        .should('have.value', this.data.power)

      cy.get('[name="contract.power2"]')
        .clear()
        .type(this.data.power2)
        .should('have.value', this.data.power2)

      cy.get('[name="contract.power3"]')
        .clear()
        .type(this.data.power3)
        .should('have.value', this.data.power3)

      cy.get('[name="contract.power4"]')
        .clear()
        .type(this.data.power6)
        .should('have.value', this.data.power6)

      cy.get('[name="contract.power5"]')
        .clear()
        .type(this.data.power6)
        .should('have.value', this.data.power6)

      cy.get('[name="contract.power6"]')
        .clear()
        .type(this.data.power)
        .should('have.value', this.data.power)

      cy.get('[data-cy=next]').click()
    })
  })

  /*

  describe('Correct data', function () {
    beforeEach(function () {
      cy.intercept('GET', '/data/soci/')
        .as('checkMember')

      cy.get('#memberNumber')
        .clear()
        .type(this.data.member.number)
        .should('have.value', this.data.member.number)

      cy.get('#vat')
        .clear()
        .type(this.data.member.vat)
        .should('have.value', this.data.member.vat)

      cy.wait('@checkMember')

      cy.get('[data-cy=next]').click()

      cy.get('#cups')
        .clear()
        .type(this.data.supplyPoint.cups)
        .should('have.value', this.data.supplyPoint.cups)

      // https://github.com/cypress-io/cypress/issues/9549
      // cy.wait('@checkCups')
      cy.wait(WAIT_TIME)

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

      cy.get('[name="supply_point_accepted"]').click()
      cy.get('[data-cy=accept]').click()

      cy.get('[data-cy=next]').click()
    })

    afterEach(function () {

      cy.intercept('GET', '/check/vat/')
        .as('checkVat')

      cy.get('[name="holder.vat"]')
        .type(this.data.member.vat).should('have.value', this.data.member.vat)

      cy.wait('@checkVat')

      cy.get(`[data-value="${this.data.holder.previousHolder}"]`).click()

      cy.get('[data-cy=next]').click()

      cy.get(`[data-value="${this.data.holder.voluntaryCent}"]`).click()

      cy.get('[data-cy=next]').click()

      cy.get('[name="payment.iban"]')
        .clear()
        .type(this.data.holder.iban).should('have.value', this.data.holder.iban)

      cy.get('[name="payment.sepa_accepted"]').click()
      cy.get('[data-cy=accept]').click()

      cy.get('[data-cy=next]').click()

      cy.contains('€/kWh')
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

  })

  describe('Wrong power', function () {
    beforeEach(function () {
      cy.intercept('GET', '/data/soci/')
        .as('checkMember')

      cy.get('#memberNumber')
        .clear()
        .type(this.data.member.number)
        .should('have.value', this.data.member.number)

      cy.get('#vat')
        .clear()
        .type(this.data.member.vat)
        .should('have.value', this.data.member.vat)

      cy.wait('@checkMember')

      cy.get('[data-cy=next]').click()

      cy.intercept('GET', '/check/cups/')
        .as('checkCups')

      cy.get('#cups')
        .clear()
        .type(this.data.supplyPoint.cups)
        .should('have.value', this.data.supplyPoint.cups)

      // https://github.com/cypress-io/cypress/issues/9549
      // cy.wait('@checkCups')
      cy.wait(WAIT_TIME)

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

      cy.get('[name="supply_point_accepted"]').click()
      cy.get('[data-cy=accept]').click()

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

  it('Check some fields error detection: VAT, CUPS, email, IBAN', function () {

    cy.intercept('GET', '/data/soci/')
      .as('checkMember')

    cy.get('#memberNumber')
      .clear()
      .type(this.data.member.number)
      .should('have.value', this.data.member.number)

    cy.get('#vat')
      .clear()
      .type(this.data.member.badVat)
      .should('have.value', this.data.member.badVat)

    cy.wait('@checkMember')

    cy.contains('No se ha encontrado ningún socio/a ')

    cy.get('#vat')
      .clear()
      .type(this.data.member.vat)
      .should('have.value', this.data.member.vat)

    cy.get('[data-cy=next]').click()

    cy.get('#cups')
      .clear()
      .type(this.data.supplyPoint.badCups)
      .should('have.value', this.data.supplyPoint.badCups)
      .blur()
    cy.contains('CUPS incorrecto')

    cy.get('#cups')
      .clear()
      .type(this.data.supplyPoint.invalidCups)
      .should('have.value', this.data.supplyPoint.invalidCups)
      .blur()
    cy.contains('Este CUPS está actualmente en un proceso')

    cy.get('#cups')
      .clear()
      .type(this.data.supplyPoint.validCups)
      .should('have.value', this.data.supplyPoint.validCups)
      .blur()

    cy.get('#cups')
      .clear()
      .type(this.data.supplyPoint.cups)
      .should('have.value', this.data.supplyPoint.cups)

    cy.wait(WAIT_TIME)
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

    cy.get('[name="supply_point_accepted"]').click()
    cy.get('[data-cy=accept]').click()

    cy.get('[data-cy=next]').click()

    cy.get('#rate').click()
    cy.get(`[data-value="${this.data.fare20A}"]`).click()

    cy.get('#power')
      .type(this.data.power).should('have.value', this.data.power)

    cy.get('[data-cy=next]').click()

    cy.get('[name="holder.vat"]')
      .type(this.data.holder.vat).should('have.value', this.data.holder.vat)

    cy.wait(WAIT_TIME)
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
      .type(this.data.holder.badEmail).should('have.value', this.data.holder.badEmail)
      .blur()

    cy.contains('No has especificado un correo electrónico correcto')

    cy.get('[name="holder.email"]')
      .clear()
      .type(this.data.holder.email).should('have.value', this.data.holder.email)

    cy.get('[name="holder.email2"]')
      .type(this.data.holder.badEmail).should('have.value', this.data.holder.badEmail)
      .blur()

      cy.contains('No has repetido el correo electrónico correctamente')

    cy.get('[name="holder.email2"]')
      .clear()
      .type(this.data.holder.email).should('have.value', this.data.holder.email)

    cy.get('[name="holder.phone1"]')
      .type(this.data.holder.phone).should('have.value', this.data.holder.phone)

    cy.get('#holder_lang').click()
    cy.get('[data-value="ca_ES"]').click()

    cy.get('[name="privacy_policy_accepted"]').click()

    cy.get('[data-cy=next]').click()

    cy.get(`[data-value="${this.data.holder.voluntaryCent}"]`).click()

    cy.get('[data-cy=next]').click()

    cy.get('[name="payment.iban"]')
      .clear()
      .type(this.data.holder.badIban).should('have.value', this.data.holder.badIban)
      .blur()

    cy.contains('IBAN incorrecto')

    cy.get('[name="payment.iban"]')
      .clear()
      .type(this.data.holder.iban).should('have.value', this.data.holder.iban)

    cy.get('[name="payment.sepa_accepted"]').click()
    cy.get('[data-cy=accept]').click()
    cy.get('[data-cy=next]').click()
  })

  describe('Juridic Person', function () {
    beforeEach(function () {
      cy.get('#memberNumber')
        .clear()
        .type(this.data.juridicMember.number)
        .should('have.value', this.data.juridicMember.number)

      cy.get('#vat')
        .clear()
        .type(this.data.juridicMember.vat)
        .should('have.value', this.data.juridicMember.vat)

      cy.wait(WAIT_TIME)

      cy.get('[data-cy=next]').click()

      cy.get('#cups')
        .clear()
        .type(this.data.supplyPoint.cups)
        .should('have.value', this.data.supplyPoint.cups)

      cy.wait(WAIT_TIME)
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

      cy.get('[name="supply_point_accepted"]').click()
      cy.get('[data-cy=accept]').click()

      cy.get('[data-cy=next]').click()

      cy.get('#rate').click()
      cy.get(`[data-value="${this.data.fare20A}"]`).click()

      cy.get('#power')
        .type(this.data.power).should('have.value', this.data.power)

      cy.get('[data-cy=next]').click()
    })

    afterEach(function () {
      cy.get('[name="holder.name"]')
        .type(this.data.juridicHolder.name)
        .should('have.value', this.data.juridicHolder.name)

      cy.get('[name="holder.proxyname"]')
        .type(this.data.juridicHolder.proxyname)
        .should('have.value', this.data.juridicHolder.proxyname)

      cy.get('[name="holder.proxynif"]')
        .type(this.data.juridicHolder.proxynif)
        .should('have.value', this.data.juridicHolder.proxynif)

      cy.get('[name="holder.address"]')
        .type(this.data.holder.address)
        .should('have.value', this.data.holder.address)

      cy.get('[name="holder.postal_code"]')
        .type(this.data.holder.postalCode)
        .should('have.value', this.data.holder.postalCode)

      cy.get('#holder_state').click()
      cy.get(`[data-value="${this.data.holder.stateCode}"]`).click()

      cy.get('#holder_city').click()
      cy.get(`[data-value="${this.data.holder.cityCode}"]`).click()

      cy.get('[name="holder.email"]')
        .clear()
        .type(this.data.holder.email).should('have.value', this.data.holder.email)

      cy.get('[name="holder.email2"]')
        .clear()
        .type(this.data.holder.email).should('have.value', this.data.holder.email)

      cy.get('[name="holder.phone1"]')
        .type(this.data.holder.phone).should('have.value', this.data.holder.phone)

      cy.get('#holder_lang').click()
      cy.get('[data-value="ca_ES"]').click()

      cy.get('[name="legal_person_accepted"]').click()
      cy.get('[data-cy=accept]').click()

      cy.get('[name="privacy_policy_accepted"]').click()

      cy.get('[data-cy=next]').click()

      cy.get(`[data-value="${this.data.holder.voluntaryCent}"]`).click()
      cy.get('[data-cy=next]').click()

      cy.get('[name="payment.iban"]')
        .clear()
        .type(this.data.holder.iban).should('have.value', this.data.holder.iban)

      cy.get('[name="payment.sepa_accepted"]').click()
      cy.get('[data-cy=accept]').click()
      cy.get('[data-cy=next]').click()

      cy.contains('€/kWh')
    })

    it('Same juridic person', function () {
      cy.get('[name="holder.vat"]')
        .type(this.data.juridicMember.vat)
        .should('have.value', this.data.juridicMember.vat)

      cy.wait(WAIT_TIME)
      cy.get(`[data-value="${this.data.juridicHolder.previousHolder}"]`).click()

      cy.get('[data-cy=next]').click()
    })

    it('Different juridic person', function () {
      cy.get('[name="holder.vat"]')
        .type(this.data.juridicHolder.vat).should('have.value', this.data.juridicHolder.vat)
      cy.wait(WAIT_TIME)
      cy.get(`[data-value="${this.data.juridicHolder.previousHolder}"]`).click()

      cy.get('[data-cy=next]').click()
    })
  })
  */
})
