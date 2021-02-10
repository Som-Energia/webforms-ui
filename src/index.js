import React from 'react'
import ReactDOM from 'react-dom'
import './index.css'
import App from './App'
// import * as serviceWorker from './serviceWorker'

const root = document.getElementById('root')
const props = {}

if (root) {
  const attrs = Object.keys(root.dataset)
  attrs.forEach(
    (name, index) => { props[name] = root.dataset[name] }
  )

  props.version = process.env.REACT_APP_VERSION
  console.log(`webforms-ui version: ${process.env.REACT_APP_VERSION}`)

  ReactDOM.render(<App {...props} />, document.getElementById('root'))
}

// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: https://bit.ly/CRA-PWA
// serviceWorker.unregister()
