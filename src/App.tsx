import './app.scss'

import axios from 'axios'
import React, { memo, useCallback, useEffect, useState } from 'react'

import { IListBlocks, IListBlocksLeaf, ITimeline } from './types'

import Blocks from './components/Blocks/Blocks'
import Map from './components/Map'
import Timeline from './components/Timeline'

const App: React.FC = (): React.ReactElement => {
  const [currentBlockId, setCurrentBlockId] = useState<string>('C19')
  const [blocks, setBlocks] = useState<IListBlocks[]>([])
  const [blockLeaves, setBlockLeaves] = useState<IListBlocksLeaf[]>([])
  const [timelineData, setTimelineData] = useState<ITimeline[]>([])
  const [timeline, setTimeline] = useState<ITimeline[]>([])
  const [array, setArray] = useState<IListBlocks[]>([])
  const [blockUx, setBlockUx] = useState<IListBlocks[]>([])

  useEffect(() => {
    if (blocks.length === 0) {
      axios
        .get('http://localhost:7010/blocks', {
          headers: {
            'Content-Type': 'application/json',
            Accept: 'application/json',
          },
        })
        .then((response) => {
          setArray(response.data)
          setBlocks(
            response.data.filter(
              (block: IListBlocks) => currentBlockId === block.blockParent,
            ),
          )
        })
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
      .then((response) => {
        setTimelineData(response.data)
        setTimeline(
          response.data.filter(
            (item) =>
              item.blockId === currentBlockId && currentBlockId !== 'C19',
          ),
        )
      })
      .catch((error: any) => console.log(error))
  }, [currentBlockId])

  const handleBlockClick = useCallback(
    (id: string, leaf: boolean): void => {
      const filteredBlocks = blocks.filter(
        (block) => block.blockId === id && id !== 'C19',
      )
      if (currentBlockId !== id) {
        setTimeline(timelineData.filter((item) => item.blockId === id))
        setCurrentBlockId(id)
      } else if (!leaf) {
        blockUx.push(...filteredBlocks)
        console.log(blockUx)
        setBlocks(blocks.filter((item) => item.blockParent === id))
        setTimeline(timelineData.filter((item) => item.blockId === id))
      } else if (leaf) {
        blockLeaves.forEach((item) => {
          if (item.blockId === id) {
            setTimeline(timelineData.filter((item) => item.blockId === id))
            setBlockLeaves(blockLeaves.filter((item) => item.blockId !== id))
          }
        })
      }
    },
    [blockLeaves, blockUx, blocks, currentBlockId, timelineData],
  )

  const handleBlockBack = useCallback(() => {
    const lastBlock = blockUx.pop()
    setBlocks(
      array.filter((item) => item.blockParent === lastBlock.blockParent),
    )
    setCurrentBlockId(lastBlock.blockId)
  }, [array, blockUx])

  return (
    <div className="App">
      <Blocks
        blocks={blocks}
        currentBlockId={currentBlockId}
        handleBlockClick={handleBlockClick}
      />

      <Map
        blockLeaves={blockLeaves}
        currentBlockId={currentBlockId}
        timelineData={timelineData}
        setTimeline={setTimeline}
        setCurrentBlockId={setCurrentBlockId}
      />
      <div className="breadcrumbLink">
        {blockUx.map((block) => (
          <span
            className="itemMain"
            key={block.blockId}
            onClick={handleBlockBack}
          >
            {block.name}
          </span>
        ))}
      </div>
      <Timeline
        timelineData={timelineData}
        timeline={timeline}
        setTimeline={setTimeline}
      />
    </div>
  )
}

export default memo(App)
