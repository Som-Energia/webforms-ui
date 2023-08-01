import React from 'react'
import GenerationContributionForm from './GenerationContributionForm'
import {
  render,
  queryByAttribute,
  fireEvent,
  getByText
} from '@testing-library/react'

import { act } from 'react-dom/test-utils'

jest.mock('react-i18next', () => ({
  // this mock makes sure any components using the translate hook can use it without a warning being shown
  useTranslation: () => {
    return {
      t: (str) => str,
      i18n: {
        changeLanguage: () => new Promise(() => {})
      }
    }
  }
}))

describe('Generation Form Contribution', () => {
  const mockSetFieldValue = jest.fn()
  const valueStructure = {
    member: {
      is_member: true,
      number: '',
      vat: '',
      checked: false,
      full_name: '',
      proxynif: '',
      proxyname: '',
      name: '',
      address: '',
      postal_code: '',
      state: { id: '' },
      city: { id: '' },
      surname1: '',
      surname2: '',
      email: '',
      email2: '',
      phone1: '',
      phone2: '',
      language: 'ca'
    },
    payment: {
      amount: '',
      iban: '',
      payment_method: 'iban',
      sepa_accepted: false
    },
    number_of_actions: 0,
    annual_use: 0,
    privacy_policy_accepted: false,
    percent_over_annual_use: 0
  }

  const errorStructure = {
    member: {
      is_member: false,
      number: false,
      vat: false,
      checked: false,
      full_name: false,
      proxynif: false,
      proxyname: false,
      name: false,
      address: false,
      postal_code: false,
      state: false,
      city: false,
      surname1: false,
      surname2: false,
      email: false,
      email2: false,
      phone1: false,
      phone2: false,
      language: false
    },
    payment: {
      amount: false,
      iban: false,
      payment_method: false,
      sepa_accepted: false
    },
    number_of_actions: false,
    annual_use: false,
    privacy_policy_accepted: false,
    percent_over_annual_use: false
  }

  const errors = JSON.parse(JSON.stringify(errorStructure))
  const mockValues = JSON.parse(JSON.stringify(valueStructure))
  const getById = queryByAttribute.bind(null, 'id')

  test('Should call setFieldValue when ad annual use', () => {
    const dom = render(
      <GenerationContributionForm
        values={mockValues}
        errors={errors}
        setFieldValue={mockSetFieldValue}
      />
    )

    const annualUseTextField = getById(dom.container, 'annual_use')
    fireEvent.change(annualUseTextField, { target: { value: 2500 } })
    expect(mockSetFieldValue).toHaveBeenCalledWith('annual_use', '2500')
  })

  test('Should add action when click the button to add an action', () => {
    const dom = render(
      <GenerationContributionForm
        values={mockValues}
        errors={errors}
        setFieldValue={mockSetFieldValue}
      />
    )

    const addActionButton = getById(dom.container, 'add_action')
    fireEvent.click(addActionButton)
    expect(mockSetFieldValue).toHaveBeenCalledWith('number_of_actions', 1)
  })

  test('Should remove action when click the button to remove an action', () => {
    const mockWithActions = JSON.parse(JSON.stringify(mockValues))
    mockWithActions.number_of_actions = 3
    const dom = render(
      <GenerationContributionForm
        values={mockWithActions}
        errors={errors}
        setFieldValue={mockSetFieldValue}
      />
    )

    const removeActionButton = getById(dom.container, 'remove_action')
    fireEvent.click(removeActionButton)
    expect(mockSetFieldValue).toHaveBeenCalledWith('number_of_actions', 2)
  })

  test('Should not allow to add an action when click the button to add an action and there is the maximum number of actions', () => {
    const mockWithActions = JSON.parse(JSON.stringify(mockValues))
    mockWithActions.number_of_actions = 49
    const dom = render(
      <GenerationContributionForm
        values={mockWithActions}
        errors={errors}
        setFieldValue={mockSetFieldValue}
      />
    )

    const addActionButton = getById(dom.container, 'add_action')
    fireEvent.click(addActionButton)
    expect(mockSetFieldValue).not.toHaveBeenCalledWith('number_of_actions', 50)
  })

  test('Should not allow to remove an action when click the button to remove an action and there is the minimum number of actions', () => {
    const mockWithActions = JSON.parse(JSON.stringify(mockValues))
    mockWithActions.number_of_actions = 1
    const dom = render(
      <GenerationContributionForm
        values={mockWithActions}
        errors={errors}
        setFieldValue={mockSetFieldValue}
      />
    )

    const removeActionButton = getById(dom.container, 'remove_action')
    fireEvent.click(removeActionButton)
    expect(mockSetFieldValue).not.toHaveBeenCalledWith('number_of_actions', 0)
  })

  test('Should change IBAN', () => {
    const mockWithActions = JSON.parse(JSON.stringify(mockValues))
    mockWithActions.number_of_actions = 3
    const dom = render(
      <GenerationContributionForm
        values={mockWithActions}
        errors={errors}
        setFieldValue={mockSetFieldValue}
      />
    )
    const IBAN = 'ES18 9999 0000 9999 0000 9999'
    const ibanTextField = getById(dom.container, 'iban')
    act(() => {
      fireEvent.change(ibanTextField, { target: { value: IBAN } })
    })
    expect(mockSetFieldValue).toHaveBeenCalledWith('payment.iban', IBAN, false)
  })

  test('Should show error when percent use has erroneous value', () => {
    const mockPercentValues = JSON.parse(JSON.stringify(mockValues))
    mockPercentValues.percent_over_annual_use = Infinity

    const dom = render(
      <GenerationContributionForm
        values={mockPercentValues}
        errors={errors}
        setFieldValue={mockSetFieldValue}
      />
    )

    const percentValue = getById(dom.container, 'percent_value')
    expect(getByText(percentValue, '% Erròni')).toBeInTheDocument()
  })

  test('Should show IBAN helper text', () => {
    
    const dom = render(
      <GenerationContributionForm
        values={mockValues}
        errors={errors}
        setFieldValue={mockSetFieldValue}
      />
    )

    const ibanTextField = getById(dom.container, 'box_iban_input')
    expect(getByText(ibanTextField, 'IBAN_HELP')).toBeInTheDocument()
  })

  test('Should show IBAN error text, when Iban is touched and has an error', () => {
    const mockErrMsg = "IBAN has an error"
    const mockErrors = JSON.parse(JSON.stringify(errors))
    mockErrors.payment.iban = mockErrMsg
    const dom = render(
      <GenerationContributionForm
        values={mockValues}
        errors={mockErrors}
        touched={{payment:{iban:true}}}
        setFieldValue={mockSetFieldValue}
      />
    )

    const ibanTextField = getById(dom.container, 'box_iban_input')
    expect(getByText(ibanTextField, mockErrMsg)).toBeInTheDocument()
  })


  test('Should show IBAN error text, when Iban is not valid', () => {
    const mockErrMsg = "IBAN is not valid"
    const mockErrors = JSON.parse(JSON.stringify(errors))
    mockErrors.payment.iban_valid = mockErrMsg
    const dom = render(
      <GenerationContributionForm
        values={mockValues}
        errors={mockErrors}
        touched={{payment:{iban:true}}}
        setFieldValue={mockSetFieldValue}
      />
    )

    const ibanTextField = getById(dom.container, 'box_iban_input')
    expect(getByText(ibanTextField, mockErrMsg)).toBeInTheDocument()
  })

  test('Should show percent use error text, when has an error', () => {
    const mockErrMsg = "percent use is not valid"
    const mockErrors = JSON.parse(JSON.stringify(errors))
    mockErrors.percent_over_annual_use = mockErrMsg
    const dom = render(
      <GenerationContributionForm
        values={mockValues}
        errors={mockErrors}
        touched={{payment:{iban:true}}}
        setFieldValue={mockSetFieldValue}
      />
    )

    const ibanTextField = getById(dom.container, 'box_percent_use')
    expect(getByText(ibanTextField, mockErrMsg)).toBeInTheDocument()
  })

  test('Should show annual use helper text', () => {
    
    const dom = render(
      <GenerationContributionForm
        values={mockValues}
        errors={errors}
        setFieldValue={mockSetFieldValue}
      />
    )

    const ibanTextField = getById(dom.container, 'box_annual_use')
    expect(getByText(ibanTextField, "GENERATION_FORM_ANNUAL_USE_INPUT_HELP_TEXT")).toBeInTheDocument()
  })

  test('Should show annual use error text, when has an error', () => {
    const mockErrMsg = "annual use is not valid"
    const mockErrors = JSON.parse(JSON.stringify(errors))
    mockErrors.annual_use = mockErrMsg
    const dom = render(
      <GenerationContributionForm
        values={mockValues}
        errors={mockErrors}
        touched={{annual_use:true}}
        setFieldValue={mockSetFieldValue}
      />
    )

    const ibanTextField = getById(dom.container, 'box_annual_use')
    expect(getByText(ibanTextField, mockErrMsg)).toBeInTheDocument()
  })

})
