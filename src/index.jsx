import React from 'react'
import ReactDOM from 'react-dom/client'
import './index.css'
import App from './App'
// import * as serviceWorker from './serviceWorker'

// const root = document.getElementById('root')
const root = document.querySelectorAll("[id='root']")

if (root) {
  root.forEach((item, index) => {
    const props = {}
    const attrs = Object.keys(item.dataset)
    attrs.forEach((name, index) => {
      props[name] = item.dataset[name]
    })

    props.version = import.meta.env.VITE_APP_VERSION

    const featureFlags = JSON.parse(import.meta.env?.VITE_APP_FEATURE_FLAGS || "{}")

    Object.keys(featureFlags).forEach((flag, index) => {
      props[flag] = featureFlags[flag]
    })
    
    console.log(
      `webforms-ui version: ${
        import.meta.env.VITE_APP_VERSION ||
        import.meta.env.NEXT_PUBLIC_VERCEL_GIT_COMMIT_SHA
      }`
    )

    console.log(
      `webforms-ui flags:`, featureFlags
    )
   
    ReactDOM.createRoot(document.querySelectorAll("[id='root']")[index]).render(
      <React.StrictMode>
        <App />
      </React.StrictMode>,
    )
  })
}
// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: https://bit.ly/CRA-PWA
// serviceWorker.unregister()
