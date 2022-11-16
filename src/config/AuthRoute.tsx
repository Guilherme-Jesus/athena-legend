/* eslint-disable no-undef */
/* eslint-disable react-hooks/exhaustive-deps */
import React, { useEffect, useCallback, useState } from 'react'
import { getAuth, onAuthStateChanged } from 'firebase/auth'
import { useNavigate } from 'react-router-dom'

export interface IAuthRouteProps {
  children?: any
}

const AuthRoute: React.FunctionComponent<IAuthRouteProps> = (props) => {
  const { children } = props
  const auth = getAuth()
  const navigate = useNavigate()
  const [loading, setLoading] = useState(false)

  const AuthCheck = onAuthStateChanged(auth, (user) => {
    if (!user) {
      navigate('/login')
    } else {
      setLoading(false)
    }
  })

  useEffect(() => {
    AuthCheck()

    return () => AuthCheck()
  }, [auth])

  if (loading) return <p>Carregando...</p>

  return <>{children}</>
}

export default AuthRoute
