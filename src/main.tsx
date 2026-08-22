import React from 'react'
import { createRoot } from 'react-dom/client'
import App from './App'
import EnterprisePage from './EnterprisePage'
import './styles/index.css'

document.documentElement.classList.add('js')

const isEnterprisePage = window.location.pathname.replace(/\/+$/, '').endsWith('/enterprise')
createRoot(document.getElementById('root')!).render(isEnterprisePage ? <EnterprisePage /> : <App />)
