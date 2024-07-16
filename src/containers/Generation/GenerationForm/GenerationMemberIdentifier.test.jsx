import React from 'react'
import GenerationMemberIdentifier from './GenerationMemberIdentifier'
import {
  render,
  queryByAttribute,
  fireEvent,
  getByText
} from '@testing-library/react'
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom'

import { vi } from 'vitest';

vi.mock('react-i18next', () => require('../../../tests/__mocks__/i18n'));

describe('Generation Form Review', () => {
  const mockValues = {
    member: {
      is_member: true,
      has_generation_enabled_zone: true
    }
  }

  const mockValuesNotEnabledZone = {
    member: {
      is_member: true,
      has_generation_enabled_zone: false
    }
  }

  const mockEnabledZonneError = {
    member: {
      has_generation_enabled_zone: 'ENABLED_ZONE_ERROR'
    }
  }

  const getById = queryByAttribute.bind(null, 'id')
  const mockSetFieldValue = vi.fn()
  const mocksetFieldTouched = vi.fn()
  test('Should call setFieldValue when choose member', async () => {
    const dom = render(
      <GenerationMemberIdentifier
        resetForm={vi.fn()}
        setFieldValue={mockSetFieldValue}
      />
    )

    const memberButton = getById(dom.container, 'member_choose_yes')
    fireEvent.click(memberButton)
    expect(mockSetFieldValue).toHaveBeenCalledWith('member.is_member', true)
  })

  test('Should call setFieldValue when choose no member', async () => {
    const dom = render(
      <GenerationMemberIdentifier
        resetForm={vi.fn()}
        setFieldValue={mockSetFieldValue}
      />
    )

    const memberButton = getById(dom.container, 'member_choose_no')
    fireEvent.click(memberButton)
    expect(mockSetFieldValue).toHaveBeenCalledWith('member.is_member', false)
  })

  test('Should show warning text when zone is not enabled', async () => {
    const dom = render(
      <Router>
        <Routes>
          <Route
            exact
            path="/"
            element={
              <GenerationMemberIdentifier
                resetForm={vi.fn()}
                values={mockValuesNotEnabledZone}
                setFieldValue={mockSetFieldValue}
              />
            }
          />
        </Routes>
      </Router>
    )

    const infoNoEnabledZone = getById(dom.container, 'grid_not_enabled_zone')
    expect(
      getByText(
        infoNoEnabledZone,
        'GENERATION_FORM_INFO_ZONE_NOT_ENABLED_TITLE'
      )
    ).toBeInTheDocument()
  })

  test('Should show error when the call to check zone fails', async () => {
    const dom = render(
      <Router>
        <Routes>
          <Route
            exact
            path="/"
            element={
              <GenerationMemberIdentifier
                resetForm={vi.fn()}
                values={mockValues}
                setFieldValue={mockSetFieldValue}
                errors={mockEnabledZonneError}
              />
            }
          />
        </Routes>
      </Router>
    )

    const errorEnabledZone = getById(dom.container, 'grid_error_enabled_zone')
    expect(
      getByText(errorEnabledZone, 'GENERATION_FORM_DATA_COULD_NOT_BE_VALIDATED')
    ).toBeInTheDocument()
  })

  test('Should show the input to fill in the partner number if is member', async () => {
    const dom = render(
      <Router>
        <Routes>
          <Route
            exact
            path="/"
            element={
              <GenerationMemberIdentifier
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

    const GenerationMemberIdentifierInputBox = getById(
      dom.container,
      'box_member_identifier'
    )
    expect(
      getByText(
        GenerationMemberIdentifierInputBox,
        'CONTRIBUTION_MEMBER_INDENTIFIER'
      )
    ).toBeInTheDocument()
  })
})
