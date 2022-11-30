import styled from 'styled-components'
import { Link, NavLink } from 'react-router-dom'

export const Nav = styled.div`
  background: #ff7f2f;
  height: 80px;
  display: flex;
  justify-content: center;
  align-items: center;
  font-size: 18px;
  position: sticky;
  top: 0;
  z-index: 999;
`

export const NavbarContainer = styled.div`
  display: flex;
  /* justify-content: space-between; */
  height: 80px;
  z-index: 1;
  width: 100%;
  max-width: 1300px;
  margin-right: auto;
  padding-right: 50px;
  padding-left: 50px;
  @media screen and (max-width: 960px) {
    padding-right: 30px;
  }
`

export const NavLogo = styled(Link)`
  display: flex;
  color: #fff;
  justify-self: flex-start;
  background-color: green;
  cursor: pointer;
  text-decoration: none;
  font-size: 2rem;
  align-items: center;
  margin-right: 48px;
`

export const MobileIcon = styled.div`
  display: none;
  @media screen and (max-width: 960px) {
    display: block;
    position: absolute;
    top: 0;
    right: 0;
    transform: translate(-100%, 40%);
    font-size: 1.8rem;
    cursor: pointer;
  }
`

type NavMenuProps = {
  click: any
}

export const NavMenu = styled.div<NavMenuProps>`
  display: flex;
  align-items: center;
  justify-content: space-between;
  list-style: none;
  text-align: center;
  z-index: 999;
  @media screen and (max-width: 960px) {
    width: 60%;
    height: 82vh;
    position: absolute;
    display: flex;
    flex-direction: column;

    top: 80px;
    z-index: 999;
    left: ${({ click }) => (click ? 0 : '-100%')};
    opacity: 1;
    transition: all 0.5s ease-out;
    background: #ffffff;
  }
`

export const NavItem = styled.span`
  display: flex;
  height: 80px;
  border-bottom: 2px solid transparent;

  @media screen and (max-width: 960px) {
    width: 100%;
    display: flex;
    flex-direction: column;
    &:hover {
      border: none;
    }
  }
`

export const NavLogoItem = styled.img`
  display: none;
  @media screen and (max-width: 960px) {
    display: flex;
  }
`

export const NavLinks = styled(NavLink)`
  color: #fff;
  display: flex;
  align-items: center;
  text-decoration: none;
  padding: 0 1rem;
  height: 100%;
  &:hover {
    border-bottom: 2px solid #9c4d1d;
  }

  @media screen and (max-width: 960px) {
    /* text-align: center; */

    margin-top: 1rem;
    align-items: start;
    width: 100%;
    height: 4rem;
    /* display: table; */
    &:hover {
      color: #9c4d1d;
      transition: all 0.1s ease;
    }
  }
`
// Logout button
export const NavItemBtn = styled.div`
  position: absolute;
  right: 0;

  @media screen and (max-width: 960px) {
    position: absolute;
    bottom: 0;
    justify-content: center;
    align-items: center;
    background-color: green;
    width: 100%;
    /* height: 1px; */
  }
`

export const NavBtnLink = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  text-decoration: none;
  padding: 8px 16px;
  height: 100%;
  width: 100%;
  border: none;
  outline: none;
  &:hover {
    color: #9c4d1d;
  }
  @media screen and (max-width: 960px) {
    position: absolute;
    bottom: 0;
    justify-content: start;
    align-items: baseline;
    width: 100%;
    height: 3rem;
  }
`

export const Button = styled.button`
  text-decoration: none;
  margin-right: 48px;
  color: white;
  background-color: transparent;
  border: 0;
  align-items: center;
  justify-content: center;
  display: flex;
  @media screen and (max-width: 960px) {
    color: #ff7f2f;
    justify-content: center;
    align-items: center;
  }
`
export const SVGLogout = styled.img`
  fill: #ffffff;
  @media screen and (max-width: 960px) {
    margin-bottom: 2px;
    filter: invert(50%) sepia(1%) saturate(64%) hue-rotate(246deg)
      brightness(102%) contrast(143%);
  }
`
