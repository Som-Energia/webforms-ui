
describe('Requirements', () => {
    Cypress.on('uncaught:exception', (error, runnable) => {
        console.error(error)
        return false
    })

    before(() => {
        cy.fixture('gurb.json').as('data')
        cy.fixture('holderChangePersonaldata.json').as('personaldata')
        cy.fixture('googleAutocomplete/autocompleteResponse.json').as('googleAutocompleteResponse')
        cy.fixture('googleAutocomplete/getPlaceResponse.json').as('googlePlaceResponse')
    })

    beforeEach(function () {
        // There is g001 as a gurbCode
        cy.visit(`/ca/gurb/${this.data.gurbCode}/requirements`)
    })

    describe('Gurb Requirements', function () {
        it('Contract exist', function () {
            cy.identifySupplyPointGURB(this.data.supplyPoint.existing_cups, 'active', 200)

            cy.fillGurbAddress(
                this.data.gurbCode,
                this.data.personalData.googleAutoCompleteStreet,
                this.data.addressData.lat,
                this.data.addressData.long,
                200,
                this.googleAutocompleteResponse,
                this.googlePlaceResponse
            )

            /*
            cy.lightQuestion()

            cy.selfconsumptionQuestion(false)

            cy.memberQuestion('member-off')

            cy.personalDataMember(this.data.personalData)

            cy.get('[data-cy="success_link"]').click()

            cy.identifyHolderGURB(this.personaldata.vat)  // Test whats happend if VAT is same as newMember VAT

            cy.personalDataHolder(this.data.personalData)

            cy.taxAddress({ ...this.personaldata.invalidGurbAddress, sameDirection: true })

            cy.supplyPointData()

            cy.choosePower({ powers: [2, 3] })

            cy.chooseTariffGURB()

            cy.donationQuestion()

            cy.paymentData(this.data.randomIban)

            cy.checkReviewContractStep(this.personaldata.vat)

            cy.interceptAvailablePowers()

            cy.powerChoice('0_5_kwh')

            cy.acceptAllTerms() */
        })
    })
})