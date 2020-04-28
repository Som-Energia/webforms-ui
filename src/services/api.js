import axios from 'axios'

const API_URL = 'https://testapiv2.somenergia.coop:4433/'

export function modifyContract (data) {
  return axios({
    method: 'POST',
    url: `${API_URL}form/modificacio`,
    data: data
  })
    .then(response => {
      console.log('response log:', response)
      return response
    })
}
