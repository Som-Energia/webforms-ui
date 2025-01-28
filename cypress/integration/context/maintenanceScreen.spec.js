describe('Maintenance Screen', () => {
  Cypress.on('uncaught:exception', (error, runnable) => {
    console.error(error)
    return false
  })

  describe('ping responses', function () {
    beforeEach(() => {
      cy.visit('/')
    })
    it('returns an unexpected error', function () {
      cy.statusCode500()
      cy.contains('Estamos realizando tareas de mantenimiento', {
        matchCase: false
      })
    })
    it('returns an offline error', function () {
      cy.statusOffline()
      cy.contains('Estamos realizando tareas de mantenimiento', {
        matchCase: false
      })
    })
    it('returns a state false', function () {
      cy.stateFalse()
      cy.contains('Estamos realizando tareas de mantenimiento', {
        matchCase: false
      }).should('not.exist')
    })
  })

  describe('language', function () {
    beforeEach(() => {
      cy.statusCode500()
    })
    it('is set for "ca"', function () {
      cy.visit('/ca/contract-20')
      cy.contains('Tornem aviat', {
        matchCase: false
      })
    })
    it('is set for "es"', function () {
      cy.visit('/es/contract-20')
      cy.statusCode500()
      cy.contains('Volvemos pronto', {
        matchCase: false
      })
    })
    it('is set for "gl"', function () {
      cy.visit('/gl/contract-20')
      cy.statusCode500()
      cy.contains('Voltamos axiña', {
        matchCase: false
      })
    })
    it('is set for "eu"', function () {
      cy.visit('/eu/contract-20')
      cy.statusCode500()
      cy.contains('Laster itzuliko gara', {
        matchCase: false
    })
    })
  })
})
