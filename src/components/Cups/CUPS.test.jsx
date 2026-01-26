import { ThemeProvider } from '@mui/material/styles'
import {
  queryByAttribute,
  render,
  screen,
  waitFor,
} from '@testing-library/react'
import { useState } from 'react'
import { vi } from 'vitest'
import { checkCups } from '../../services/api'
import WebFormsTheme from '../../themes/webforms'
import Cups from './CUPS'
import { initI18n } from '../../tests/i18n.mock'

// Mock the checkCups function
vi.mock('../../services/api', () => ({
  checkCups: vi.fn(),
}))

const webFormsTheme = WebFormsTheme()

const renderComponent = async (cupsNumber, setValues = () => {}) => {
  await initI18n({ ERROR_INVALID_FIELD: 'Invalid field' })

  return render(
    <CupsWrapperComponent
      cupsNumber={cupsNumber}
      setValues={setValues}
    />
  )
}

const CupsWrapperComponent = ({ cupsNumber, setValues }) => {
  // Error handling
  const [errors, setError] = useState({ cups: null })
  const setFieldError = (fieldName, error) => {
    setError({ [fieldName]: error })
  }

  return (
    <ThemeProvider theme={webFormsTheme}>
      <Cups
        values={{ cups: cupsNumber }}
        setValues={setValues}
        errors={errors}
        touched={{ cups: true }}
        setFieldError={setFieldError}
      />
    </ThemeProvider>
  )
}

describe('Cups component', () => {
  test('Cups renders without crashing', async () => {
    vi.mocked(checkCups).mockResolvedValue({})

    const cups = 'ES0021911991898060KS'
    const dom = await renderComponent(cups)

    await waitFor(() => {
      const getByDataCy = queryByAttribute.bind(null, 'data-cy')
      const input = getByDataCy(dom.container, 'cups-input')
      expect(input).toBeInTheDocument()
      expect(input).toHaveValue(cups)
    })
  })

  test('Cups renders showing invalid error message through checkCups rejection', async () => {
    vi.mocked(checkCups).mockRejectedValue({})
    const invalidCups = 'ES0000000000000000000'
    await renderComponent(invalidCups)
    const errorMessage = await screen.findByText('Invalid field')
    expect(errorMessage).toBeInTheDocument()
  })

  test('CheckCups with resolved inactive contract response', async () => {
    vi.mocked(checkCups).mockResolvedValue({
      data: {
        status: 'inactive',
        knowledge_of_distri: true,
        tariff_name: '2.0TD',
      },
    })
    const cups = 'ES0021911991898060KS'
    const setValuesSpy = vi.fn()
    await renderComponent(cups, setValuesSpy)

    await waitFor(() => {
      expect(setValuesSpy).toHaveBeenLastCalledWith(
        expect.objectContaining({
          new_contract: true,
          knowledge_of_distri: true,
          tariff_name: '2.0TD',
        })
      )
    })
  })

  test('CheckCups with resolved a new contract response', async () => {
    vi.mocked(checkCups).mockResolvedValue({
      data: {
        status: 'new',
        knowledge_of_distri: true,
        tariff_name: '2.0TD',
      },
    })
    const cups = 'ES0021911991898060KS'
    const setValuesSpy = vi.fn()
    await renderComponent(cups, setValuesSpy)

    await waitFor(() => {
      expect(setValuesSpy).toHaveBeenLastCalledWith(
        expect.objectContaining({
          new_contract: true,
          knowledge_of_distri: true,
          tariff_name: '2.0TD',
        })
      )
    })
  })

})
