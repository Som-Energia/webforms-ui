/// <reference types="cypress" />
import React, { useState } from 'react'
import { ThemeProvider } from '@mui/material/styles'
import CUPS from '../../src/components/CUPS'
import * as api from '../../src/services/api'

import WebFormsTheme from '../../src/themes/webforms'

// Mock simple de useTranslation
const mockUseTranslation = () => ({
  t: (key) => key
})

describe('CUPS Component', () => {


  const Wrapper = ({ initialValue = '' }) => {
    const [values, setValues] = useState({ cups: initialValue })
    const [errors, setErrors] = useState({})
    const [touched, setTouched] = useState({})
    const [maxStepNum, setMaxStepNum] = useState(0)

    const setFieldValue = (field, value) => {
      setValues(prev => ({ ...prev, [field]: value }))
    }

    const setFieldError = (field, error) => {
      setErrors(prev => ({ ...prev, [field]: error }))
    }

    const setFieldTouched = (field, val) => {
      setTouched(prev => ({ ...prev, [field]: val }))
    }

    return (
      <ThemeProvider theme={WebFormsTheme}>
        <CUPS
          values={values}
          errors={errors}
          touched={touched}
          setValues={setValues}
          setFieldValue={setFieldValue}
          setFieldError={setFieldError}
          setFieldTouched={setFieldTouched}
          setMaxStepNum={setMaxStepNum}
          t={mockUseTranslation().t} // inyectar t
        />
        {window.Cypress && (
          <div data-testid="new-contract">{String(values.new_contract)}</div>
        )}
      </ThemeProvider>
    )
  }

  beforeEach(() => {
    //   mockCheckCups.reset()
  })

  it('renderiza correctamente', () => {
    cy.mount(<Wrapper />)
    cy.get('input[name="cups"]').should('exist')
    cy.contains('CUPS_HELPER_TEXT').should('exist')
    cy.contains('CUPS_HELPER_LINK').should('exist')
  })

  it('convierte input a mayúsculas y filtra caracteres no alfanuméricos', () => {
    cy.mount(<Wrapper />)
    cy.get('input[name="cups"]')
      .type('abc$123!')
      .should('have.value', 'ABC123')
  })

  it('dispara checkCups cuando el input tiene longitud entre 20 y 22', () => {
    cy.intercept('GET', '/check/cups/status/*',
      {
        statusCode: 200,
        body: {
          data: {
            cups: '12345678901234567890',
            status: "new",
            tariff_type: null
          },
          state: true,
          status: "ONLINE"
        }
      }).as('checkCUPS')

    cy.mount(<Wrapper />)

    const longCups = '12345678901234567890'

    cy.get('input[name="cups"]').type(longCups)

    cy.wait('@checkCUPS') // verifica que la API fue llamada

    cy.get('@checkCUPS')
      .its('request.url')
      .should('include', longCups)
  })

  it('setea new_contract cuando checkCups devuelve status=new', () => {
    cy.intercept('GET', '/check/cups/status/*', {
      statusCode: 200,
      body: {
        data: {
          status: "new",
          knowledge_of_distri: true,
          tariff_name: "Tarifa"
        }
      }
    }).as('checkCUPS')

    cy.mount(<Wrapper />)

    const longCups = '12345678901234567890'

    cy.get('input[name="cups"]').type(longCups)

    cy.wait('@checkCUPS')

    // ahora comprobamos el valor manipulado por useEffect
    cy.get('[data-testid="new-contract"]').should('have.text', 'true')
  })

  it('marca el campo como touched al hacer blur', () => {
    cy.mount(<Wrapper />)

    cy.get('input[name="cups"]').focus().blur()

    // renderiza error / helper cuando touched = true
    cy.contains('CUPS_HELPER_TEXT').should('exist')
  })

})
