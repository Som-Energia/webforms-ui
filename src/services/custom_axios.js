import axios from 'axios'

let api = axios

try {
  api = axios.create()
} catch {
  api = axios
}

api.defaults = api.defaults || {}
api.defaults.headers = api.defaults.headers || {}
api.defaults.headers.common = api.defaults.headers.common || {}
api.defaults.headers.common['X-Language'] = 'es_ES'

api.CancelToken = axios.CancelToken
api.all = axios.all
api.isCancel = axios.isCancel

export default api
