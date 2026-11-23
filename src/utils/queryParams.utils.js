import { validateMgmToken } from "../services/api"

export const TOKEN_ERROR = {
  INVALID_PARAMS: "INVALID_PARAMS",
  INVALID_TOKEN: "INVALID_TOKEN",
  SERVICE_ERROR: "SERVICE_ERROR",
  INVALID_RESPONSE: "INVALID_RESPONSE",
}

export class TokenValidationError extends Error {
  constructor(code, message, options = {}) {
    super(message, options)
    this.name = "TokenValidationError"
    this.code = code
  }
}

const validateAndDecodeFeatureFlagToken = async (token) => {
  let response

  try {
    response = await fetch(
      `${import.meta.env?.VITE_WEBFORMS_API_URL}/data/feature-flag-token/validate`,
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ token }),
      },
    )
  } catch (cause) {
    throw new TokenValidationError(
      TOKEN_ERROR.SERVICE_ERROR,
      "Could not contact the token validation service",
      { cause },
    )
  }

  if (!response.ok) {
    const invalidToken = response.status === 401 || response.status === 403
    throw new TokenValidationError(
      invalidToken ? TOKEN_ERROR.INVALID_TOKEN : TOKEN_ERROR.SERVICE_ERROR,
      `Token validation returned HTTP ${response.status}`,
    )
  }

  let json
  try {
    json = await response.json()
  } catch (cause) {
    throw new TokenValidationError(
      TOKEN_ERROR.INVALID_RESPONSE,
      "Token validation returned invalid JSON",
      { cause },
    )
  }

  const flags = json?.data?.ff
  if (
    !Array.isArray(flags) ||
    !flags.every((flag) => typeof flag === "string")
  ) {
    throw new TokenValidationError(
      TOKEN_ERROR.INVALID_RESPONSE,
      "Token validation returned invalid feature flags",
    )
  }

  return Object.fromEntries(flags.map((flag) => [flag, true]))
}

const validateAndDecodeSponsoredToken = async (token) => {
  let response
  try {
    response = await validateMgmToken(token)
  } catch (cause) {
    const status = cause.response?.status
    const invalidToken = status === 401 || status === 403
    throw new TokenValidationError(
      invalidToken ? TOKEN_ERROR.INVALID_TOKEN : TOKEN_ERROR.SERVICE_ERROR,
      "Sponsored token validation failed",
      { cause },
    )
  }

  if (
    !response?.data ||
    typeof response.data !== "object" ||
    !response.data.result ||
    (response.data.result === "ok" && !response.data.expires_at)
  ) {
    throw new TokenValidationError(
      TOKEN_ERROR.INVALID_RESPONSE,
      "Sponsored token validation returned an unexpected response",
    )
  }

  if (response.data.result !== "ok") {
    throw new TokenValidationError(
      TOKEN_ERROR.INVALID_TOKEN,
      "Sponsored token is invalid",
    )
  }

  return { sponsoredTokenValid: true }
}

export default class QueryParamsUtils {
  constructor(token, type, featureFlags = {}) {
    this.token = token
    this.type = type
    this.ff = { ...featureFlags }
    this.strategies = {
      featureFlag: validateAndDecodeFeatureFlagToken,
      sponsoredContract: validateAndDecodeSponsoredToken,
    }
  }

  async buildFeatureFlagsFromToken() {
    if (this.token === null) {
      return this.ff
    }

    if (this.token === "" || !Object.hasOwn(this.strategies, this.type)) {
      throw new TokenValidationError(
        TOKEN_ERROR.INVALID_PARAMS,
        "A non-empty token and a supported token type are required",
      )
    }

    const flags = await this.strategies[this.type](this.token)
    this.ff = { ...this.ff, ...flags }
    return this.ff
  }
}
