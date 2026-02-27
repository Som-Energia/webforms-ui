import Plausible from 'plausible-tracker'

export const plausible = Plausible({
  domain: import.meta.env.VITE_APP_PLAUSIBLE_TRACK_DOMAIN,
  apiHost: import.meta.env.VITE_APP_PLAUSIBLE_APIHOST_URL,
  trackLocalhost: false,
})

