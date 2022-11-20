// import React, { useEffect, useLayoutEffect, useState } from 'react'
// import { getAuth, onAuthStateChanged } from 'firebase/auth'

// export interface IAuthRouteProps {
//   children?: any
// }

// const AuthRoute: React.FunctionComponent<IAuthRouteProps> = (props) => {
//   const { children } = props
//   const auth = getAuth()
//   const navigate = useNavigate()
//   const [loading, setLoading] = useState(false)

//   const AuthCheck = onAuthStateChanged(auth, (user) => {
//     if (!user) {
//       window.location.href = '/login'
//       navigate('/login')
//     } else {
//       setLoading(false)
//     }
//   })

//   useLayoutEffect(() => {
//     AuthCheck()

//     return () => AuthCheck()
//   }, [auth])

//   if (loading) return <p>Carregando...</p>

//   return <>{children}</>
// }

// export default AuthRoute

import React from 'react'

import { Navigate, Outlet } from 'react-router-dom'

const useAuth = () => {
  // get item from localstorage

  let user: any

  const _user = localStorage.getItem('user')

  if (_user) {
    user = JSON.parse(_user)
    console.log('user', user)
  }
  if (user) {
    return {
      auth: true,
      role: user.role,
    }
  } else {
    return {
      auth: false,
      role: null,
    }
  }
}

// protected Route state
type ProtectedRouteType = {
  roleRequired?: 'ADMIN' | 'USER'
}

const AuthRoute = (props: ProtectedRouteType) => {
  const { auth, role } = useAuth()

  // if the role required is there or not
  if (props.roleRequired) {
    return auth ? (
      props.roleRequired === role ? (
        <Outlet />
      ) : (
        <Navigate to="/denied" />
      )
    ) : (
      <Navigate to="/login" />
    )
  } else {
    return auth ? <Outlet /> : <Navigate to="/login" />
  }
}

export default AuthRoute
