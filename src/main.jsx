import React from 'react'
import ReactDOM from 'react-dom/client'
import { HashRouter } from 'react-router-dom'
import App from './App'
import { CompareProvider } from './lib/compare'
import './index.css'

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <HashRouter>
      <CompareProvider>
        <App />
      </CompareProvider>
    </HashRouter>
  </React.StrictMode>,
)
