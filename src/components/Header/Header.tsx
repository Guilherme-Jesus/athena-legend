import { useEffect, useState } from 'react'
import {
  Nav,
  NavbarContainer,
  NavLogo,
  MobileIcon,
  NavMenu,
  NavItem,
  NavLinks,
  NavItemBtn,
  NavBtnLink,
  Button,
  SVGLogout,
  NavLogoItem,
} from './Header.elements'
import { List, X } from 'phosphor-react'
import ZeusLogo from '../../assets/images/logo.svg'
import { useNavigate } from 'react-router-dom'
import Signout from '../../assets/images/signout.svg'

const Navbar = () => {
  const [click, setClick] = useState(false)
  const [button, setButton] = useState(true)
  const navigate = useNavigate()

  const handleClick = () => setClick(!click)

  const showButton = () => {
    if (window.innerWidth <= 960) {
      setButton(false)
    } else {
      setButton(true)
    }
  }

  useEffect(() => {
    showButton()
  }, [])

  // window.addEventListener('resize', showButton)

  const logout = () => {
    localStorage.removeItem('user')
    navigate('/login')
  }

  return (
    <Nav>
      <NavbarContainer>
        <NavLogo to="/">
          <img src={ZeusLogo} alt="" />
        </NavLogo>
        <MobileIcon onClick={handleClick}>
          {click ? <X /> : <List />}
        </MobileIcon>
        <NavMenu onClick={handleClick} click={click}>
          <NavItem>
            <NavLinks to="/">
              <NavLogoItem src="" alt="" />
              <span>Home</span>
            </NavLinks>
            <NavLinks to="/edit">Blocos</NavLinks>
          </NavItem>
          <NavItemBtn>
            <NavBtnLink>
              <Button onClick={logout}>
                <SVGLogout
                  src={Signout}
                  alt=""
                  style={{ marginRight: '8px' }}
                />
                <span>Sair</span>
              </Button>
            </NavBtnLink>
          </NavItemBtn>
        </NavMenu>
      </NavbarContainer>
    </Nav>
  )
}

export default Navbar
