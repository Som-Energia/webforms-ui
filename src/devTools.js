import semver from "semver"

export const initDevTools = (version, supportedApiVersion, featureFlags) => {
  const logAppNameStyle =
    "background:#3b82f6;color:#fff;padding:2px 6px;border-radius:4px 0 0 4px;font-weight:bold"
  const logAppInfoStyle =
    "background:#1e3a5f;color:#93c5fd;padding:2px 6px;border-radius:0 4px 4px 0"
  const logWarningStyle =
    "background:#f59e0b;color:#111827;padding:2px 6px;border-radius:0 4px 4px 0;font-weight:bold"
  const logHintStyle = "color:#64748b"
  const logErrorStyle =
    "background:#dc2626;color:#fff;padding:2px 6px;border-radius:0 4px 4px 0;font-weight:bold"

  window.version = () => {
    getApiVersion().then((apiVersion) => {
      const validApiVersion = isApiVersionSupported(
        apiVersion,
        supportedApiVersion,
      )

      console.log(
        "%c webforms-ui %c %s %c api %c %s %c supported %c %s ",
        logAppNameStyle,
        logAppInfoStyle,
        version,

        validApiVersion ? logAppNameStyle : logErrorStyle,
        validApiVersion ? logAppInfoStyle : logWarningStyle,
        apiVersion || "--",

        logAppNameStyle,
        logAppInfoStyle,
        supportedApiVersion || "--",
      )

      if (!validApiVersion) {
        console.log(
          "%c webforms-ui %c API version does not match the supported version range",
          logAppNameStyle,
          logWarningStyle,
        )
      }
    })
  }

  window.flags = () => {
    const enabledFlags = Object.keys(featureFlags).filter(
      (key) => featureFlags[key],
    )

    if (!enabledFlags.length) {
      console.log(
        "%c webforms-ui %c no active flags",
        logAppNameStyle,
        logAppInfoStyle,
      )
      return
    }

    enabledFlags.forEach((key) => {
      console.log("%c webforms-ui %c %s", logAppNameStyle, logAppInfoStyle, key)
    })
  }

  window.help = () => {
    console.log(
      "%c webforms-ui %c DevTools menu",
      logAppNameStyle,
      logAppInfoStyle,
    )
    console.log(
      "%cversion()%c Print app version information",
      logAppInfoStyle,
      logHintStyle,
    )
    console.log(
      "%cflags()%c Print active feature flags",
      logAppInfoStyle,
      logHintStyle,
    )
    console.log(
      "%chelp()%c Print available DevTools helpers",
      logAppInfoStyle,
      logHintStyle,
    )
  }

  window.version()
}

function getApiVersion() {
  return fetch(`${import.meta.env.VITE_WEBFORMS_API_URL}/version`, {
    method: "get",
  })
    .then((res) => res.json())
    .then((value) => value.version)
    .catch(() => {
      // ignore
    })
}

function isApiVersionSupported(currentVersion, supportedVersionRange) {
  if (
    typeof currentVersion !== "string" ||
    typeof supportedVersionRange !== "string"
  ) {
    return true
  }

  const normalizedCurrentVersion = semver.coerce(currentVersion)
  const normalizedSupportedVersionRange = semver.validRange(
    supportedVersionRange,
  )

  if (!normalizedCurrentVersion || !normalizedSupportedVersionRange) {
    return true
  }

  return semver.satisfies(
    normalizedCurrentVersion.version,
    normalizedSupportedVersionRange,
  )
}
