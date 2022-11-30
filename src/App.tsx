import './app.scss'

import axios from 'axios'
import React, { memo, useCallback, useEffect, useState } from 'react'

import { IListBlocks, IListBlocksLeaf, ITimeline } from './types'

import { Breadcrumb } from 'react-bootstrap'
import Blocks from './components/Blocks'
import Map from './components/Map'
import Timeline from './components/Timeline'

const App: React.FC = (): React.ReactElement => {
  const [currentBlockId, setCurrentBlockId] = useState<string>('C19')
  const [blocks, setBlocks] = useState<IListBlocks[]>([])
  const [blockLeaves, setBlockLeaves] = useState<IListBlocksLeaf[]>([])
  const [timelineData, setTimelineData] = useState<ITimeline[]>([])
  const [timeline, setTimeline] = useState<ITimeline[]>([])

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
      .then((response) => {
        setTimelineData(response.data)
        setTimeline(
          response.data.filter(
            (item) =>
              item.blockId === currentBlockId && currentBlockId !== 'C19',
          ),
        )
        console.log(response.data)
      })
      .catch((error: any) => console.log(error))
  }, [currentBlockId])

  const handleBlockClick = useCallback(
    (id: string, leaf: boolean): void => {
      if (currentBlockId !== id) {
        console.log('timelineData', timelineData)
        console.log('id:', id)
        setTimeline(timelineData.filter((item) => item.blockId === id))
        setCurrentBlockId(id)
      } else if (!leaf) {
        setBlocks(blocks.filter((item) => item.blockParent === id))
        setTimeline(timelineData.filter((item) => item.blockId === id))
      } else if (leaf) {
        setBlockLeaves(blockLeaves.filter((item) => item.blockParent === id))
        setTimeline(timelineData.filter((item) => item.blockId === id))
      }
    },
    [blockLeaves, blocks, currentBlockId, timelineData],
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
          <Breadcrumb.Item href="/" className="breadcrumbText">
            Inicio
          </Breadcrumb.Item>
          <Breadcrumb.Item href="/" className="breadcrumbText">
            Fazenda Santa Fé
          </Breadcrumb.Item>
          <Breadcrumb.Item href="/" className="breadcrumbText">
            Unidade Padrão
          </Breadcrumb.Item>
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
