import axios from 'axios'
import postalCode2Ine from '../data/zip-ine.json'
import dayjs from 'dayjs'

const WEBFORMS_API_URL = document.getElementById('root')?.dataset?.webformsApiUrl
  ?? import.meta.env.VITE_WEBFORMS_API_URL ?? null // For tests

export const modifyContract = async (data, token) => {
  return axios({
    method: 'POST',
    url: `${WEBFORMS_API_URL}/procedures/contract_modification`,
    headers: {
      Authorization: token
    },
    data: data
  }).then((response) => {
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
    url: `${WEBFORMS_API_URL}/form/upload_attachment`,
    data: data,
    config: config
  }).then((response) => {
    return response?.data
  })
}

let cancelTokenVat

export const checkVat = async (vat) => {
  if (typeof cancelTokenVat !== typeof undefined) {
    cancelTokenVat.cancel('Operation canceled due to new request')
  }

  cancelTokenVat = axios.CancelToken.source()

  return axios({
    method: 'GET',
    url: `${WEBFORMS_API_URL}/check/vat/exists/${vat}`,
    cancelToken: cancelTokenVat.token
  }).then((response) => {
    return response?.data
  })
}

let cancelTokenCups

export const checkCups = async (cups) => {
  if (typeof cancelTokenCups !== typeof undefined) {
    cancelTokenCups.cancel('Operation canceled due to new request')
  }

  cancelTokenCups = axios.CancelToken.source()

  return axios({
    method: 'GET',
    url: `${WEBFORMS_API_URL}/check/cups/status/${cups}`,
    cancelToken: cancelTokenCups.token
  }).then((response) => {
    return response?.data
  })
}

let cancelTokenCnae

export const checkCnae = async (cnae) => {
  if (typeof cancelTokenCnae !== typeof undefined) {
    cancelTokenCnae.cancel('Operation canceled due to new request')
  }

  cancelTokenCnae = axios.CancelToken.source()

  return axios({
    method: 'GET',
    url: `${WEBFORMS_API_URL}/check/cnae/${cnae}`,
    cancelToken: cancelTokenCnae.token
  }).then((response) => {
    return response?.data
  })
}

export const getProvincies = async () => {
  return axios({
    method: 'GET',
    url: `${WEBFORMS_API_URL}/data/provincies`
  }).then((response) => {
    return response?.data
  })
}

export const getMunicipis = async (provincia) => {
  return axios({
    method: 'GET',
    url: `${WEBFORMS_API_URL}/data/municipis/${provincia}`
  }).then((response) => {
    return response?.data
  })
}

let cancelTokenHolidays

export const getNationalHolidays = async (firstdate, seconddate) => {
  if (typeof cancelTokenHolidays !== typeof undefined) {
    cancelTokenHolidays.cancel('Operation canceled due to new request')
  }

  cancelTokenHolidays = axios.CancelToken.source()

  const from = dayjs(firstdate).format('YYYY-MM-DD')
  const to = dayjs(seconddate).format('YYYY-MM-DD')

  return axios({
    method: 'GET',
    url: `${WEBFORMS_API_URL}/data/marketholidays?from=${from}&to=${to}`,
    cancelToken: cancelTokenHolidays.token
  }).then((response) => {
    return response?.data
  })
}

let cancelTokenIban

export const checkIban = async (iban) => {
  if (typeof cancelTokenIban !== typeof undefined) {
    cancelTokenIban.cancel('Operation canceled due to new request')
  }

  cancelTokenIban = axios.CancelToken.source()

  return axios({
    method: 'GET',
    url: `${WEBFORMS_API_URL}/check/iban/${iban}`,
    cancelToken: cancelTokenIban.token
  }).then((response) => {
    return response?.data
  })
}

let cancelTokenCadastralReference

export const checkCadastralReference = async (cadastralReference) => {
  if (typeof cancelTokenCadastralReference !== typeof undefined) {
    cancelTokenCadastralReference.cancel('Operation canceled due to new request')
  }

  cancelTokenCadastralReference = axios.CancelToken.source()

  return axios({
    method: 'GET',
    url: `${WEBFORMS_API_URL}/check/cadastral_reference/${cadastralReference}`,
    cancelToken: cancelTokenCadastralReference.token
  }).then((response) => {
    return response?.data
  })
}


export const holderChange = async (data) => {
  return axios({
    method: 'POST',
    url: `${WEBFORMS_API_URL}/form/holderchange`,
    data: data
  }).then((response) => {
    return response?.data
  })
}

export const getRates = (data) => {
  const rates = {
    '2.0TD': {
      num_power_periods: 2,
      min_power: { power: 0.1, num_periods_apply: 2 },
      max_power: { power: 15, num_periods_apply: 2 },
      increasing: false
    },
    '3.0TD': {
      num_power_periods: 6,
      min_power: { power: 15.001, num_periods_apply: 1 },
      max_power: { power: 450, num_periods_apply: 6 },
      increasing: true
    }
  }

  return rates
}

export const getNewRates = (data) => {
  const rates = {
    'power-lower-15kw': {
      num_power_periods: 2,
      min_power: { power: 0.1, num_periods_apply: 2 },
      max_power: { power: 15, num_periods_apply: 2 },
      increasing: false
    },
    'power-higher-15kw': {
      num_power_periods: 6,
      min_power: { power: 15.001, num_periods_apply: 1 },
      max_power: { power: 450, num_periods_apply: 6 },
      increasing: true
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
    url: `${WEBFORMS_API_URL}/check/vat/${vat}`,
    cancelToken: cancelTokenMemberVat.token
  }).then((response) => {
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
    url: `${WEBFORMS_API_URL}/check/soci/${number}/${vat}`,
    cancelToken: cancelTokenMember.token
  }).then((response) => {
    return response?.data
  })
}

const VAT = '58291270R'
const CNAE = '9820'

export const getPrices = async ({
  tariff,
  max_power,
  vat = VAT,
  cnae = CNAE,
  city_id
}) => {
  return axios({
    method: 'GET',
    url: `${WEBFORMS_API_URL}/data/prices`,
    params: {
      tariff,
      max_power,
      vat,
      cnae,
      city_id,
    }
  }).then((response) => {
    return response?.data
  })
}

export const contract = async (data) => {
  return axios({
    method: 'POST',
    url: `${WEBFORMS_API_URL}/procedures/contract`,
    data: data
  }).then((response) => {
    return response?.data
  })
}

export const newContract = async (data) => {
  return axios({
    method: 'POST',
    url: `${WEBFORMS_API_URL}/procedures/contract__WM`,
    data: data
  }).then((response) => {
    return response?.data
  })
}

export const modify_tariff = async (data) => {
  return axios({
    method: 'POST',
    url: `${WEBFORMS_API_URL}/procedures/contract_indexed`,
    headers: { Authorization: data.token },
    data: data
  }).then((response) => {
    return response?.data
  })
}

export const can_modify_tariff = async (token) => {
  return axios({
    method: 'GET',
    url: `${WEBFORMS_API_URL}/procedures/can_turn_contract_indexed`,
    headers: { Authorization: token }
  }).then((response) => response?.data)
}

export const confirmD1Case = async (data, case_id, token) => {
  return axios({
    method: 'POST',
    url: `${WEBFORMS_API_URL}/procedures/d1_confirmation/${case_id}`,
    headers: { Authorization: token },
    data: data
  }).then((response) => {
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
    url: `${WEBFORMS_API_URL}/form/soci/alta`,
    data: formData
  }).then((response) => {
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
    url: `${WEBFORMS_API_URL}/pagament/redirectiondata`,
    data: formData
  }).then((response) => {
    return response?.data
  })
}

export const apiStatus = async () => {
  return axios({
    method: 'GET',
    url: `${WEBFORMS_API_URL}/ping`
  })
}

export const getSelfConsumptionSituations = async () => {
  return axios({
    method: 'GET',
    url: `${WEBFORMS_API_URL}/data/installation_types`
  }).then((response) => {
    return response?.data
  })
}

export const getSelfConsumptionTechnologies = async () => {
  return axios({
    method: 'GET',
    url: `${WEBFORMS_API_URL}/data/generator_technologies`
  }).then((response) => {
    return response?.data
  })
}

let cancelPostalCode

export const getMunicipisByPostalCode = async (postalCode) => {
  if (typeof cancelPostalCode !== typeof undefined) {
    cancelPostalCode.cancel('Operation canceled due to new request')
  }

  cancelPostalCode = axios.CancelToken.source()

  const ines = postalCode2Ine.filter((item) =>
    Object.keys(item).includes(postalCode)
  )

  const municipis = ines.map((item) => {
    const ineCode = item[postalCode]
    return axios({
      method: 'GET',
      url: `${WEBFORMS_API_URL}/data/ine/${ineCode}`,
      cancelToken: cancelPostalCode.token
    }).then((response) => {
      return response?.data
    })
  })

  const responses = await axios.all(municipis)
  return responses.filter((item) => item?.state).map((item) => item?.data)
}

export const contribution = async (data) => {
  var formData = new FormData()
  for (var key in data) {
    formData.append(key, data[key])
  }

  return axios({
    method: 'POST',
    url: `${WEBFORMS_API_URL}/form/inversio`,
    data: formData
  }).then((response) => {
    return response?.data
  })
}

export const checkIsFromGenerationEnabledZone = async (data) => {
  const {memberNumber,memberVat} = data
  return axios({
    method: 'GET',
    url: `${WEBFORMS_API_URL}/data/generationkwh/can_join/${memberNumber}/${memberVat}`
  }).then((response) => {
    return response?.data
  })
}

export const checkIsPostalCodeFromGenerationEnabledZone = async (data) => {
  const {postalCode} = data
  return axios({
    method: 'GET',
    url: `${WEBFORMS_API_URL}/data/generationkwh/can_join/${postalCode}`
  }).then((response) => {
    return response?.data
  })
}

export const createGenerationkWhSignature = async (data) => {
  return axios({
    method: 'POST',
    url: `${WEBFORMS_API_URL}/form/create_gkwh_signature`,
    data: data
  }).then((response) => {
    return response?.data
  })
}


export const generationkWhContribution = async (data) => {
  return axios({
    method: 'POST',
    url: `${WEBFORMS_API_URL}/form/generationkwh`,
    data: data
  }).then((response) => {
    return response?.data
  })
}

/// OV API (local urls)

export const cancelContract = async (data) => {
  const { contract_id, csrfToken } = data
  return axios({
    method: 'POST',
    url: `/contract/${contract_id}/cancel`,
    data: data,
    headers: {
      'X-CSRFToken': csrfToken
    }
  }).then((response) => {
    return response?.data
  })
}

export const confirmCancelContract = async (data) => {
  const { contract_id, csrfToken, token } = data
  return axios({
    method: 'POST',
    url: `/contract/${contract_id}/confirm_cancellation/${token}`,
    headers: {
      'X-CSRFToken': csrfToken
    }
  }).then((response) => {
    return response?.data
  })
}

export const generationChangeContractPriority = async (data) => {
    return axios({
      method: 'PUT',
      url: `/api/investments/change-assignment-order/`,
      data: data
    }).then((response) => {
      return response?.data
    })
}

export const getNoAssignmentContracts = async () => {
  return axios({
    method: 'GET',
    url: `/api/investments/unassigned-contracts`,
  }).then((response) => {
    return response?.data
  })
}

export const getAssignmentContracts = async () => {
  return axios({
    method: 'GET',
    url: `/api/investments/assignments/`,
  }).then((response) => {
    return response?.data
  })
}

export const addContractsToAssignments = async (data) => {
  return axios({
    method: 'POST',
    url: `/api/investments/assignments/`,
    data: data
  }).then((response) => {
    return response?.data
  })
}

export const deleteContractsFromAssignments = async (id) => {
  return axios({
    method: 'DELETE',
    url: `/api/investments/assignments/${id}`,
  }).then((response) => {
    return response?.data
  })
}

export const getPowers = async (id) => {
  return axios({
    method: 'GET',
    url: `${WEBFORMS_API_URL}/data/gurb/${id}/available_powers`,
  }).then((response) => {
    return response?.data
  })
}

export const addGurb = async (data) => {
  return axios({
    method: 'POST',
    url: `${WEBFORMS_API_URL}/form/gurb/payment`,
    data: data
  }).then((response) => {
    return response?.data
  })
}