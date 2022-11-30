import styled from 'styled-components'
import { Link, NavLink } from 'react-router-dom'
import { SquaresFour, House, SignOut } from 'phosphor-react'

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

  height: 80px;
  z-index: 1;
  width: 100%;
  max-width: 81.25rem;
  margin-right: auto;
  padding-right: 50px;
  padding-left: 20px;
  @media screen and (max-width: 960px) {
    display: flex;
    margin-left: 40px;
    flex-direction: row-reverse;
    justify-content: space-between;
  }
`

export const NavLogo = styled(Link)`
  display: flex;
  color: #fff;
  justify-self: flex-start;
  cursor: pointer;
  text-decoration: none;
  font-size: 2rem;
  align-items: center;
  margin-right: 48px;
`

export const MobileIcon = styled.div`
  display: none;
  @media screen and (max-width: 960px) {
    display: flex;
    justify-content: end;
    align-items: start;
    margin-bottom: 16px;
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
    width: 12rem;
    height: 91vh;
    position: absolute;
    display: flex;
    flex-direction: column;
    box-shadow: 4px 4px 16px 0px rgba(0, 0, 0, 0.4);
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

export const NavLinks = styled(NavLink)`
  color: #fff;
  display: flex;
  align-items: center;
  text-decoration: none;
  padding: 0 1rem;
  height: 100%;
  &:hover {
  }

  @media screen and (max-width: 960px) {
    color: #ff7f2f;

    margin-top: 1rem;
    align-items: center;
    width: 100%;
    height: 4rem;
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

  &:hover {
    color: #9c4d1d;
  }
  @media screen and (max-width: 960px) {
    color: #ff7f2f;
    justify-content: center;
    align-items: center;
    &:hover {
      transition: all 0.1s ease;
    }
  }
`
export const SVGLogout = styled(SignOut)`
  fill: #ffffff;
  margin-right: 8px;
  @media screen and (max-width: 960px) {
    margin-bottom: 2px;
  }
`
export const NavLogoHome = styled(House)`
  display: none;
  @media screen and (max-width: 960px) {
    display: flex;
    justify-content: center;
    align-items: center;
    margin-bottom: 4px;
    margin-right: 8px;
    font-size: 22px;
  }
`
export const NavLogoBlocos = styled(SquaresFour)`
  display: none;
  @media screen and (max-width: 960px) {
    display: flex;
    justify-content: center;
    align-items: center;
    margin-bottom: 4px;
    margin-right: 8px;
    font-size: 22px;
  }
`
