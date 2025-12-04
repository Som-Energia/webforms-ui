/// <reference types="cypress" />
import React from 'react'
import NewLoading from '../../src/components/NewLoading'

// Mock de useTranslation
const mockUseTranslation = () => ({
  t: (key) => key
})

describe('NewLoading Component', () => {

  it('renderiza el componente correctamente', () => {
    cy.mount(
      <NewLoading
        description="Cargando datos..."
        t={mockUseTranslation().t} // pasamos el mock si quieres
      />
    )

    cy.get('[data-testid="loading-component"]').should('exist')
    cy.get('svg') // CircularProgress es un SVG
      .should('exist')
    cy.contains('Cargando datos...').should('exist')
  })

  it('muestra correctamente la descripción pasada por props', () => {
    const description = 'Procesando información'
    cy.mount(<NewLoading description={description} />)

    cy.contains(description).should('exist')
  })

  it('aplica estilos de flex y gap', () => {
    cy.mount(<NewLoading description="Test" />)
    cy.get('[data-testid="loading-component"]')
      .should('have.css', 'display', 'flex')
      .and('have.css', 'flex-direction', 'column')
  })

})
