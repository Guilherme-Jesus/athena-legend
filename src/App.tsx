import './app.scss'

import React, { useCallback, useEffect, useState } from 'react'

import Blocks from './components/Blocks'

type BlockData = {
  atmosphericPressure: number // <-- pode ser undefined?
  rain: number
  relativeHumidity: number
  solarIrradiation: number // <-- pode ser undefined?
  temperature: number
  windSpeed: number // <-- pode ser undefined?
}

export type Block = {
  abrv: string
  blockId: string
  blockParent: string
  data: BlockData
  date: Date
  leafParent: boolean
  name: string
}

// type ForecastPast = {
//   date: string
//   rain: number
//   relativeHumidity: number
//   solarIrradiation: number
//   temperatureAverage: number
//   temperatureMax: number
//   temperatureMin: number
//   windSpeed: number
// }

// type ForecastPresent = {
//   date: string
//   rain: number
//   relativeHumidity: number
//   solarIrradiation: number
//   temperatureAverage: number
//   temperatureMax: number
//   temperatureMin: number
//   windSpeed: number
// }

// type ForecastType = {
//   date: string
//   rain: number
//   rainPrediction: string
//   rainProbability: number
//   temperatureMax: number
//   temperatureMin: number
// }

// export type Forecast = {
//   blockId: string
//   forecast: ForecastType[]
//   name: string
//   past: ForecastPast[]
//   present: ForecastPresent[]
// }

// type TreeBounds = {
//   bounds: number[]
// }

// type TreeIdData = {
//   rain: number
//   relativeHumidity: number
//   solarIrradiation: number
//   temperature: number
//   windSpeed: number
// }

// export type TreeId = {
//   abrv: string
//   blockId: string
//   blockParent: string
//   bounds: TreeBounds[]
//   centroid: number[]
//   data: TreeIdData
//   date: Date
//   leafParent: boolean
//   name: string
// }

// export type Users = {
//   displayName: string
//   email: string
//   id: string
//   phone: string
//   photoURL: string
// }

// export type MockData = {
//   blocks: Block[]
//   forecast: Forecast[]
//   treeId: TreeId[]
//   users: Users[]
// }

const App: React.FC = (): React.ReactElement => {
  const [blocks, setBlocks] = useState<Block[]>([])
  const [currentBlockId, setCurrentBlockId] = useState<string>('')

  useEffect(() => {
    if (blocks.length === 0) {
      fetch('C19.json', {
        headers: {
          'Content-Type': 'application/json',
          Accept: 'application/json',
        },
      })
        .then((response) => response.json())
        .then((mockData) =>
          setBlocks(
            mockData.blocks
              .filter((block: Block) => block.blockParent !== '0')
              .sort((a: Block, b: Block) => a.name.localeCompare(b.name)),
          ),
        )
    } else {
      setCurrentBlockId(blocks[0].blockId)
    }
  }, [blocks])

  const handleBlockClick = useCallback(
    (id: string): void => setCurrentBlockId(id === currentBlockId ? '' : id),
    [currentBlockId],
  )

  return (
    <div className="App">
      <header>HEADER</header>

      <nav className="nav">
        <a href="#">link 1</a>
        <a href="#">link 2</a>
        <a href="#">link 3</a>
      </nav>

      <Blocks
        blocks={blocks}
        currentBlockId={currentBlockId}
        handleBlockClick={handleBlockClick}
      />

      <div className="timeline-container">TIMELINE</div>

      <main>MAPA</main>
    </div>
  )
}

export default App
