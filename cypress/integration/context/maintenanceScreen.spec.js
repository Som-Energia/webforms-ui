describe('Maintenance Screen', () => {
  Cypress.on('uncaught:exception', (error, runnable) => {
    console.error(error)
    return false
  })

  beforeEach(() => {
    cy.visit('/')
  })

  describe('ping responses', function () {
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
})
