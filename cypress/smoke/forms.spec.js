describe('Smoke check for API', () => {
    it('Webforms api should work', () => {
        cy.request('https://api.somenergia.coop/ping').its('body').should(
            'deep.equal',
            { "state": true, "status": "ONLINE" })
    })
})

describe('Smoke check for contract form', () => {
    it('Button to go to contract main page should work', () => {
        cy.request('/ca/contracta-la-llum-domestic/').its('status').should('eq', 200)
    })
    it('Button to go to contract 20TD form should work', () => {
        cy.request('/ca/formulari-contractacio-periodes/?form_type=domestic').its('status').should('eq', 200)
    })
    it('Button to go to contract indexed form should work', () => {
        cy.request('/ca/formulari-contractacio-indexada/?form_type=domestic').its('status').should('eq', 200)
    })
    it('Button to go to enterprise contract 20TD form should work', () => {
        cy.request('/ca/formulari-contractacio-periodes/?form_type=enterprise').its('status').should('eq', 200)
    })

})

describe('Smoke check for new member form', () => {
    it('Button to go to new member main page should work', () => {
        cy.request('/ca/cooperativa/associar-se').its('status').should('eq', 200)
    })
    it('Button to go to new member form should work', () => {
        cy.request('/ca/cooperativa/formulari-associar-se').its('status').should('eq', 200)
    })
})

describe('Smoke check for gurb form', () => {
    it('Button to go to gurb main page should work', () => {
        cy.request('ca/serveis/generacio-urbana/').its('status').should('eq', 200)
    })
})