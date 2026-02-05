const checkStatus = (url, status = 200) => {
    cy.request(url).its('status').should('eq', status)
}

describe('Smoke check for API', () => {
    it('Webforms api should work', () => {
        cy.request('https://api.somenergia.coop/ping').its('body').should(
            'deep.equal',
            { "state": true, "status": "ONLINE" })
    })
})

describe('Smoke check for contract form', () => {
    it('Button to go to contract main page should work', () => {
        const paths = [
            '/ca/contracta-la-llum-domestic',
            '/es/contrata-la-luz-domestico',
            '/gl/contrata-la-luz-domestico',
            '/eu/kontrata-argia-etxea'
        ]

        paths.forEach((path) => {
            checkStatus(path)
        })
    })
    it('Button to go to contract periods form should work', () => {
        const paths = [
            '/ca/formulari-contractacio-periodes',
            '/es/formulario-contratacion-periodos',
            '/gl/formulario-contrato-periodos',
            '/eu/kontratazio-formularioa-ordutegitarteak'
        ]

        paths.forEach((path) => {
            checkStatus(path)
        })
    })
    it('Button to go to contract indexed form should work', () => {
        const paths = [
            '/ca/formulari-contractacio-indexada',
            '/es/formulario-contratacion-indexada',
            '/gl/formulario-contrato-indexada',
            '/eu/kontratazio-formularioa-indexatua'
        ]
        paths.forEach((path) => {
            checkStatus(path)
        })
    })
    it('Form should be embedded in webpage', () => {
        cy.visit('/es/formulario-contratacion-periodos')
        cy.get('[data-cy="contract-form"]')
            .should('have.attr', 'aria-label', 'contract-form')
    })
})

describe('Smoke check for new member form', () => {
    it('Button to go to new member main page should work', () => {
        const paths = [
            '/ca/cooperativa/associar-se',
            '/es/cooperativa/asociarse',
            '/gl/cooperativa/asociarse',
            '/eu/kooperatiba/bazkidetu'
        ]
        paths.forEach((path) => {
            checkStatus(path)
        })
    })
    it('Button to go to new member form should work', () => {
        const paths = [
            '/ca/cooperativa/formulari-associar-se',
            '/es/cooperativa/formulario-asociarse',
            '/gl/cooperativa/formulario-asociarse',
            '/eu/kooperatiba/bazkidetu-formularioa'
        ]
        paths.forEach((path) => {
            checkStatus(path)
        })
    })
    it('Form should be embedded in webpage', () => {
        cy.visit('/es/cooperativa/formulario-asociarse')
        cy.get('[data-cy="member-form"]')
            .should('have.attr', 'aria-label', 'member-form')
    })
})

describe('Smoke check for gurb form', () => {
    it('Button to go to gurb main page should work', () => {
        const paths = [
            '/ca/serveis/generacio-urbana',
            '/es/servicios/generacion-urbana',
            '/gl/servicios/generacion-urbana',
            '/eu/zerbitzuak/hiri-sorkuntza'
        ]
        paths.forEach((path) => {
            checkStatus(path)
        })
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
    it('Gurb url-ok form should be embedded in webpage', () => {
        cy.visit('/ca/gurb/gurb-url-ok')
        cy.get('[data-cy="gurb-url-ok-form"]')
            .should('have.attr', 'aria-label', 'gurb-url-ok-form')
    })
})