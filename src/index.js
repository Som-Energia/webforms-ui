import React from 'react'
import ReactDOM from 'react-dom'
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

    props.version = process.env.REACT_APP_VERSION
    console.log(
      `webforms-ui version: ${
        process.env.REACT_APP_VERSION || process.env.VERCEL_GIT_COMMIT_SHA
      }`
    )

    ReactDOM.render(
      <App {...props} />,
      document.querySelectorAll("[id='root']")[index]
    )
  })
}

// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: https://bit.ly/CRA-PWA
// serviceWorker.unregister()
