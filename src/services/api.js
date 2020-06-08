import axios from 'axios'

const { API_BASE_URL } = window.config

export const modifyContract = async (data) => {
  return axios({
    method: 'POST',
    url: `${API_BASE_URL}form/modificacio`,
    data: data
  })
    .then(response => {
      return response?.data
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
    url: `${API_BASE_URL}form/upload_attachment`,
    data: data,
    config: config
  })
    .then(response => {
      return response?.data
    })
}

export const checkVat = async (vat) => {
  return axios({
    method: 'GET',
    url: `${API_BASE_URL}check/vat/exists/${vat}`
  })
    .then(response => {
      console.log(response)
      return response?.data
    })
}

export const checkCups = async (cups) => {
  return axios({
    method: 'GET',
    url: `${API_BASE_URL}check/cups/status/${cups}`
  })
    .then(response => {
      return response?.data
    })
}

export const getProvincies = async () => {
  return axios({
    method: 'GET',
    url: `${API_BASE_URL}data/provincies`
  })
    .then(response => {
      return response?.data
    })
}

export const getMunicipis = async (provincia) => {
  return axios({
    method: 'GET',
    url: `${API_BASE_URL}data/municipis/${provincia}`
  })
    .then(response => {
      return response?.data
    })
}
