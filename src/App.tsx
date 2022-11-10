import './app.scss'

import React from 'react'

import Blocks from './components/Blocks'

const App: React.FC = (): React.ReactElement => {
  return (
    <div className="App">
      <header>HEADER</header>

      <nav className="nav">
        <a href="#">link 1</a>
        <a href="#">link 2</a>
        <a href="#">link 3</a>
      </nav>

      <Blocks />

      <main>MAPA</main>
    </div>
  )
}

export default App
