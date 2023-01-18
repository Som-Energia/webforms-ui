export const allExtensionsValidation = (fileName) => {
    let allowedExtensions = /(.jpg|.jpeg|.pdf)$/i;
    return allowedExtensions.test(fileName) ? {result:true} : {result:false,msg:"UPDATE_DIST_INVALID_FILETYPE"}
}

export const isTextFile = (fileName) => {
    let allowedExtensions = /(.txt)$/i;
    return allowedExtensions.test(fileName) ? {result:true} : {result:false,msg:"UPDATE_DIST_INVALID_TXT_FILETYPE"}
}