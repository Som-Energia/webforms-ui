import { validateMgmToken } from "../services/api"

const LOADING = "loading"
const VALID = "valid"
const INVALID = "invalid"

export default class QueryParamsUtils {
  constructor(token, type) {
    const strategies = {
      featureFlag: this.buildFeatureFlags,
      sponsoredContract: this.validateToken,
    }
    const strategy = strategies[type]
    this.processToken = strategy.bind(this)
    this.token = token
    this.ff = {}
  }

  async buildFeatureFlags(featureFlags) {
    if (this.token) {
      try {
        const response = await fetch(
          `${import.meta.env?.VITE_WEBFORMS_API_URL}/data/feature-flag-token/validate`,
          {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify({ token: this.token }),
          },
        )

        if (!response.ok) {
          throw new Error(`Response status: ${response.status}`)
        }

        const json = await response.json()
        const { ff } = json.data
        ff.forEach((key) => {
          featureFlags[key] = true
        })
      } catch (e) {
        throw new Error("Invalid token", e)
      }
    }
    this.ff = featureFlags
  }

  validateToken() {
    // TODO: ADD STATUS IN FEATURE FLAGS
    let status = LOADING
    if (!this.token) {
      status = VALID
    } else {
      validateMgmToken(this.token)
        .then((response) => {
          status = response.status === "ok" ? VALID : INVALID
        })
        .catch(() => (status = INVALID))
    }
    this.ff = { tokenStatus: status }
  }
}
