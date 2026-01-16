import { ThemeProvider } from '@mui/material/styles'
import {
  queryByAttribute,
  render,
  screen,
  waitFor
} from '@testing-library/react'
import i18n from 'i18next'
import { useState } from 'react'
import { initReactI18next } from 'react-i18next'
import { vi } from 'vitest'
import { checkCups } from '../../services/api'
import WebFormsTheme from '../../themes/webforms'
import Cups from './CUPS'

// Mock the checkCups function
vi.mock('../../services/api', () => ({
  checkCups: vi.fn()
}))

const webFormsTheme = WebFormsTheme()
const initI18n = async () => {
  // Initialize i18n for the test
  return i18n.use(initReactI18next).init({
    lng: 'en',
    defaultNS: 'translationsNS',
    resources: {
      en: {
        translationsNS: {
          ERROR_INVALID_FIELD: 'Invalid field'
        }
      }
    },
    debug: false
  })
}

const renderComponent = async (cupsNumber) => {
  await initI18n()

  return render(<CupsWrapperComponent cupsNumber={cupsNumber} />)
}

const CupsWrapperComponent = ({ cupsNumber }) => {
  // Error handling
  const [errors, setError] = useState({ cups: null })
  const setFieldError = (fieldName, error) => {
    setError({ [fieldName]: error })
  }

  return (
    <ThemeProvider theme={webFormsTheme}>
      <Cups
        values={{ cups: cupsNumber }}
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

  test('Cups renders with invalid cups error message', async () => {
    vi.mocked(checkCups).mockRejectedValue({})
    const invalidCups = 'ES0000000000000000000'
    await renderComponent(invalidCups)
    const errorMessage = await screen.findByText('Invalid field')
    expect(errorMessage).toBeInTheDocument()
  })
})
