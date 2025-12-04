/// <reference types="cypress" />
import React, { useState } from 'react'
import Chooser from '../../src/components/NewChooser'
import CheckCircleIcon from '@mui/icons-material/CheckCircle'

describe('Chooser Component', () => {

  const OPTIONS = [
    {
      id: 'opt1',
      icon: <CheckCircleIcon />,
      textHeader: 'Opción 1',
      textBody: 'Descripción de la opción 1'
    },
    {
      id: 'opt2',
      icon: <CheckCircleIcon />,
      textHeader: 'Opción 2',
      textBody: 'Descripción de la opción 2'
    }
  ]

  const Wrapper = () => {
    const [value, setValue] = useState('opt1')
    return (
      <Chooser
        name="chooser-test"
        options={OPTIONS}
        value={value}
        handleChange={setValue}
      />
    )
  }

  beforeEach(() => {
    cy.mount(<Wrapper />)
  })

  it('renderiza el componente con las opciones', () => {
    cy.get('[data-cy="chooser-test"]').should('exist')
    cy.get('[data-cy="opt1"]').should('exist')
    cy.get('[data-cy="opt2"]').should('exist')
  })

  it('muestra la opción seleccionada con el checkbox', () => {
    cy.get('[data-cy="opt1"]').find('input[type="checkbox"]').should('exist')
    cy.get('[data-cy="opt2"]').find('input[type="checkbox"]').should('not.exist')
  })

  it('cambia la selección al hacer click en otra opción', () => {
    cy.get('[data-cy="opt2"]').click()

    cy.get('[data-cy="opt2"]').find('input[type="checkbox"]').should('exist')
    cy.get('[data-cy="opt1"]').find('input[type="checkbox"]').should('not.exist')
  })

  it('cambia la selección con Enter', () => {
    cy.get('[data-cy="opt2"]')
      .focus()
      .trigger('keydown', { key: 'Enter' })

    cy.get('[data-cy="opt2"]').find('input[type="checkbox"]').should('exist')
  })

  it('cambia la selección con la barra espaciadora', () => {
    cy.get('[data-cy="opt2"]')
      .focus()
      .trigger('keydown', { key: ' ' })

    cy.get('[data-cy="opt2"]').find('input[type="checkbox"]').should('exist')
  })

})
