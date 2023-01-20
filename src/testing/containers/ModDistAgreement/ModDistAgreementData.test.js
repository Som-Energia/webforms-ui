import {
  fireEvent,
  render,
  screen,
  queryByAttribute,
  act,
  getByText,
  findByText
} from '@testing-library/react'
import ModDistAgreementData from '../../../containers/ModDistAgreement/ModDistAgreementData'
import d1 from '../../mock_files/d1.json'
import { I18nextProvider } from 'react-i18next'
import i18n from '../../testing-configuration/i18nForTests'

describe('ModDistAgreement Translations CA', () => {
  const updateAttachmentMock = jest.fn()
  const handleSubmitButtonMock = jest.fn()
  const setDialogOpenMock = jest.fn()
  const handleSubmitMock = jest.fn()
  const getById = queryByAttribute.bind(null, 'id')
  let dom = {}
  const uploadFile = {
    lastModified: 1673949953537,
    name: 'file-2.txt',
    size: 5,
    type: 'text/plain',
    webkitRelativePath: ''
  }

  beforeEach(() => {
    dom = render(
      <I18nextProvider i18n={i18n}>
        <ModDistAgreementData
          data={d1}
          updateAttachment={updateAttachmentMock}
          handleSubmitButton={handleSubmitButtonMock}
          isDialogOpen={false}
        />
      </I18nextProvider>
    )
  })

  test('Is renderized properly', () => {
    //CHECKING THE TITLE
    const D1_TITLE = screen.getByText('DETAIL_D1_TITLE')
    expect(D1_TITLE).toBeInTheDocument()
    //CHECKING THE DESCRIPTION
    const AUTO_INTRO = screen.getByText('AUTO_PROCEDURE_INTRO')
    expect(AUTO_INTRO).toBeInTheDocument()
    //CHECKING THE INFO ABOUT THE DOCUMENTATION
    const AUTO_DOCS = screen.getByText('AUTO_PROCEDURE_DOCS')
    expect(AUTO_DOCS).toBeInTheDocument()
    //CHECKING THE TEXT OF THE DISTRIBUTION AGREEMENT INPUT
    const AUTO_AGRREEMENT_DIST_FILE = screen.getByText(
      'AUTO_AGRREEMENT_DIST_FILE'
    )
    expect(AUTO_AGRREEMENT_DIST_FILE).toBeInTheDocument()
    //CHECKING THE TEXT THAT EXPLAINS THE ALLOWED FORMATS FOR THE DISTRIBUTION AGREEMENT FILE
    const UPDATE_DIST_ALL_ATTACHMENTS_INFO = screen.getByText(
      'UPDATE_DIST_ALL_ATTACHMENTS_INFO'
    )
    expect(UPDATE_DIST_ALL_ATTACHMENTS_INFO).toBeInTheDocument()

    //CHECKING THE TEXT OF THE COEF OF DISTRIBUTION FILE
    const AUTO_COEF_DIST_FILE = screen.getByText('AUTO_COEF_DIST_FILE')
    expect(AUTO_COEF_DIST_FILE).toBeInTheDocument()

    //CHECKING THE TEXT THAT EXPLAINS THE ALLOWED FORMATS FOR THE COEF DISTRIBUTION FILE
    const INSTALL_TXT_TYPE_ATTACHMENTS_INFO = screen.getByText(
      'INSTALL_TXT_TYPE_ATTACHMENTS_INFO'
    )
    expect(INSTALL_TXT_TYPE_ATTACHMENTS_INFO).toBeInTheDocument()
    //CHECKING THE TEXT OF THE SUBMIT BUTTON
    const ENVIAR = screen.getByText('ENVIAR')
    expect(ENVIAR).toBeInTheDocument()

    //CHECKING THE INPUT OF TYPE 9 EXISTS
    const input9 = getById(dom.container, 'type9-input-file')
    expect(input9).toBeInTheDocument()

    //CHECKING THE INPUT OF TYPE 12 EXISTS
    const input12 = getById(dom.container, 'type12-input-file')
    expect(input12).toBeInTheDocument()

    //CHECKING THE SUCCESS COMPONENT NOT EXISTS
    const completedDesc = screen.queryByText('UPDATE_AUTO_AGREEMENT_OK_DESCRIPTION')
    expect(completedDesc).toBeNull()

    //CHECKING THE ERROR COMPONENT NOT EXISTS
    const errorComponent = getById(dom.container,'error-component')
    expect(errorComponent).toBeNull()

    //CHECKING THE LOADER COMPONENT NOT EXISTS
    const loaderComponent = getById(dom.container,'circular-progress')
    expect(loaderComponent).toBeNull()

  })

  test('The dialog is not renderized', () => {
    //CHECKING THE POP UP NOT EXISTS
    const dialog = screen.queryByText('EMPTY_ATTACHMENTS_WARN_TITLE')
    expect(dialog).toBeNull()
  })

  test('The dialog is renderized', () => {
    dom = render(
      <I18nextProvider i18n={i18n}>
        <ModDistAgreementData
          data={d1}
          updateAttachment={updateAttachmentMock}
          handleSubmitButton={handleSubmitButtonMock}
          isDialogOpen={true}
        />
      </I18nextProvider>
    )
    //CHECKING THE POP UP EXISTS
    const dialog = screen.queryByText('EMPTY_ATTACHMENTS_WARN_TITLE')
    expect(dialog).toBeInTheDocument()
  })

  test('When click submit button handleSubmitButton is called', () => {
    //CHECKING THE INPUT OF TYPE 9 EXISTS
    const submitButton = getById(dom.container, 'submit-button')
    submitButton.click()
    expect(handleSubmitButtonMock).toBeCalledTimes(1)
  })

  test('', () => {
    //CHECKING THE INPUT OF TYPE 9 EXISTS
    const submitButton = getById(dom.container, 'submit-button')
    submitButton.click()
    expect(handleSubmitButtonMock).toBeCalledTimes(1)
  })

  test('The dialog is renderized and click Accept', () => {
    const dom = render(
      <I18nextProvider i18n={i18n}>
        <ModDistAgreementData
          data={d1}
          updateAttachment={updateAttachmentMock}
          handleSubmitButton={handleSubmitButtonMock}
          isDialogOpen={true}
          setDialogOpen={setDialogOpenMock}
          handleSubmit={handleSubmitMock}
        />
      </I18nextProvider>
    )
    
    const popupAcceptButton = screen.getByText('I_ACCEPT')
    fireEvent.click(popupAcceptButton)
    expect(setDialogOpenMock).toBeCalledWith(false)
    expect(handleSubmitMock).toBeCalledTimes(1)
    
  })

  test('The dialog is renderized and click Decline', () => {
    const dom = render(
      <I18nextProvider i18n={i18n}>
        <ModDistAgreementData
          data={d1}
          updateAttachment={updateAttachmentMock}
          handleSubmitButton={handleSubmitButtonMock}
          isDialogOpen={true}
          setDialogOpen={setDialogOpenMock}
          handleSubmit={handleSubmitMock}
        />
      </I18nextProvider>
    )
    
    const popupAcceptButton = screen.getByText('I_DECLINE')
    fireEvent.click(popupAcceptButton)
    expect(setDialogOpenMock).toBeCalledWith(false)    
  })

  test('Appear the text that says us the process is completed', () => {
    const dom = render(
      <I18nextProvider i18n={i18n}>
        <ModDistAgreementData
          data={d1}
          updateAttachment={updateAttachmentMock}
          handleSubmitButton={handleSubmitButtonMock}
          isDialogOpen={true}
          setDialogOpen={setDialogOpenMock}
          handleSubmit={handleSubmitMock}
          completed={true}
        />
      </I18nextProvider>
    )
    
    const completedDesc = screen.getByText('UPDATE_AUTO_AGREEMENT_OK_DESCRIPTION')
    expect(completedDesc).toBeInTheDocument()

  })

  test('There is an Error', () => {
    const dom = render(
      <I18nextProvider i18n={i18n}>
        <ModDistAgreementData
          data={d1}
          updateAttachment={updateAttachmentMock}
          handleSubmitButton={handleSubmitButtonMock}
          isDialogOpen={true}
          setDialogOpen={setDialogOpenMock}
          handleSubmit={handleSubmitMock}
          error={'ERROR_MESSAGE'}
        />
      </I18nextProvider>
    )
    
    const errorComponent = getById(dom.container,'error-component')
    expect(errorComponent).toBeInTheDocument()
    const errorMessage = screen.getByText('ERROR_MESSAGE')
    expect(errorMessage).toBeInTheDocument()

  })

  test('Show loader when is sending data', () => {
    const dom = render(
      <I18nextProvider i18n={i18n}>
        <ModDistAgreementData
          data={d1}
          updateAttachment={updateAttachmentMock}
          handleSubmitButton={handleSubmitButtonMock}
          isDialogOpen={true}
          setDialogOpen={setDialogOpenMock}
          handleSubmit={handleSubmitMock}
          isSendingData={true}
        />
      </I18nextProvider>
    )
    
    const loaderComponent = getById(dom.container,'circular-progress')
    expect(loaderComponent).toBeInTheDocument()

  })

})
