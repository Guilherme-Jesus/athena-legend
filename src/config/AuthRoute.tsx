import React, { useEffect, useState } from 'react'
import { getAuth, onAuthStateChanged } from 'firebase/auth'
import { useNavigate } from 'react-router-dom'

type AuthRouteProps = {
  children?: React.ReactElement
}

const AuthRoute: React.FC<AuthRouteProps> = (props) => {
  const { children } = props
  const auth = getAuth()
  const navigate = useNavigate()
  const [loading, setLoading] = useState(false)

  const AuthCheck = onAuthStateChanged(auth, (user) => {
    if (user) {
      setLoading(false)
    } else {
      navigate('/dashboard')
    }
  })

  useEffect(() => {
    AuthCheck()
    return () => AuthCheck()
  }, [AuthCheck, auth])

  if (loading) return <p>Carregando...</p>

  return <>{children}</>
}

export default AuthRoute
