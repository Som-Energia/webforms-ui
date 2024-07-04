import {
  screen,
  render,
  queryByAttribute,
  fireEvent
} from '@testing-library/react'
import PopUpContext, { PopUpContextProvider } from './PopUpContext'
import React, { useContext } from 'react'
import { Button } from '@mui/material'
import { act } from 'react-dom/test-utils'

const ContextConsumer = () => {
  const { setContent } = useContext(PopUpContext)
  return (
    <>
      <Button
        id={'set-content-btn'}
        onClick={() => setContent(<div id="content-div">DIALOG CONTENT</div>)}
      />
    </>
  )
}

jest.mock('react-i18next', () => ({
  useTranslation: () => {
    return {
      t: (str) => str,
      i18n: {
        changeLanguage: () => new Promise(() => {})
      }
    }
  }
}))

describe('PopUp Context', () => {
  const getById = queryByAttribute.bind(null, 'id')
  test('Should show the content passed by setContent inside the CustomDialog', async () => {
    const dom = render(
      <PopUpContextProvider>
        <ContextConsumer />
      </PopUpContextProvider>
    )
    const buttonElement = getById(dom.container, 'set-content-btn')
    const contentElement = getById(dom.container, 'content-div')
    expect(contentElement).toBeNull()
    act(() => {
      fireEvent.click(buttonElement)
    })
    const contentElementA = await screen.findByText('DIALOG CONTENT')
    expect(contentElementA).toBeInTheDocument()
  })
})
