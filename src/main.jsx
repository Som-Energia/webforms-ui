import "./index.css"

import React from "react"
import ReactDOM from "react-dom/client"

import App from "./App"
import AppError from "./AppError"
import { initDevTools } from "./devTools"
// import * as serviceWorker from './serviceWorker'

const roots = document.querySelectorAll("[id='root']")

if (roots.length) {
  roots.forEach(async (item, index) => {
    const props = {}
    Object.keys(item.dataset).forEach((name) => {
      props[name] = item.dataset[name]
    })

    props.supportedApiVersion = import.meta.env.VITE_API_VERSION
    props.version = `${import.meta.env.VITE_APP_VERSION}-${import.meta.env.VITE_APP_COMMIT_SHA}`

    const root = document.querySelectorAll("[id='root']")[index]
    try {
      const ff = await buildFeatureFlags()
      initDevTools(props.version, props.supportedApiVersion, ff)
      Object.entries(ff).forEach(([flag, value]) => {
        props[flag] = value
      })
      ReactDOM.createRoot(root).render(
        <React.StrictMode>
          <App {...props} />
        </React.StrictMode>,
      )
    } catch (err) {
      console.error(err)
      ReactDOM.createRoot(root).render(<AppError />)
    }
  })
}

async function buildFeatureFlags() {
  const featureFlags = JSON.parse(import.meta.env?.VITE_FEATURE_FLAGS || "{}")
  const params = new URLSearchParams(document.location.search)
  if (params.has("token")) {
    const token = params.get("token")
    try {
      const response = await fetch(
        `${import.meta.env?.VITE_WEBFORMS_API_URL}/data/feature-flag-token/validate`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ token }),
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
  return featureFlags
}
// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: https://bit.ly/CRA-PWA
// serviceWorker.unregister()
