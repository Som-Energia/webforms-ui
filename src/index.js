import React from 'react'
import ReactDOM from 'react-dom'
import './index.css'
import App from './App'
// import * as serviceWorker from './serviceWorker'

const root = document.getElementById('root')
// const props = [].filter.call(root.attributes, attr => /^data-/.test(attr.name))
const props = {}
const attrs = Object.keys(root.dataset)
attrs.forEach(
  (name, index) => { props[name] = root.dataset[name] }
)

ReactDOM.render(<App {...props} />, document.getElementById('root'))

// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: https://bit.ly/CRA-PWA
// serviceWorker.unregister()
