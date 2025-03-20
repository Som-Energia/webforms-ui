export const WAIT_TIME = 3000

describe('Contract', () => {
  Cypress.on('uncaught:exception', (error, runnable) => {
    console.error(error)
    return false
  })

  beforeEach(() => {

    cy.intercept('GET', '/ping', {
      body: {
        state: true,
        status: 'ONLINE'
      }
    }).as('checkPing');

    cy.visit('/contract')


    cy.wait('@checkPing')
      .its('response.statusCode')
      .should('be.oneOf', [200, 304])

    cy.fixture('contract.json').as('data')
    cy.fixture('holderChangePersonaldata.json').as('personaldata')
    cy.fixture('generationLocationData/provincies.json').as('provincies')
    cy.fixture('generationLocationData/municipis.json').as('municipis')
    cy.fixture('generationLocationData/ine.json').as('ine')
    cy.fixture('contracts/generator_technologies.json').as(
      'generator_technologies'
    )
    cy.fixture('contracts/installation_types.json').as('installation_types')
    cy.fixture('contracts/prices.json').as('prices')
  })
  
  describe('Contract with selfconsumption', function () {
    it('2.0TD', function () {
      cy.identifyMember(this.data.member.number, this.data.member.vat)
      cy.identifySupplyPoint(
        this.data.supplyPoint.cups,
        this.data.supplyPoint.hasService
      )

      cy.intercept('GET', '/data/provincies', {
        statusCode: 200,
        body: this.provincies
      })

      cy.intercept('GET', '/data/municipis/*', {
        statusCode: 200,
        body: this.municipis
      })

      cy.intercept('GET', '/data/ine/*', {
        statusCode: 200,
        body: this.ine
      })
      cy.enterSupplyPointData(this.data.supplyPoint)
      const moreThan15Kw = false
      const powers = [this.data.power, this.data.power2]

      cy.fixture('normalizedData/contract_20selfconsumption.json').as('reqData')

      cy.enterPowerFare(moreThan15Kw, powers)

      cy.chooseTariff(this.data.isIndexed)


      cy.intercept('GET', '/data/generator_technologies', {
        statusCode: 200,
        body: this.generator_technologies
      })

      cy.intercept('GET', '/data/installation_types', {
        statusCode: 200,
        body: this.installation_types
      })

      cy.enterSelfConsumption(
        this.data.selfConsumption.have_installation,
        this.data.selfConsumption
      )

      cy.intercept('GET', '/check/vat/exists/*', {
        statusCode: 200,
        body: {

          data: {
            exists: true,
            is_member: true,
            is_selfconsumption_owner: false,
            valid: true
          },
          state: true,
          status: "ONLINE"
        }
      })

      cy.identifyOwner(this.data.member.vat, this.data.holder.previousHolder)

      cy.enterVoluntaryCent(this.data.holder.voluntaryCent)


      cy.intercept('GET', '/check/iban/*', {
        statusCode: 200,
        body: {
          data: {
            iban: "",
          },
          state: true,
          status: "ONLINE"
        }
      })

      cy.enterPaymentData(this.data.holder.iban)

      cy.intercept('GET', '/data/prices*', {
        statusCode: 200,
        body: this.prices
      })


      cy.reviewAndConfirmData()


      cy.intercept('POST', '/procedures/contract', (req) => {
      expect(req.body).to.deep.equal(this.reqData);
        req.reply({
          statusCode: 200,
          body: {
            data: {
              contract_id: 565944,
              contract_number: 240032
            },
            state: true,
            status: 'ONLINE'
          },
        });
      })
      cy.get('[data-cy=submit]').should('not.have.class', 'Mui-disabled')
    })
  })

  describe('Contract with CUPS without service', function () {
    beforeEach(function () {
      cy.fixture('normalizedData/contract20_noservice.json').as('reqData')
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

      cy.intercept('POST', '/procedures/contract', (req) => {
        expect(req.body).to.deep.equal(this.reqData);
          req.reply({
            statusCode: 200,
            body: {
              data: {
                contract_id: 565944,
                contract_number: 240032
              },
              state: true,
              status: 'ONLINE'
            },
          });
        })
        cy.get('[data-cy=submit]').should('not.have.class', 'Mui-disabled')
    })

    it('3.0TD no incremental powers', function () {
      if (!Cypress.env('FEATURE_FLAGS').is30ContractEnabled) {
        this.skip()
      }
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
      if (!Cypress.env('FEATURE_FLAGS').is30ContractEnabled) {
        this.skip()
      }
      const moreThan15Kw = true
      const powers = [
        this.data.power,
        this.data.power2,
        this.data.power3,
        this.data.power4,
        this.data.power5,
        this.data.power6
     ]
      cy.fixture('normalizedData/contract_30selfconsumption.json').as('reqData')

      cy.choosePhase(this.data.phase)

      cy.enterPowerFare(moreThan15Kw, powers)

      cy.chooseTariff(this.data.isIndexed)

      cy.identifyOwner(this.data.member.vat)

      cy.enterVoluntaryCent(this.data.holder.voluntaryCent)

      cy.enterPaymentData(this.data.holder.iban)

      cy.reviewAndConfirmData()

      cy.intercept('POST', '/procedures/contract', (req) => {
        expect(req.body).to.deep.equal(this.reqData);
          req.reply({
            statusCode: 200,
            body: {
              data: {
                contract_id: 565944,
                contract_number: 240032
              },
              state: true,
              status: 'ONLINE'
            },
          });
        })
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

      cy.fixture('normalizedData/contract20.json').as('reqData')

      cy.enterPowerFare(moreThan15Kw, powers)

      cy.chooseTariff(this.data.isIndexed)

      cy.enterSelfConsumption(this.data.selfConsumption.have_no_installation)

      cy.identifyOwner(this.data.member.vat, this.data.holder.previousHolder)

      cy.enterVoluntaryCent(this.data.holder.voluntaryCent)

      cy.enterPaymentData(this.data.holder.iban)

      cy.reviewAndConfirmData()

      cy.intercept('POST', '/procedures/contract', (req) => {
        console.log("RESPONSE",req)
        expect(req.body).to.deep.equal(this.reqData);
          req.reply({
            statusCode: 200,
            body: {
              data: {
                contract_id: 565944,
                contract_number: 240032
              },
              state: true,
              status: 'ONLINE'
            },
          })
        })
        cy.get('[data-cy=submit]').should('not.have.class', 'Mui-disabled')
    })

    it('Contract with 3.0TD', function () {
      if (!Cypress.env('FEATURE_FLAGS').is30ContractEnabled) {
        this.skip()
      }
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

      cy.fixture('normalizedData/contract_30noselfconsumption.json').as('reqData')

      cy.enterPowerFare(moreThan15Kw, powers)

      cy.chooseTariff(this.data.isIndexed)

      cy.enterSelfConsumption(this.data.selfConsumption.have_no_installation)

      cy.identifyOwner(this.data.member.vat, this.data.holder.previousHolder)

      cy.enterVoluntaryCent(this.data.holder.voluntaryCent)

      cy.enterPaymentData(this.data.holder.iban)

      cy.reviewAndConfirmData()

      cy.intercept('POST', '/procedures/contract', (req) => {
        expect(req.body).to.deep.equal(this.reqData);
          req.reply({
            statusCode: 200,
            body: {
              data: {
                contract_id: 565944,
                contract_number: 240032
              },
              state: true,
              status: 'ONLINE'
            },
          })
        })
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
      if (!Cypress.env('FEATURE_FLAGS').is30ContractEnabled) {
        this.skip()
      }
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

/* TODO adapt tests intercepting the response

  describe('Wrong fields', function () {
    it('Check fields error detection', function () {
      let memberNumber = this.data.member.number
      let memberVat = this.data.member.badVat

      cy.intercept('GET', '/check/vat/*', {
        statusCode: 200,
        body: {
          data: true,
          state: true
        }
      }).as('checkVat')

      cy.intercept('GET', '/check/soci/**',
        {
          statusCode: 200,
          body: {
          }
        }).as('checkMember')


      cy.fixture('normalizedData/contract_20_owner.json').as('reqData')

      cy.get('#memberNumber')
        .clear()
        .type(memberNumber)
        .should('have.value', memberNumber)

      cy.get('#vat').clear().type(memberVat).should('have.value', memberVat)
      .wait('@checkMember')
        .its('response.statusCode')
        .should('be.oneOf', [200, 304])

      cy.contains('No se ha encontrado ningún socio/a ')
      cy.get('[data-cy=next]').should('be.disabled')

      cy.intercept('GET', '/check/vat/*', {
        statusCode: 200,
        body: {
          data: true,
          state: true
        }
      }).as('checkVat')
     
      cy.intercept('GET', '/check/soci/**',
        {
          statusCode: 200,
          body: {
            data: true,
            state: true
          }
        }).as('checkMember')

      cy.get('#memberNumber')
        .clear()
        .type(memberNumber)
        .should('have.value', memberNumber)

      cy.get('#vat')
        .clear()
        .type(this.data.member.vat)
        .should('have.value', this.data.member.vat)

      cy.wait('@checkMember')
        .its('response.statusCode')
        .should('be.oneOf', [200, 304])

      cy.get('[data-cy=next]').click()

      cy.get('#cups')
        .clear()
        .type(this.data.supplyPoint.badCups)
        .should('have.value', this.data.supplyPoint.badCups)
        .blur()
      cy.contains('CUPS incorrecto')

      cy.get('#cups')
        .clear()
        .type(this.personaldata.invalidCups)
        .should('have.value', this.personaldata.invalidCups)
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

      cy.wait(WAIT_TIME)
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

      cy.intercept('POST', '/procedures/contract', (req) => {
        expect(req.body).to.deep.equal(this.reqData)
        req.reply({
          statusCode: 200,
          body: {
            data: {
              contract_id: 565944,
              contract_number: 240032
            },
            state: true,
            status: 'ONLINE'
          }
        })
      })
      cy.get('[data-cy=submit]').should('not.have.class', 'Mui-disabled')
    })
  })
  /*
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
      cy.fixture('normalizedData/contract_juridic.json').as('reqData')
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

      cy.intercept('POST', '/procedures/contract', (req) => {
        expect(req.body).to.deep.equal(this.reqData);
          req.reply({
            statusCode: 200,
            body: {
              data: {
                contract_id: 565944,
                contract_number: 240032
              },
              state: true,
              status: 'ONLINE'
            },
          });
        //})
        cy.get('[data-cy=submit]').should('not.have.class', 'Mui-disabled')
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
        .type(this.data.juridicHolder.vat)
        .should('have.value', this.data.juridicHolder.vat)
      cy.wait(WAIT_TIME)
      cy.get(`[data-value="${this.data.juridicHolder.previousHolder}"]`).click()

      cy.get('[data-cy=next]').click()
      
    })
  })*/
})
