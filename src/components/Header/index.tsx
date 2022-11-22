import React from 'react'
import './header.scss'
import ZeusLogo from '../../assets/img/zeusLight.png'
import { useNavigate } from 'react-router-dom'

export function Header() {
  const navigate = useNavigate()
  const logout = () => {
    localStorage.removeItem('user')
    navigate('/login')
  }
  return (
    <div className="header">
      <div>
        <img src={ZeusLogo} alt="" className="logoHeader" />
      </div>
      <button onClick={logout} className="buttonLogout">
        Logout
      </button>
    </div>
  )
}
