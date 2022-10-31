import { Header } from '../../components/Header'
import Blocos from '../Blocos'

export function Home() {
  return (
    <div>
      <div>
        <Header />
      </div>
      <div>
        <Blocos />
      </div>
      <div>{/* <Header /> //Mapa */}</div>
      <div>{/* <Header /> //Timeline */}</div>
    </div>
  )
}
