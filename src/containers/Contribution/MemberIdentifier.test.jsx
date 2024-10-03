import React from 'react'
import MemberIdentifier from './MemberIdentifier'
import {
  render,
  queryByAttribute,
  fireEvent,
  getByText
} from '@testing-library/react'
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom'
import { vi } from 'vitest';


vi.mock('react-i18next', () => require('../../tests/__mocks__/i18n'));

describe('Member Identifier', () => {
  const mockValues = {
    member: {
      is_member: true
    }
  }

  const mockValuesNoMember = {
    member: {
      is_member: false,
      vat: ''
    }
  }

  const mockErrorsVat = {
    member: {
      vat: "VAT_HAS_AN_ERROR"
    }
  }

  const mockErrorsVatValid = {
    member: {
      vatvalid: "VAT IS NOT VALID"
    }
  }

  const mockErrorsMemberExists = {
    member: {
      exists: "MEMBER_ALREADY_EXISTS"
    }
  }

  const mockTouched = {
    member: {
      vat: true
    }
  }
  const VAT = '40323835M'
  const getById = queryByAttribute.bind(null, 'id')
  const mockSetFieldValue = vi.fn()
  const mocksetFieldTouched = vi.fn()
  const mockSetValues = vi.fn()
  test('Should call setFieldValue when choose member', async () => {
    const dom = render(
      <Router>
        <Routes>
          <Route
            exact
            path="/"
            element={
              <MemberIdentifier
                values={mockValues}
                resetForm={vi.fn()}
                setFieldValue={mockSetFieldValue}
              />
            }
          />
        </Routes>
      </Router>
    )

    const memberButton = getById(dom.container, 'member-choose-yes')
    fireEvent.click(memberButton)
    expect(mockSetFieldValue).toHaveBeenCalledWith('member.is_member', true)
  })

  test('Should call setFieldValue when choose no member', async () => {
    const dom = render(
      <Router>
        <Routes>
          <Route
            exact
            path="/"
            element={
              <MemberIdentifier
                values={mockValues}
                resetForm={vi.fn()}
                setFieldValue={mockSetFieldValue}
              />
            }
          />
        </Routes>
      </Router>
    )

    const memberButton = getById(dom.container, 'member-choose-no')
    fireEvent.click(memberButton)
    expect(mockSetFieldValue).toHaveBeenCalledWith('member.is_member', false)
  })

  test('Should call setFieldTouched when change the value of vat', async () => {
    const dom = render(
      <Router>
        <Routes>
          <Route
            exact
            path="/"
            element={<MemberIdentifier
              values={mockValuesNoMember}
              resetForm={vi.fn()}
              setFieldTouched={mocksetFieldTouched}
              setFieldValue={mockSetFieldValue}
              setValues={mockSetValues}
            />}
          />
        </Routes>
      </Router>
    )

    const vatTextField = getById(dom.container, 'vat')
    React.act(() => {
      fireEvent.change(vatTextField, { target: { value: VAT } })
    })
    expect(mocksetFieldTouched).toHaveBeenCalledWith('member.vat', true)
  })

  test('Should show the input to fill in the partner number if is member', async () => {
    const dom = render(
      <Router>
        <Routes>
          <Route
            exact
            path="/"
            element={
              <MemberIdentifier
                resetForm={vi.fn()}
                values={mockValues}
                setFieldTouched={mocksetFieldTouched}
                setFieldValue={mockSetFieldValue}
              />
            }
          />
        </Routes>
      </Router>
    )

    const memberIdentifierInputBox = getById(
      dom.container,
      'box_member_identifier'
    )
    expect(
      getByText(memberIdentifierInputBox, 'CONTRIBUTION_MEMBER_INDENTIFIER')
    ).toBeInTheDocument()
  })

  test('Should show the input to fill in the nif of the new person', async () => {

    const dom = render(
      <Router>
        <Routes>
          <Route
            exact
            path="/"
            element={
              <MemberIdentifier
                resetForm={vi.fn()}
                values={mockValuesNoMember}
                setFieldTouched={mocksetFieldTouched}
                setFieldValue={mockSetFieldValue}
                setValues={mockSetValues}
              />
            }
          />
        </Routes>
      </Router>
    )

    const newMemberInputBox = getById(
      dom.container,
      'box_no_member_identifier'
    )
    expect(
      getByText(newMemberInputBox, 'CONTRIBUTION_MEMBER_VAT')
    ).toBeInTheDocument()
  })

  test('Should show error if vat has an error', async () => {

    const dom = render(
      <Router>
        <Routes>
          <Route
            exact
            path="/"
            element={
              <MemberIdentifier
                resetForm={vi.fn()}
                values={mockValuesNoMember}
                setFieldTouched={mocksetFieldTouched}
                setFieldValue={mockSetFieldValue}
                setValues={mockSetValues}
                errors={mockErrorsVat}
                touched={mockTouched}
              />
            }
          />
        </Routes>
      </Router>
    )

    const newMemberVatInputBox = getById(
      dom.container,
      'box_no_member_vat_input'
    )
    expect(
      getByText(newMemberVatInputBox, mockErrorsVat.member.vat)
    ).toBeInTheDocument()
  })

  test('Should show error if vat is not valid', async () => {

    const mockValuesNoMemberVatNoValid = JSON.parse(JSON.stringify(mockValuesNoMember))
    mockValuesNoMemberVatNoValid.member.vatvalid=false

    const dom = render(
      <Router>
        <Routes>
          <Route
            exact
            path="/"
            element={
              <MemberIdentifier
                resetForm={vi.fn()}
                values={mockValuesNoMemberVatNoValid}
                setFieldTouched={mocksetFieldTouched}
                setFieldValue={mockSetFieldValue}
                setValues={mockSetValues}
                errors={mockErrorsVatValid}
                touched={mockTouched}
              />
            }
          />
        </Routes>
      </Router>
    )

    const newMemberVatInputBox = getById(
      dom.container,
      'box_no_member_vat_input'
    )
    expect(
      getByText(newMemberVatInputBox, mockErrorsVatValid.member.vatvalid)
    ).toBeInTheDocument()
  })

  test('Should show error when member vat already exists', async () => {

    const dom = render(
      <Router>
        <Routes>
          <Route
            exact
            path="/"
            element={
              <MemberIdentifier
                resetForm={vi.fn()}
                values={mockValuesNoMember}
                setFieldTouched={mocksetFieldTouched}
                setFieldValue={mockSetFieldValue}
                setValues={mockSetValues}
                errors={mockErrorsMemberExists}
                touched={mockTouched}
              />
            }
          />
        </Routes>
      </Router>
    )

    const newMemberVatInputBox = getById(
      dom.container,
      'box_no_member_vat_input'
    )
    expect(
      getByText(newMemberVatInputBox, mockErrorsMemberExists.member.exists)
    ).toBeInTheDocument()
  })
  
})
