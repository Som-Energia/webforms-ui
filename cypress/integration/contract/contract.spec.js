describe('Contract', () => {
  Cypress.on('uncaught:exception', (error, runnable) => {
    console.error(error)
    return false
  })

  beforeEach(() => {
    cy.visit('/contract')
    cy.fixture('contract.json').as('data')
  })

  describe('Contract with selfconsumption', function () {
    it('2.0TD', function () {
      cy.identifyMember(this.data.member.number, this.data.member.vat)
      cy.identifySupplyPoint(
        this.data.supplyPoint.cups,
        this.data.supplyPoint.hasService
      )
      cy.enterSupplyPointData(this.data.supplyPoint)
      const moreThan15Kw = false
      const powers = [this.data.power, this.data.power2]


      cy.enterPowerFare(moreThan15Kw, powers)

      cy.chooseTariff(this.data.isIndexed)

      cy.enterSelfConsumption(
        this.data.selfConsumption.have_installation,
        this.data.selfConsumption
      )

      cy.identifyOwner(this.data.member.vat, this.data.holder.previousHolder)

      cy.enterVoluntaryCent(this.data.holder.voluntaryCent)

      cy.enterPaymentData(this.data.holder.iban)

      cy.reviewAndConfirmData()

      cy.get('[data-cy=submit]').should('not.have.class', 'Mui-disabled')
    })
  })

  describe('Contract with CUPS without service', function () {
    beforeEach(function () {
      cy.identifyMember(this.data.member.number, this.data.member.vat)
      cy.identifySupplyPoint(
        this.data.supplyPoint.cups,
        this.data.supplyPoint.hasNoService
      )
      cy.enterSupplyPointData(this.data.supplyPoint)
    })

    it('Contract with 2.0TD', function () {
      const moreThan15Kw = false
      const powers = [this.data.power, this.data.power2]

      cy.choosePhase(this.data.phase)

      cy.enterPowerFare(moreThan15Kw, powers)

      cy.chooseTariff(this.data.isIndexed)

      cy.identifyOwner(this.data.member.vat)

      cy.enterVoluntaryCent(this.data.holder.voluntaryCent)

      cy.enterPaymentData(this.data.holder.iban)

      cy.reviewAndConfirmData()

      cy.get('[data-cy=submit]').should('not.have.class', 'Mui-disabled')
    })

    it('3.0TD no incremental powers', function () {
      const moreThan15Kw = true
      const powers = [
        this.data.power,
        this.data.power2,
        this.data.power3,
        this.data.power6,
        this.data.power6,
        this.data.power
      ]

      cy.noIncrementalPowers(this.data.phase, moreThan15Kw, powers)
    })

    it('Contract with 3.0TD', function () {
      const moreThan15Kw = true
      const powers = [
        this.data.power,
        this.data.power2,
        this.data.power3,
        this.data.power4,
        this.data.power5,
        this.data.power6
     ]

      cy.choosePhase(this.data.phase)

      cy.enterPowerFare(moreThan15Kw, powers)

      cy.chooseTariff(this.data.isIndexed)

      cy.identifyOwner(this.data.member.vat)

      cy.enterVoluntaryCent(this.data.holder.voluntaryCent)

      cy.enterPaymentData(this.data.holder.iban)

      cy.reviewAndConfirmData()

      cy.get('[data-cy=submit]').should('not.have.class', 'Mui-disabled')
    })
  })

  describe('Contract with service, no selfconsumption, correct data', function () {
    beforeEach(function () {
      cy.identifyMember(this.data.member.number, this.data.member.vat)
      cy.identifySupplyPoint(
        this.data.supplyPoint.cups,
        this.data.supplyPoint.hasService
      )
      cy.enterSupplyPointData(this.data.supplyPoint)
    })

    it('Contract with 2.0TD', function () {
      const moreThan15Kw = false

      cy.chooseMoreOrLessThan15Kw(moreThan15Kw)

      const powers = [this.data.power, this.data.power2]

      cy.enterPowerFare(moreThan15Kw, powers)

      cy.chooseTariff(this.data.isIndexed)

      cy.enterSelfConsumption(this.data.selfConsumption.have_no_installation)

      cy.identifyOwner(this.data.member.vat, this.data.holder.previousHolder)

      cy.enterVoluntaryCent(this.data.holder.voluntaryCent)

      cy.enterPaymentData(this.data.holder.iban)

      cy.reviewAndConfirmData()

      cy.get('[data-cy=submit]').should('not.have.class', 'Mui-disabled')
    })

    it('Contract with 3.0TD', function () {
      const moreThan15Kw = true

      cy.chooseMoreOrLessThan15Kw(moreThan15Kw)

      const powers = [
        this.data.power,
        this.data.power2,
        this.data.power3,
        this.data.power4,
        this.data.power5,
        this.data.power6
     ]

      cy.enterPowerFare(moreThan15Kw, powers)

      cy.chooseTariff(this.data.isIndexed)

      cy.enterSelfConsumption(this.data.selfConsumption.have_no_installation)

      cy.identifyOwner(this.data.member.vat, this.data.holder.previousHolder)

      cy.enterVoluntaryCent(this.data.holder.voluntaryCent)

      cy.enterPaymentData(this.data.holder.iban)

      cy.reviewAndConfirmData()

      cy.get('[data-cy=submit]').should('not.have.class', 'Mui-disabled')
    })
  })

  describe('Wrong power', function () {
    beforeEach(function () {
      cy.identifyMember(this.data.member.number, this.data.member.vat)
      cy.identifySupplyPoint(
        this.data.supplyPoint.cups,
        this.data.supplyPoint.hasService
      )
      cy.enterSupplyPointData(this.data.supplyPoint)
    })

    it('Contract 3.0A less than 15kW', function () {
      const moreThan15Kw = true

      cy.chooseMoreOrLessThan15Kw(moreThan15Kw)

      const powers = [
        this.data.power,
        this.data.power,
        this.data.power,
        this.data.power,
        this.data.power,
        this.data.power
     ]

      cy.no30Power(this.data.phase, moreThan15Kw, powers)
    })
  })

  describe('Wrong fields', function () {
    it('Check fields error detection', function() {
    let memberNumber = this.data.member.number
    let memberVat = this.data.member.badVat

    cy.intercept('GET', '/data/soci/**').as('checkMember')

    cy.get('#memberNumber')
      .clear()
      .type(memberNumber)
      .should('have.value', memberNumber)

    cy.get('#vat').clear().type(memberVat).should('have.value', memberVat)

    cy.wait('@checkMember')
      .its('response.statusCode')
      .should('be.oneOf', [200, 304])

    cy.contains('No se ha encontrado ningún socio/a ')
    cy.get('[data-cy=next]').should('be.disabled')

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
    cy.contains('Actualmente este CUPS está en un proceso')

    cy.get('#cups')
      .clear()
      .type(this.data.supplyPoint.validCups)
      .should('have.value', this.data.supplyPoint.validCups)
      .blur()

    cy.get('#cups')
      .clear()
      .type(this.data.supplyPoint.cups)
      .should('have.value', this.data.supplyPoint.cups)

    cy.wait(2000)
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

    cy.get('#supply_point_cnae').should(
      'have.value',
      this.data.supplyPoint.cnae
    )

    cy.get('[name="supply_point_accepted"]').click()
    cy.get('[data-cy=accept]').click()

    cy.get('[data-cy=next]').click()

    const moreThan15Kw = false
    const powers = [this.data.power, this.data.power2]

    cy.enterPowerFare(moreThan15Kw, powers)

    cy.chooseTariff(this.data.isIndexed)

    cy.enterSelfConsumption(this.data.selfConsumption.have_no_installation)

    cy.get('[name="holder.vat"]')
      .type(this.data.holder.vat)
      .should('have.value', this.data.holder.vat)

    cy.wait(2000)
    cy.get(`[data-value="${this.data.holder.previousHolder}"]`).click()

    cy.get('[data-cy=next]').click()

    cy.get('[name="holder.name"]')
      .type(this.data.holder.name)
      .should('have.value', this.data.holder.name)

    cy.get('[name="holder.surname1"]')
      .type(this.data.holder.surname1)
      .should('have.value', this.data.holder.surname1)

    cy.get('[name="holder.surname2"]')
      .type(this.data.holder.surname2)
      .should('have.value', this.data.holder.surname2)

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
      .type(this.data.holder.badEmail)
      .should('have.value', this.data.holder.badEmail)
      .blur()

    cy.contains('No has introducido el correo electrónico')

    cy.get('[name="holder.email"]')
      .clear()
      .type(this.data.holder.email)
      .should('have.value', this.data.holder.email)

    cy.get('[name="holder.email2"]')
      .type(this.data.holder.badEmail)
      .should('have.value', this.data.holder.badEmail)
      .blur()

    cy.contains('No has repetido correctamente el correo electrónico')

    cy.get('[name="holder.email2"]')
      .clear()
      .type(this.data.holder.email)
      .should('have.value', this.data.holder.email)

    cy.get('[name="holder.phone1"]')
      .type(this.data.holder.phone)
      .should('have.value', this.data.holder.phone)

    cy.get('#holder_lang').click()
    cy.get('[data-value="ca_ES"]').click()

    cy.get('[data-cy=next]').click()

    cy.get(`[data-value="${this.data.holder.voluntaryCent}"]`).click()

    cy.get('[data-cy=next]').click()

    cy.get('[name="payment.iban"]')
      .clear()
      .type(this.data.holder.badIban)
      .should('have.value', this.data.holder.badIban)
      .blur()

    cy.contains('IBAN incorrecto')

    cy.get('[name="payment.iban"]')
      .clear()
      .type(this.data.holder.iban)
      .should('have.value', this.data.holder.iban)

    cy.get('[name="payment.sepa_accepted"]').click()
    cy.get('[data-cy=accept]').click()
    cy.get('[data-cy=next]').click()

    cy.reviewAndConfirmData()

    cy.get('[data-cy=submit]').should('not.have.class', 'Mui-disabled')
  })
})

  describe('Juridic Person', function () {
    beforeEach(function () {

      cy.identifyMember(this.data.juridicMember.number, this.data.juridicMember.vat)
      cy.identifySupplyPoint(
        this.data.supplyPoint.cups,
        this.data.supplyPoint.hasService
      )
      cy.enterSupplyPointData(this.data.supplyPoint)
    })

    it('Juridic 20', function() {
      const moreThan15Kw = false

      cy.chooseMoreOrLessThan15Kw(moreThan15Kw)

      const powers = [this.data.power, this.data.power2]

      cy.enterPowerFare(moreThan15Kw, powers)

      cy.chooseTariff(this.data.isIndexed)

      cy.enterSelfConsumption(this.data.selfConsumption.have_no_installation)

      cy.identifyOwner(this.data.juridicHolder.vat, this.data.juridicHolder.previousHolder)


    })
    afterEach(function () {
      cy.juridicPersonalData(this.data.juridicHolder, this.data.holder)
      cy.reviewAndConfirmData()
    })
/*
    it('Same juridic person', function () {
      cy.get('[name="holder.vat"]')
        .type(this.data.juridicMember.vat)
        .should('have.value', this.data.juridicMember.vat)

      cy.wait(2000)
      cy.get(`[data-value="${this.data.juridicHolder.previousHolder}"]`).click()

      cy.get('[data-cy=next]').click()
    })

    it('Different juridic person', function () {
      cy.get('[name="holder.vat"]')
        .type(this.data.juridicHolder.vat)
        .should('have.value', this.data.juridicHolder.vat)
      cy.wait(2000)
      cy.get(`[data-value="${this.data.juridicHolder.previousHolder}"]`).click()

      cy.get('[data-cy=next]').click()
      */
    })
  })
