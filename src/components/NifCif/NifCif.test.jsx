import { ThemeProvider } from '@mui/material/styles'
import {
  queryByAttribute,
  render,
  screen,
  waitFor,
} from '@testing-library/react'
import { useState, useEffect } from 'react'
import { vi } from 'vitest'
import { checkVat } from '../../services/api'
import WebFormsTheme from '../../themes/webforms'
import NifCif from './NifCif'
import { LoadingContextProvider } from '../../context/LoadingContext'
import { initI18n } from '../../tests/i18n.mock'

// Mock the checkVat function
vi.mock('../../services/api', () => ({
  checkVat: vi.fn(),
}))

const webFormsTheme = WebFormsTheme()

const renderComponent = async (nifCifNumber, useEffectHandler) => {
  await initI18n({
    DNI_EXIST: 'DNI exists',
    FILL_NIF: 'NIF is invalid',
    INVALID_FORMAT: 'Invalid format',
  })

  return render(
    <NifCifWrapperComponent
      nifCifNumber={nifCifNumber}
      useEffectHandler={useEffectHandler}
    />
  )
}

const NifCifWrapperComponent = ({ nifCifNumber, useEffectHandler }) => {
  const [values, setValues] = useState({ owner: { nif: nifCifNumber } })
  const [errors, setError] = useState({ nifcif: null })
  const setFieldError = (fieldName, error) => {
    // This input has namespaced field names like 'owner.nif'
    // but InputField shows errors as { owner: { nif: 'error message' } }
    const [namespace, key] = fieldName.split('.')
    const finalError = { [namespace]: { [key]: error } }
    setError(finalError)
  }

  useEffect(() => {
    useEffectHandler && useEffectHandler(values)
  }, [values, useEffectHandler])

  return (
    <ThemeProvider theme={webFormsTheme}>
      <LoadingContextProvider>
        <NifCif
          textFieldNameKey="GURB_PARTICIPATION_NIF_TITLE"
          entity="owner"
          setValues={setValues}
          helperText={false}
          values={values}
          errors={errors}
          touched={{ owner: { nif: true } }}
          setFieldError={setFieldError}
        />
      </LoadingContextProvider>
    </ThemeProvider>
  )
}

describe('NifCif component ', () => {
  describe('Nif tests', () => {
    test('Nif renders without crashing and correct value', async () => {
      vi.mocked(checkVat).mockResolvedValue({})

      const nif = '12345678Z'
      const dom = await renderComponent(nif)

      await waitFor(() => {
        const getByDataCy = queryByAttribute.bind(null, 'data-cy')
        const input = getByDataCy(dom.container, 'owner.nif-input')
        expect(input).toBeInTheDocument()
        expect(input).toHaveValue(nif)
      })
    })

    test('Nif renders with DNI is not valid error', async () => {
      vi.mocked(checkVat).mockResolvedValue({
        data: { valid: false },
      })

      const invalidNif = '12345678Z'
      await renderComponent(invalidNif)
      const errorMessage = await screen.findByText('NIF is invalid')
      expect(errorMessage).toBeInTheDocument()
    })

    test('Nif renders with value exists error', async () => {
      vi.mocked(checkVat).mockResolvedValue({
        data: { is_member: true },
      })

      const invalidNif = '12345678Z'
      await renderComponent(invalidNif)
      const errorMessage = await screen.findByText('DNI exists')
      expect(errorMessage).toBeInTheDocument()
    })

    test('Nif renders with person_type check to physic-person', async () => {
      vi.mocked(checkVat).mockResolvedValue({})
      const setValuesSpy = vi.fn()

      const validNif = '12345678Z'
      await renderComponent(validNif, setValuesSpy)
      await waitFor(() => {
        expect(setValuesSpy).toHaveBeenLastCalledWith(
          expect.objectContaining({
            owner: {
              nif: '12345678Z',
              nif_valid: true,
              person_type: 'physic-person',
            },
          })
        )
      })
    })

    test('Nif renders with person_type check to legal-person', async () => {
      vi.mocked(checkVat).mockResolvedValue({})
      const setValuesSpy = vi.fn()

      const validNif = 'P7784683J'
      await renderComponent(validNif, setValuesSpy)
      await waitFor(() => {
        expect(setValuesSpy).toHaveBeenLastCalledWith(
          expect.objectContaining({
            owner: {
              nif: 'P7784683J',
              nif_valid: true,
              person_type: 'legal-person',
            },
          })
        )
      })
    })

    test('Nif renders with nif invalid format', async () => {
      vi.mocked(checkVat).mockResolvedValue({})
      const setValuesSpy = vi.fn()

      const validNif = '12345678XX'
      await renderComponent(validNif, setValuesSpy)
      await waitFor(() => {
        expect(setValuesSpy).toHaveBeenLastCalledWith(
          expect.objectContaining({
            owner: {
              nif: '12345678XX',
              nif_valid: false,
              person_type: 'physic-person',
            },
          })
        )
      })
    })
  })
})
