export const allExtensionsError = {result:false,msg:"UPDATE_DIST_INVALID_FILETYPE"}
export const isTextError = {result:false,msg:"UPDATE_DIST_INVALID_TXT_FILETYPE"}

export const allExtensionsValidation = (fileName) => {
    let allowedExtensions = /(.jpg|.jpeg|.pdf)$/i;
    return allowedExtensions.test(fileName) ? {result:true} : allExtensionsError
}

export const isTextFile = (fileName) => {
    let allowedExtensions = /(.txt)$/i;
    return allowedExtensions.test(fileName) ? {result:true} : isTextError
}