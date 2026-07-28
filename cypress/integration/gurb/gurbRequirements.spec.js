
describe('Requirements', () => {
    Cypress.on('uncaught:exception', (error, runnable) => {
        console.error(error)
        return false
    })

    before(() => {
        cy.fixture('gurb.json').as('data')
        cy.fixture('googleAutocomplete/autocompleteResponse.json').as('googleAutocompleteResponse')
        cy.fixture('googleAutocomplete/getPlaceResponse.json').as('googlePlaceResponse')
    })

    beforeEach(function () {
        cy.visit(`/ca/gurb/${this.data.gurbCode}/requirements`)
        cy.then(() => {
          cy.interceptGooglePlaces(
            this.googleAutocompleteResponse,
            this.googlePlaceResponse
          )
        })
    })

    describe('Gurb Requirements', function () {
        it('Contract exist', function () {
            cy.identifySupplyPointGURB(this.data.supplyPoint.active_cups, 'active', 200)

            cy.fillGurbAddress(
                this.data.gurbCode,
                this.data.personalData.googleAutoCompleteStreet,
                this.data.addressData.lat,
                this.data.addressData.long,
                200,
                this.googleAutocompleteResponse,
                this.googlePlaceResponse
            )

            cy.lightQuestion(true)

            cy.resultExistingMember(this.data.gurbCode)
        })
    })

    describe('Gurb Requirements', function () {
        it('Contract NOT exist', function () {
            cy.identifySupplyPointGURB(this.data.supplyPoint.new_cups, 'new', 200)

            cy.fillGurbAddress(
                this.data.gurbCode,
                this.data.personalData.googleAutoCompleteStreet,
                this.data.addressData.lat,
                this.data.addressData.long,
                200,
                this.googleAutocompleteResponse,
                this.googlePlaceResponse
            )

            cy.lightQuestion(true)

            const selectedTariff = "periods"

            cy.choiceNewContractTariff(selectedTariff)

            cy.resultNotExistingMember(selectedTariff)
        })
    })
})
