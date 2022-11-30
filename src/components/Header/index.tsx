// import React, { useEffect, useState } from 'react'
// import ZeusLogo from '../../assets/images/zeusLight.png'
// import Signout from '../../assets/images/signout.svg'
// import { NavLink, useNavigate } from 'react-router-dom'
// // import './header.scss'
// import { List, X } from 'phosphor-react'

// export function Header() {
//   // const navigate = useNavigate()
//   // const logout = () => {
//   //   localStorage.removeItem('user')
//   //   navigate('/login')
//   // }
//   // const activeStyle = {
//   //   borderBottom: '2px solid #9C4D1D',
//   //   paddingBottom: '4px',
//   //   color: '#9C4D1D',
//   // }

//   const [click, setClick] = useState(false)
//   const [button, setButton] = useState(true)

//   const handleClick = () => setClick(!click)

//   const showButton = () => {
//     if (window.innerWidth <= 960) {
//       setButton(false)
//     } else {
//       setButton(true)
//     }
//   }

//   useEffect(() => {
//     showButton()
//   }, [])

//   window.addEventListener('resize', showButton)
//   return (
//     // <div className="header">
//     //   <div>
//     //     <img src={ZeusLogo} alt="" className="logoHeader" />
//     //   </div>
//     //   <div className="navButtons">
//     //     <span>
//     //       <NavLink
//     //         to="/dashboard"
//     //         style={({ isActive }) => (isActive ? activeStyle : undefined)}
//     //         className="linkContainer"
//     //       >
//     //         Home
//     //       </NavLink>
//     //       {/* <NavLink to="/dashboard">Dashboard</NavLink> */}
//     //     </span>
//     //     <span className="linkContainer">
//     //       <NavLink
//     //         to="/edit"
//     //         style={({ isActive }) => (isActive ? activeStyle : undefined)}
//     //       >
//     //         Editar
//     //       </NavLink>
//     //     </span>
//     //   </div>
//     //   <button onClick={logout} className="buttonLogout">
//     //     Sair
//     //     <img src={Signout} alt="" style={{ marginLeft: '8px' }} />
//     //   </button>
//     // </div>
//   )
// }
