import './app.scss'

import React, { useCallback, useEffect, useState } from 'react'

import Blocks from './components/Blocks'
import { IListBlocks, IListBlocksLeaf } from './types/types'
import axios from 'axios'
import Map from './pages/Mapa'

const App: React.FC = (): React.ReactElement => {
  const [blocks, setBlocks] = useState<IListBlocks[]>([])
  const [currentBlockId, setCurrentBlockId] = useState<string>('C19')
  const [blockLeaf, setBlockLeaf] = useState<IListBlocksLeaf[]>([])

  useEffect(() => {
    if (blocks.length === 0) {
      fetch('http://localhost:7010/blocks', {
        headers: {
          'Content-Type': 'application/json',
          Accept: 'application/json',
        },
      })
        .then((response) => response.json())
        .then((mockData) =>
          setBlocks(
            mockData.filter(
              (block: IListBlocks) => currentBlockId === block.blockParent,
            ),
          ),
        )
    } else {
      setCurrentBlockId(blocks[0].blockId)
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [blocks])

  useEffect(() => {
    axios
      .get(`http://localhost:7010/blockLeaf/?blockParent=${currentBlockId}`)
      .then((response) => {
        setBlockLeaf(response.data)
      })
      .catch((err) => {
        console.log(err)
      })
  }, [currentBlockId])

  const handleBlockClick = useCallback(
    (id: string, leaf: boolean): void => {
      if (currentBlockId !== id) {
        setCurrentBlockId(id)
      } else if (!leaf) {
        setBlocks(blocks.filter((item) => item.blockParent === id))
      } else setBlocks(blockLeaf?.filter((item) => item.blockParent === id))
    },
    [blocks, blockLeaf, currentBlockId],
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

      <main>
        <Map />
      </main>
    </div>
  )
}

export default App
