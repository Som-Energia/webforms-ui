import "./index.css"

import React from "react"
import ReactDOM from "react-dom/client"

import App from "./App"
import AppError from "./AppError"
import { initDevTools } from "./devTools"
import QueryParamsUtils from "./utils/queryParams.utils"
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
      const params = new URLSearchParams(document.location.search)
      const featureFlags = JSON.parse(
        import.meta.env?.VITE_FEATURE_FLAGS || "{}",
      )
      let queryParamsUtils = undefined;
      if (params.has("token") && params.has("tt")) {
        const token = params.get("token")
        const tt = params.get("tt")
        queryParamsUtils = new QueryParamsUtils(token, tt)
        queryParamsUtils.processToken(featureFlags)
      }

      initDevTools(props.version, props.supportedApiVersion, featureFlags)
      Object.entries(featureFlags).forEach(([flag, value]) => {
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

// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: https://bit.ly/CRA-PWA
// serviceWorker.unregister()
