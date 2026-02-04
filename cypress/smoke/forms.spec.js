describe('Smoke check for API', () => {
    it('Webforms api should work', () => {
        cy.request('https://api.somenergia.coop/ping').its('body').should(
            'deep.equal',
            { "state": true, "status": "ONLINE" })
    })
})

describe('Smoke check for contract form', () => {
    it('Button to go to contract main page should work', () => {
        cy.request('/ca/contracta-la-llum-domestic').its('status').should('eq', 200)
        cy.request('/es/contrata-la-luz-domestico').its('status').should('eq', 200)
        cy.request('/gl/contrata-la-luz-domestico').its('status').should('eq', 200)
        cy.request('/eu/kontrata-argia-etxea').its('status').should('eq', 200)
    })
    it('Button to go to contract periods form should work', () => {
        cy.request('/ca/formulari-contractacio-periodes').its('status').should('eq', 200)
        cy.request('/es/formulario-contratacion-periodos').its('status').should('eq', 200)
        cy.request('/gl/formulario-contrato-periodos').its('status').should('eq', 200)
        cy.request('/eu/kontratazio-formularioa-ordutegitarteak').its('status').should('eq', 200)
    })
    it('Button to go to contract indexed form should work', () => {
        cy.request('/ca/formulari-contractacio-indexada').its('status').should('eq', 200)
        cy.request('/es/formulario-contratacion-indexada').its('status').should('eq', 200)
        cy.request('/gl/formulario-contrato-indexada').its('status').should('eq', 200)
        cy.request('/eu/kontratazio-formularioa-indexatua').its('status').should('eq', 200)
    })
    it('Form should be embedded in webpage', () => {
        cy.visit('/es/formulario-contratacion-periodos')
        cy.get('[data-cy="contract-form"]')
            .should('have.attr', 'aria-label', 'contract-form')
    })
})

describe('Smoke check for new member form', () => {
    it('Button to go to new member main page should work', () => {
        cy.request('/ca/cooperativa/associar-se').its('status').should('eq', 200)
        cy.request('/es/cooperativa/asociarse').its('status').should('eq', 200)
        cy.request('/gl/cooperativa/asociarse').its('status').should('eq', 200)
        cy.request('/eu/kooperatiba/bazkidetu').its('status').should('eq', 200)
    })
    it('Button to go to new member form should work', () => {
        cy.request('/ca/cooperativa/formulari-associar-se').its('status').should('eq', 200)
        cy.request('/es/cooperativa/formulario-asociarse').its('status').should('eq', 200)
        cy.request('/gl/cooperativa/formulario-asociarse').its('status').should('eq', 200)
        cy.request('/eu/kooperatiba/bazkidetu-formularioa').its('status').should('eq', 200)

    })
    it('Form should be embedded in webpage', () => {
        cy.visit('/es/cooperativa/formulario-asociarse')
        cy.get('[data-cy="member-form"]')
            .should('have.attr', 'aria-label', 'member-form')
    })
})

describe('Smoke check for gurb form', () => {
    it('Button to go to gurb main page should work', () => {
        cy.request('/ca/serveis/generacio-urbana').its('status').should('eq', 200)
        cy.request('/es/servicios/generacion-urbana').its('status').should('eq', 200)
        cy.request('/gl/servicios/generacion-urbana').its('status').should('eq', 200)
        cy.request('/eu/zerbitzuak/hiri-sorkuntza').its('status').should('eq', 200)

    })
    it('Access to gurb requirements form should work', () => {
        cy.request('/ca/gurb/G001/requirements').its('status').should('eq', 200)
    })
    it('Access to gurb join form should work', () => {
        cy.request('/ca/gurb/G001/join').its('status').should('eq', 200)
    })
    it('Gurb requirements form should be embedded in webpage', () => {
        cy.visit('/es/gurb/G001/requirements')
        cy.get('[data-cy="gurb-requirements-form"]')
            .should('have.attr', 'aria-label', 'gurb-requirements-form')
    })
    it('Gurb join form should be embedded in webpage', () => {
        cy.visit('/es/gurb/G001/join')
        cy.get('[data-cy="gurb-join-form"]')
            .should('have.attr', 'aria-label', 'gurb-join-form')
    })
})

