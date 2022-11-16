/* eslint-disable no-undef */
/* eslint-disable react-hooks/exhaustive-deps */
import { FunctionComponent, useEffect, useState } from 'react'
import { getAuth, onAuthStateChanged } from 'firebase/auth'
import { useNavigate } from 'react-router-dom'

export interface IAuthRouteProps {
  children?: JSX.Element
}

const AuthRoute: FunctionComponent<IAuthRouteProps> = (props) => {
  const { children } = props
  const auth = getAuth()
  const navigate = useNavigate()
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    AuthCheck()
    return () => AuthCheck()
  }, [auth])

  const AuthCheck = onAuthStateChanged(auth, (user) => {
    if (user) {
      setLoading(false)
    } else {
      navigate('/dashboard')
    }
  })

  if (loading) return <p>loading........</p>

  return <>{children}</>
}

export default AuthRoute
