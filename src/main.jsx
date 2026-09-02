import "./index.css"

import React from "react"
import ReactDOM from "react-dom/client"

import App from "./App"
import { initDevTools } from "./devTools"
// import * as serviceWorker from './serviceWorker'

const roots = document.querySelectorAll("[id='root']")

if (roots.length) {
  roots.forEach(async (item, index) => {
    const props = {}
    Object.keys(item.dataset).forEach((name) => {
      props[name] = item.dataset[name]
    })

    props.apiVersion = import.meta.env.VITE_API_VERSION
    props.version = import.meta.env.VITE_APP_VERSION

    const root = document.querySelectorAll("[id='root']")[index]
    try {
      const ff = await buildFeatureFlags()
      initDevTools(props.version, props.apiVersion, ff)
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
      ReactDOM.createRoot(root).render(
        <div
          style={{
            backgroundColor: "#f8d7da",
            padding: "10rem",
            fontSize: "2rem",
            textAlign: "center",
            color: "#721c24",
          }}>
          😢 Invalid form
        </div>,
      )
    }
  })
}

async function buildFeatureFlags() {
  const featureFlags = JSON.parse(import.meta.env?.VITE_FEATURE_FLAGS || "{}")
  const params = new URLSearchParams(document.location.search)
  // TODO: choice one of them
  if (params.has("f")) {
    const { ff, exp } = JSON.parse(atob(params.get("f") || "{}"))
    if (!exp || Date.now() > Number(exp)) {
      throw new Error("Invalid form params")
    }

    ff.forEach((key) => {
      featureFlags[key] = true
    })
  } else if (params.has("token")) {
    // secured
    const token = params.get("token")
    try {
      // TODO: use VITE_WEBFORMS_API_URL
      const response = await fetch(
        `https://function-bun-production-4dcc1.up.railway.app/api/token/validate?token=${token}`,
      )

      if (!response.ok) {
        throw new Error(`Response status: ${response.status}`)
      }

      const json = await response.json()
      const ff = json.ff
      ff.forEach((key) => {
        featureFlags[key] = true
      })
    } catch {
      throw new Error("Invalid token")
    }
  }
  return featureFlags
}
// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: https://bit.ly/CRA-PWA
// serviceWorker.unregister()
