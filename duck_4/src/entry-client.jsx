import ReactDOM from 'react-dom/client'
import React from 'react'

import { BrowserRouter } from 'react-router-dom'
import { App } from './App'
//import './main.css'

ReactDOM.createRoot(document.getElementById('app')).render(
  <React.StrictMode>
    <BrowserRouter>
      <App />
    </BrowserRouter>
  </React.StrictMode>
)
console.log('createRoot')
