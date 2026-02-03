describe('Verify connection to localhost', () => {
    it('check if development environment is applied', () => {
        const projectId = Cypress.config().projectId

        expect(Cypress.config().baseUrl).to.include('localhost')
        expect(projectId).to.eq('6y5vbm')
    })
})