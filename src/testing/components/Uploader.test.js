import Uploader from '../../components/Uploader'
import { I18nextProvider } from 'react-i18next'
import i18n from '../testing-configuration/i18nForTests'
import {
  fireEvent,
  render,
  screen,
  queryByAttribute,
  getByText
} from '@testing-library/react'
import axios from 'axios'
import MockAdapter from 'axios-mock-adapter'
import { act } from 'react-dom/test-utils'
import {
  allExtensionsValidation,
  isTextFile,
  allExtensionsError,
  isTextError
} from '../../validators/FileTypeValidator'

describe('Uploader', () => {
  const getById = queryByAttribute.bind(null, 'id')
  const txtFileName = 'filename.txt'
  const pdfFileName = 'filename.pdf'
  const uploaderId = 'uploader-id'
  const uploadUrl = 'url/mock'
  const fileHash = 'file-hash.txt'
  const defaultError = 'MODIFY_POTTAR_UNEXPECTED'
  const customError = 'HARRY_POTTAR_UNEXPECTED'
  const validTypeFiles = 'INSTALL_TYPE_ATTACHMENTS_INFO'
  const erroneousResponse = 'NOT_UPLOAD_OK'

  const BASE_URL = undefined
  let dom = {}
  const callBackFnMock = jest.fn()
  const mockPost = jest.spyOn(axios, 'post')

  mockPost.mockImplementation((url) => {
    return Promise.resolve({ data: 'HOLA' })
  })

  beforeEach(() => {
    dom = render(
      <I18nextProvider i18n={i18n}>
        <Uploader
          uploadUrl={uploadUrl}
          id={uploaderId}
          callbackFn={callBackFnMock}
        />
      </I18nextProvider>
    )
  })

  test('CallBack function is called when the component is rendered', () => {
    expect(callBackFnMock).toBeCalledTimes(1)
    expect(callBackFnMock).toBeCalledWith([])
  })

  test('CallBack function is called when change the input', async () => {
    const mock = new MockAdapter(axios)
    const response = { data: { code: 'UPLOAD_OK', file_hash: fileHash } }
    mock.onPost(BASE_URL + uploadUrl).reply(200, response)

    const inputComponent = getById(dom.container, 'uploader-id')

    await act(async () => {
      fireEvent.change(inputComponent, {
        target: { name: txtFileName, files: [txtFileName] }
      })
    })

    expect(callBackFnMock).toBeCalledWith([fileHash])
  })

  test('When the upload response is not UPLOAD_OK, show default error ', async () => {
    const mock = new MockAdapter(axios)
    const response = { data: { code: '' } }
    mock.onPost(BASE_URL + uploadUrl).reply(200, response)

    const inputComponent = getById(dom.container, 'uploader-id')

    await act(async () => {
      fireEvent.change(inputComponent, {
        target: { name: txtFileName, files: [txtFileName] }
      })
    })

    const errorMsg = getByText(dom.container, defaultError)
    expect(errorMsg).toBeInTheDocument()
  })

  test('When the upload response is not UPLOAD_OK, show response code ', async () => {
    const mock = new MockAdapter(axios)
    const response = { data: { code: 'NOT_UPLOAD_OK' } }
    mock.onPost(BASE_URL + uploadUrl).reply(200, response)

    const inputComponent = getById(dom.container, 'uploader-id')

    await act(async () => {
      fireEvent.change(inputComponent, {
        target: { name: txtFileName, files: [txtFileName] }
      })
    })

    const errorMsg = getByText(dom.container, erroneousResponse)
    expect(errorMsg).toBeInTheDocument()
  })

  test('When the upload response is an error, show default error', async () => {
    const mock = new MockAdapter(axios)
    const error = { data: { error: '' } }
    mock.onPost(BASE_URL + uploadUrl).reply(500, error)

    const inputComponent = getById(dom.container, 'uploader-id')

    await act(async () => {
      fireEvent.change(inputComponent, {
        target: { name: txtFileName, files: [txtFileName] }
      })
    })

    const errorMsg = getByText(dom.container, defaultError)
    expect(errorMsg).toBeInTheDocument()
  })

  test('When the upload response is an error, show custom error', async () => {
    const mock = new MockAdapter(axios)
    const error = { code: customError }
    mock.onPost(BASE_URL + uploadUrl).reply(500, error)

    const inputComponent = getById(dom.container, 'uploader-id')

    await act(async () => {
      fireEvent.change(inputComponent, {
        target: { name: txtFileName, files: [txtFileName] }
      })
    })

    const errorMsg = getByText(dom.container, customError)
    expect(errorMsg).toBeInTheDocument()
  })

  test('When validation function (allExtensionsValidation) fails', async () => {
    dom = render(
      <I18nextProvider i18n={i18n}>
        <Uploader
          uploadUrl={uploadUrl}
          id={uploaderId}
          callbackFn={callBackFnMock}
          validationFileFunction={allExtensionsValidation}
        />
      </I18nextProvider>
    )

    const inputComponent = getById(dom.container, 'uploader-id')

    await act(async () => {
      fireEvent.change(inputComponent, {
        target: { name: txtFileName, files: [txtFileName] }
      })
    })

    const errorMsg = getByText(dom.container, allExtensionsError.msg)
    expect(errorMsg).toBeInTheDocument()
  })

  test('When validation function (isTextFile) fails', async () => {
    dom = render(
      <I18nextProvider i18n={i18n}>
        <Uploader
          uploadUrl={uploadUrl}
          id={uploaderId}
          callbackFn={callBackFnMock}
          validationFileFunction={isTextFile}
        />
      </I18nextProvider>
    )

    const inputComponent = getById(dom.container, 'uploader-id')

    await act(async () => {
      fireEvent.change(inputComponent, {
        target: { name: pdfFileName, files: [pdfFileName] }
      })
    })

    const errorMsg = getByText(dom.container, isTextError.msg)
    expect(errorMsg).toBeInTheDocument()
  })

  test('Show validTypeFiles after click clean', async () => {
    dom = render(
      <I18nextProvider i18n={i18n}>
        <Uploader
          uploadUrl={uploadUrl}
          id={uploaderId}
          callbackFn={callBackFnMock}
          validTypeFiles={validTypeFiles}
          testingCustomError={customError}
        />
      </I18nextProvider>
    )

    const errorMsgBeforeClean = getByText(dom.container, customError)
    expect(errorMsgBeforeClean).toBeInTheDocument()

    const cleanIcon = getById(dom.container, 'clean-icon')
    await act(async () => {
      fireEvent.click(cleanIcon)
    })

    const errorMsgAfterClean = screen.queryByText(customError)
    expect(errorMsgAfterClean).toBeNull()

    const validTypeFilesText = getByText(dom.container, validTypeFiles)
    expect(validTypeFilesText).toBeInTheDocument()
  })

  test('Remove file from list after click delete', async () => {
    dom = render(
      <I18nextProvider i18n={i18n}>
        <Uploader
          uploadUrl={uploadUrl}
          id={uploaderId}
          callbackFn={callBackFnMock}
          values={[pdfFileName]}
        />
      </I18nextProvider>
    )
    const pdfFileBeforeDelete = getByText(dom.container, pdfFileName)
    expect(pdfFileBeforeDelete).toBeInTheDocument()

    const deleteIcon = getById(dom.container, 'delete-icon0')
    await act(async () => {
      fireEvent.click(deleteIcon)
    })

    const pdfFileAfterDelete = screen.queryByText(pdfFileName)
    expect(pdfFileAfterDelete).toBeNull()

  })

  test('Remove file from list after click delete', async () => {
    dom = render(
      <I18nextProvider i18n={i18n}>
        <Uploader
          uploadUrl={uploadUrl}
          id={uploaderId}
          callbackFn={callBackFnMock}
          fieldError={customError}
        />
      </I18nextProvider>
    )
    const fieldErrorText = getByText(dom.container, customError)
    expect(fieldErrorText).toBeInTheDocument()

  })

})
