import axios from 'axios'

const API_URL = 'https://testapiv2.somenergia.coop:4433/'

export const modifyContract = async (data) => {
  return axios({
    method: 'POST',
    url: `${API_URL}form/modificacio`,
    data: data
  })
    .then(response => {
      return response?.data
    }).catch(error => {
      throw new TypeError(error)
    })
}

export const uploadFile = async (name, file) => {
  const data = new FormData()
  data.append('field', name)
  data.append('uploaded_file', file)
  data.append('context', '')

  const config = {
    onUploadProgress: (progressEvent) => {
      const { loaded, total } = progressEvent
      const percentCompleted = Math.round((loaded * 100) / total)
      console.log(percentCompleted, '%')
    }
  }

  return axios({
    method: 'POST',
    url: `${API_URL}form/upload_attachment`,
    data: data,
    config: config
  })
    .then(response => {
      return response?.data
    })
}
