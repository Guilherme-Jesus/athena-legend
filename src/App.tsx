import './app.scss'

import axios from 'axios'
import React, { memo, useCallback, useEffect, useMemo, useState } from 'react'

import { IListBlocks, IListBlocksLeaf, ITimeline } from './types'

import { Breadcrumb } from 'react-bootstrap'
import Blocks from './components/Blocks'
import Map from './components/Map'
import Timeline from './components/Timeline'

const App: React.FC = (): React.ReactElement => {
  const [currentBlockId, setCurrentBlockId] = useState<string>('C19')
  const [blockLeaves, setBlockLeaves] = useState<IListBlocksLeaf[]>([])
  const [timelineData, setTimelineData] = useState<ITimeline[]>([])
  const [timeline, setTimeline] = useState<ITimeline[]>([])

  const [blocks, setBlocks] = useState<IListBlocks[]>([])
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
      const lk = blocks.filter((block) => block.blockId === id && id !== 'C19')
      if (currentBlockId !== id) {
        setTimeline(timelineData.filter((item) => item.blockId === id))
        setCurrentBlockId(id)
      } else if (!leaf) {
        blockUx.push(lk as unknown as IListBlocks)
        console.log(blockUx)
        setBlocks(blocks.filter((item) => item.blockParent === id))
        setTimeline(timelineData.filter((item) => item.blockId === id))
      } else if (leaf) {
        setBlockLeaves(blockLeaves.filter((item) => item.blockParent === id))
        setTimeline(timelineData.filter((item) => item.blockId === id))
      }
    },
    [blockLeaves, blockUx, blocks, currentBlockId, timelineData],
  )

  const handleBlockBack = useCallback(
    (block: IListBlocks) => {
      setBlocks(array.filter((item) => item.blockParent === block.blockParent))
      setCurrentBlockId(block.blockId)
      blockUx.splice(blockUx.length - 1, 1)
    },
    [array, blockUx],
  )

  return (
    <div className="App">
      <div className="blocksApp">
        <Blocks
          blocks={blocks}
          currentBlockId={currentBlockId}
          handleBlockClick={handleBlockClick}
        />
      </div>

      <div className="MapTimeline">
        <Breadcrumb className="breadcrumbLink">
          {
            (console.log(blockUx),
            blockUx.map((block, index) => (
              <>
                <Breadcrumb.Item
                  key={block[index].blockId}
                  // active
                  onClick={() => handleBlockBack(block[index])}
                >
                  {block[index].name}
                </Breadcrumb.Item>
              </>
            )))
          }
        </Breadcrumb>

        <div className="map">
          <Map
            blockLeaves={blockLeaves}
            currentBlockId={currentBlockId}
            timelineData={timelineData}
            setTimeline={setTimeline}
            setCurrentBlockId={setCurrentBlockId}
          />
        </div>
        <div className="timeline">
          <Timeline
            timelineData={timelineData}
            timeline={timeline}
            setTimeline={setTimeline}
          />
        </div>
      </div>
    </div>
  )
}

export default memo(App)
