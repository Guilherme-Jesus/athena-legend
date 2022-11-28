import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App'
import './assets/styles/index.scss'
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import { Login } from './pages/Login'
import PrivateRoute from './config/AuthRoute/PrivateRoute'
import InnerContent from './components/InnerContent'
import PublicRoutes from './config/AuthRoute/PublicRoute'
import EditBlocks from './pages/BlockManager'
import { Provider } from 'react-redux'
import store from './app/store'

ReactDOM.createRoot(document.getElementById('root') as HTMLElement).render(
  <React.StrictMode>
    <Provider store={store}>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<PrivateRoute />}>
            <Route path="/" element={<InnerContent />}>
              <Route path="/" element={<Navigate replace to="dashboard" />} />
              <Route path="dashboard" element={<App />} />
              <Route path="edit" element={<EditBlocks />} />
            </Route>
          </Route>
          <Route path="login" element={<PublicRoutes />}>
            <Route path="/login" element={<Login />} />
          </Route>
        </Routes>
      </BrowserRouter>
    </Provider>
  </React.StrictMode>,
)
