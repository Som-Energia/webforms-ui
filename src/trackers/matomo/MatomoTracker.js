class MatomoTracker {
  constructor() {
    this.initialize()
  }

  initialize() {
    if (!window._paq) {
      console.warn("Tracker not initialized - Initializing window._paq")
      var _paq = (window._paq = window._paq || [])
      /* tracker methods like "setCustomDimension" should be called before "trackPageView" */
      _paq.push(["trackPageView"])
      _paq.push(["enableLinkTracking"])
      ;(function () {
        var u = import.meta.env.VITE_MATOMO_URL
        _paq.push(["setTrackerUrl", u + "matomo.php"])
        _paq.push(["setSiteId", import.meta.env.VITE_MATOMO_SITE_ID])
        var d = document,
          g = d.createElement("script"),
          s = d.getElementsByTagName("script")[0]
        g.async = true
        g.id = "matomo_tracker"
        g.src = u + "matomo.js"
        s.parentNode.insertBefore(g, s)
      })()
    }

    if (!window._mtm) {
      console.warn("Tracker not initialized - Initializing window._mtm")
      // Matomo Tag Manager
      const _mtm = (window._mtm = window._mtm || [])
      _mtm.push({ "mtm.startTime": new Date().getTime(), event: "mtm.Start" })
      ;(function () {
        var d = document,
          g = d.createElement("script"),
          s = d.getElementsByTagName("script")[0]
        g.async = true
        g.src = "https://matomo.somenergia.coop/js/container_Jck5ZJOE.js"
        s.parentNode.insertBefore(g, s)
      })()
    }
  }

  pushTag({ event, componentName }) {
    window._mtm = window._mtm || []
    window._mtm.push({
      event,
      componentName,
    })
  }

  trackEvent({ category, action, name, value }) {
    if (category && action) {
      this.pushInstruction("trackEvent", category, action, name, value)
    } else {
      throw new Error(`Error: category and action are required.`)
    }
  }

  pushInstruction(matomoFunctionName, category, action, name, value) {
    if (typeof window !== "undefined") {
      window._paq.push([matomoFunctionName, category, action, name, value])
    }

    return this
  }
}

export default MatomoTracker
