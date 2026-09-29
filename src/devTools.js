export const initDevTools = (version, apiVersion, featureFlags) => {
  const logAppNameStyle =
    "background:#3b82f6;color:#fff;padding:2px 6px;border-radius:4px 0 0 4px;font-weight:bold"
  const logAppInfoStyle =
    "background:#1e3a5f;color:#93c5fd;padding:2px 6px;border-radius:0 4px 4px 0"
  const logHintStyle = "color:#64748b"

  window.version = () => {
    // TODO: check deployed API version and show it
    console.log(
      "%c webforms-ui %c %s %c api %c %s ",
      logAppNameStyle,
      logAppInfoStyle,
      version,

      logAppNameStyle,
      logAppInfoStyle,
      apiVersion || "--",
    )
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
