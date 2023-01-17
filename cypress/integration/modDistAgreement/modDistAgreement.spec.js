/// <reference types="cypress" />

describe('Update distribution agreement form', () => {
  const filepathPng = 'mock_files/file-1.png'
  const filepathTxt = 'mock_files/file-2.txt'
  const pngFileName = 'file-1.png'
  const txtFileName = 'file-2.txt'
  const urlTxt = '/form/upload_txt_attachment/1'
  const urlAttachment = '/form/upload_attachment/0'
  const modAgreementUrl = '/procedures/distribution_agreement'

  Cypress.on('uncaught:exception', (error, runnable) => {
    console.error(error)
    return false
  })

  beforeEach(() => {
    cy.visit('/mod-distribution-agreement')
  })

  describe('Update the distribution agreement', function () {
    function uploadFile(fileName, url) {
      cy.intercept('POST', url, {
        data: { code: 'UPLOAD_OK', file_hash: fileName }
      }).as('uploadFile')

      cy.wait('@uploadFile').then((interception) => {
        assert.isNotNull(interception.response.body.data.code, 'UPLOAD_OK')
      })
    }

    it('Upload correct files', function () {
      cy.get('#type9-input-file').attachFile({
        filePath: filepathPng
      })

      uploadFile(pngFileName, urlAttachment)

      cy.get('#type12-input-file').attachFile({
        filePath: filepathTxt
      })

      uploadFile(txtFileName, urlTxt)

      cy.intercept('POST', modAgreementUrl, { data: { statusCode: 200 } })
      cy.get('#submit-button').click()
    })

    it('Upload only one file and accept', function () {
      cy.get('#type9-input-file').attachFile({
        filePath: filepathPng
      })

      uploadFile(pngFileName, urlAttachment)

      cy.intercept('POST', modAgreementUrl, { data: { statusCode: 200 } })
      cy.get('#submit-button').click()
      cy.get('#accept-button').click()
    })

    it('Upload only one file and decline', function () {
      cy.get('#type9-input-file').attachFile({
        filePath: filepathPng
      })

      uploadFile(pngFileName, urlAttachment)

      cy.intercept('POST', modAgreementUrl, { data: { statusCode: 200 } })
      cy.get('#submit-button').click()
      cy.get('#decline-button').click()

    })

    it('Upload without files and accept', function () {
      cy.intercept('POST', modAgreementUrl, { data: { statusCode: 200 } })
      cy.get('#submit-button').click()
      cy.get('#accept-button').click()
    })

    it('Upload without files and decline', function () {
      cy.intercept('POST', modAgreementUrl, { data: { statusCode: 200 } })
      cy.get('#submit-button').click()
      cy.get('#decline-button').click()
    })
  })
})
