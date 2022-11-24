import './app.scss'

import axios from 'axios'
import React, { memo, useCallback, useEffect, useState } from 'react'

import { IListBlocks, IListBlocksLeaf, ITimeline } from './types'

import Blocks from './components/Blocks'
import Map from './components/Map'
import Timeline from './components/Timeline'

const App: React.FC = (): React.ReactElement => {
  const [currentBlockId, setCurrentBlockId] = useState<string>('C19')
  const [blocks, setBlocks] = useState<IListBlocks[]>([])
  const [blockLeaves, setBlockLeaves] = useState<IListBlocksLeaf[]>([])
  const [timelineData, setTimelineData] = useState<ITimeline[]>([])

  useEffect(() => {
    if (blocks.length === 0) {
      fetch('http://localhost:7010/blocks', {
        headers: {
          'Content-Type': 'application/json',
          Accept: 'application/json',
        },
      })
        .then((response) => response.json())
        .then((response) =>
          setBlocks(
            response.filter(
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
      .get(`http://localhost:7010/blockLeaf`)
      .then((response) => {
        setBlockLeaves(response.data)
      })
      .catch((error) => console.log(error))
  }, [])

  useEffect(() => {
    axios
      .get('http://localhost:7010/timeline')
      .then((response) => setTimelineData(response.data))
      .catch((error: any) => console.log(error))
  }, [])

  const handleBlockClick = useCallback(
    (id: string, leaf: boolean): void => {
      if (currentBlockId !== id) {
        setCurrentBlockId(id)
      } else if (!leaf) {
        setBlocks(blocks.filter((item) => item.blockParent === id))
      } else if (leaf) {
        setBlockLeaves(blockLeaves.filter((item) => item.blockParent === id))
      }
    },
    [blockLeaves, blocks, currentBlockId],
  )

  return (
    <div className="App">
      <Blocks
        blocks={blocks}
        currentBlockId={currentBlockId}
        handleBlockClick={handleBlockClick}
      />

      <Timeline timelineData={timelineData} />

      <Map blockLeaves={blockLeaves} currentBlockId={currentBlockId} />
    </div>
  )
}

export default memo(App)
