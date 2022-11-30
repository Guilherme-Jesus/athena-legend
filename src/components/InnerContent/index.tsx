import { Outlet } from 'react-router-dom'
import Header from '../Header/Header'
import './innercontent.scss'

const InnerContent = () => {
  return (
    <div className="innercontent">
      <Header />
      <Outlet />
    </div>
  )
}

export default InnerContent
