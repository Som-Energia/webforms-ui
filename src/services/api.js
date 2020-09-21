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

export const checkIban = async (iban) => {
  return axios({
    method: 'GET',
    url: `${API_BASE_URL}check/iban/${iban}`
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

export const checkMemberVat = async (vat) => {
  return axios({
    method: 'GET',
    url: `${API_BASE_URL}check/vat/${vat}`
  })
    .then(response => {
      console.log(response)
      return response?.data
    })
}

export const checkMember = async (number, vat) => {
  return axios({
    method: 'GET',
    url: `${API_BASE_URL}data/soci/${number}/${vat}`
  })
    .then(response => {
      console.log(response)
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
      console.log(response)
      return response?.data
    })
}
