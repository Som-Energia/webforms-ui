describe('Fixture Debug', () => {
  it('can load cancellation.json', () => {
    cy.fixture('cancellation.json').then((data) => {
      cy.log(JSON.stringify(data))
    })
  })
})