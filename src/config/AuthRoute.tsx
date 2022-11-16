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

  useCallback(() => {
    AuthCheck()

    return () => AuthCheck()
  }, [auth])

  const AuthCheck = onAuthStateChanged(auth, (user) => {
    if (!user) {
      navigate('/')
    } else {
      setLoading(false)
    }
  })

  if (loading) return <p>loading</p>

  return <>{children}</>
}

export default AuthRoute
