import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App'
import './assets/styles/index.scss'
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import { Login } from './pages/Login'
import AuthRoute from './config/AuthRoute'

ReactDOM.createRoot(document.getElementById('root') as HTMLElement).render(
  <React.StrictMode>
    <BrowserRouter>
      <Routes>
        <Route path="/login" element={<Login />} />

        <Route
          path="/"
          element={
            <AuthRoute>
              <App />
            </AuthRoute>
          }
        />
      </Routes>
    </BrowserRouter>
  </React.StrictMode>,
)
