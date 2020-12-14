import axios from 'axios'

const API_BASE_URL = window?.config?.API_BASE_URL

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

let cancelTokenVat

export const checkVat = async (vat) => {
  if (typeof cancelTokenVat !== typeof undefined) {
    cancelTokenVat.cancel('Operation canceled due to new request')
  }

  // Save the cancel token for the current request
  cancelTokenVat = axios.CancelToken.source()

  return axios({
    method: 'GET',
    url: `${API_BASE_URL}check/vat/exists/${vat}`,
    cancelToken: cancelTokenVat.token
  })
    .then(response => {
      return response?.data
    })
}

let cancelTokenCups

export const checkCups = async (cups) => {
  if (typeof cancelTokenCups !== typeof undefined) {
    cancelTokenCups.cancel('Operation canceled due to new request')
  }

  // Save the cancel token for the current request
  cancelTokenCups = axios.CancelToken.source()

  return axios({
    method: 'GET',
    url: `${API_BASE_URL}check/cups/status/${cups}`,
    cancelToken: cancelTokenCups.token
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

let cancelTokenIban

export const checkIban = async (iban) => {
  if (typeof cancelTokenIban !== typeof undefined) {
    cancelTokenIban.cancel('Operation canceled due to new request')
  }

  // Save the cancel token for the current request
  cancelTokenIban = axios.CancelToken.source()

  return axios({
    method: 'GET',
    url: `${API_BASE_URL}check/iban/${iban}`,
    cancelToken: cancelTokenIban.token
  })
    .then(response => {
      return response?.data
    })
}

export const holderChange = async (data) => {
  return axios({
    method: 'POST',
    url: `${API_BASE_URL}form/holderchange`,
    data: data
  })
    .then(response => {
      return response?.data
    })
}

export const getRates = (data) => {
  const rates = {
    '2.0A': {
      num_power_periods: 1,
      min_power: { power: 0, num_periods_apply: 1 },
      max_power: { power: 10, num_periods_apply: 1 }
    },
    '2.0DHA': {
      num_power_periods: 1,
      min_power: { power: 0, num_periods_apply: 1 },
      max_power: { power: 10, num_periods_apply: 1 }
    },
    '2.0DHS': {
      num_power_periods: 1,
      min_power: { power: 0, num_periods_apply: 1 },
      max_power: { power: 10, num_periods_apply: 1 }
    },
    '2.1A': {
      num_power_periods: 1,
      min_power: { power: 10.001, num_periods_apply: 1 },
      max_power: { power: 15, num_periods_apply: 1 }
    },
    '2.1DHA': {
      num_power_periods: 1,
      min_power: { power: 10.001, num_periods_apply: 1 },
      max_power: { power: 15, num_periods_apply: 1 }
    },
    '2.1DHS': {
      num_power_periods: 1,
      min_power: { power: 10.001, num_periods_apply: 1 },
      max_power: { power: 15, num_periods_apply: 1 }
    },
    '3.0A': {
      num_power_periods: 3,
      min_power: { power: 15.001, num_periods_apply: 1 },
      max_power: { power: 500, num_periods_apply: 3 }
    }
  }

  return rates
}

let cancelTokenMemberVat

export const checkMemberVat = async (vat) => {
  if (typeof cancelTokenMemberVat !== typeof undefined) {
    cancelTokenMemberVat.cancel('Operation canceled due to new request')
  }

  cancelTokenMemberVat = axios.CancelToken.source()

  return axios({
    method: 'GET',
    url: `${API_BASE_URL}check/vat/${vat}`,
    cancelToken: cancelTokenMemberVat.token
  })
    .then(response => {
      return response?.data
    })
}

let cancelTokenMember

export const checkMember = async (number, vat) => {
  if (typeof cancelTokenMember !== typeof undefined) {
    cancelTokenMember.cancel('Operation canceled due to new request')
  }

  cancelTokenMember = axios.CancelToken.source()

  return axios({
    method: 'GET',
    url: `${API_BASE_URL}data/soci/${number}/${vat}`,
    cancelToken: cancelTokenMember.token
  })
    .then(response => {
      return response?.data
    })
}

export const getPrices = async (tariff, vat, cnae, city_id) => {
  return axios({
    method: 'GET',
    url: `${API_BASE_URL}data/prices?tariff=${tariff}&vat=${vat}&cnae=${cnae}&city_id=${city_id}`
  })
    .then(response => {
      return response?.data
    })
}

export const contract = async (data) => {
  var formData = new FormData()
  for (var key in data) {
    formData.append(key, data[key])
  }

  return axios({
    method: 'POST',
    url: `${API_BASE_URL}form/contractacio`,
    data: formData
  })
    .then(response => {
      return response?.data
    })
}

export const confirmD1Case = async (data, case_id, token) => {
  return axios({
    method: 'POST',
    url: `${API_BASE_URL}form/confirm_d1/${case_id}`,
    headers: { Authorization: token },
    data: data
  })
    .then(response => {
      return response?.data
    })
}

export const member = async (data) => {
  var formData = new FormData()
  for (var key in data) {
    formData.append(key, data[key])
  }

  return axios({
    method: 'POST',
    url: `${API_BASE_URL}form/soci/alta`,
    data: formData
  })
    .then(response => {
      return response?.data
    })
}

export const memberPayment = async (data) => {
  var formData = new FormData()
  for (var key in data) {
    formData.append(key, data[key])
  }

  return axios({
    method: 'POST',
    url: `${API_BASE_URL}pagament/redirectiondata`,
    data: formData
  })
    .then(response => {
      return response?.data
    })
}

export const apiStatus = async () => {
  return axios({
    method: 'GET',
    url: `${API_BASE_URL}ping`
  })
}
