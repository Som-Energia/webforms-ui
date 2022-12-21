export const allExtensionsValidation = (fileName) => {
    let allowedExtensions = /(.jpg|.jpeg|.pdf|.txt)$/i;
    return allowedExtensions.test(fileName)
}

export const isTextFile = (fileName) => {
    let allowedExtensions = /(.txt)$/i;
    return allowedExtensions.test(fileName)
}