import {allExtensionsValidation, isTextFile, allExtensionsError, isTextError} from '../../validators/FileTypeValidator'

  
  describe('File Type Validator', () => {
 
    const pdfFileName = 'pdffile.pdf'
    const jpgFileName = 'jpgfile.jpg'
    const jpegFileName = 'jpegfile.jpeg'
    const txtFileName = 'txtfile.txt'

    test('Check all extensions validation with pdf file, should be true', () => {
        let validationResult = allExtensionsValidation(pdfFileName)
        expect(validationResult).toBeTruthy()
    })

    test('Check all extensions validation with jpg file, should be true', () => {
        let validationResult = allExtensionsValidation(jpgFileName)
        expect(validationResult).toBeTruthy()
    })

    test('Check all extensions validation with jpeg file, should be true', () => {
        let validationResult = allExtensionsValidation(jpegFileName)
        expect(validationResult).toBeTruthy()
    })

    test('Check all extensions validation with txt file, should be Error', () => {
        let validationResult = allExtensionsValidation(txtFileName)
        expect(validationResult).toBe(allExtensionsError)
    })  

    test('Check all extensions validation with txt file, should be true', () => {
        let validationResult = isTextFile(txtFileName)
        expect(validationResult).toBeTruthy()
    })

    test('Check all extensions validation with pdf file, should be Error', () => {
        let validationResult = isTextFile(pdfFileName)
        expect(validationResult).toBe(isTextError)
    }) 

  })
  