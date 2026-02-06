describe('Generation Dashboard Language', () => {
  it('is set for "ca"', function () {
    cy.visit('/ca/investments/investments-kwh')
    cy.contains('Les meves aportacions', {
      matchCase: false
    })
  })
  it('is set for "es"', function () {
    cy.visit('/es/investments/investments-kwh')
    cy.contains('Mis aportaciones', {
      matchCase: false
    })
  })
  it('is set for "gl"', function () {
    cy.visit('/gl/investments/investments-kwh')
    cy.contains('As miñas achegas', {
      matchCase: false
    })
  })
  it('is set for "eu"', function () {
    cy.visit('/eu/investments/investments-kwh')
    cy.contains('Nire ekarpenak', {
      matchCase: false
  })
  })
})

