import './app.scss'
import './components/Map/map.scss'

import React, { useCallback, useEffect, useMemo, useState } from 'react'
import * as L from 'leaflet'

import axios from 'axios'
import { IListBlocks, IListBlocksLeaf } from './types/types'

import Blocks from './components/Blocks'
import { dataUnit } from './components/utils'

const App: React.FC = (): React.ReactElement => {
  const [blocks, setBlocks] = useState<IListBlocks[]>([])
  const [copiaBlock, setCopiaBlock] = useState<IListBlocks[]>([])
  const [currentBlockId, setCurrentBlockId] = useState<string>('C19')
  const [blockLeaf, setBlockLeaf] = useState<IListBlocksLeaf[]>([])
  const [initialPosition, setInitialPosition] = useState<[number, number]>([
    -23.5505199, -46.63330939999999,
  ])

  useEffect(() => {
    if (blocks.length === 0) {
      fetch('http://localhost:7010/blocks', {
        headers: {
          'Content-Type': 'application/json',
          Accept: 'application/json',
        },
      })
        .then((response) => response.json())
        .then((res) =>
          setBlocks(
            res.filter(
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
        setBlockLeaf(
          response.data.filter(
            (blockLeaf: IListBlocksLeaf) => blockLeaf.bounds.length > 4,
          ),
        )
      })
      .catch((err) => {
        console.log(err)
      })
  }, [])

  useEffect(() => {
    if (copiaBlock.length === 0) {
      fetch('http://localhost:7010/blocks', {
        headers: {
          'Content-Type': 'application/json',
          Accept: 'application/json',
        },
      }).then((response) => {
        response.json().then((res) => {
          setCopiaBlock(res)
        })
      })
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [copiaBlock])

  // const pegaFolha = useCallback((blockId: string) => {

  const pegaFolha = useCallback(
    (blockId: string) => {
      let lo: string = ''
      let para: boolean = false
      copiaBlock
        .filter((item) => item.blockParent === blockId)
        .forEach((items) => {
          if (para === false) {
            if (!items.leafParent) {
              pegaFolha(items.blockId)
            }
            // eslint-disable-next-line no-unused-expressions
            else lo = items.blockId
            para = true
          }
        })

      return lo
    },
    [copiaBlock],
  )

  const handleBlockClick = useCallback(
    (id: string, leaf: boolean): void => {
      if (currentBlockId !== id) {
        setCurrentBlockId(id)
      } else if (!leaf) {
        setBlocks(blocks.filter((item) => item.blockParent === id))
      } else if (leaf) {
        setBlockLeaf(blockLeaf.filter((item) => item.blockParent === id))
      }
    },
    [blockLeaf, blocks, currentBlockId],
  )

  // const handleBlockClick = useCallback(
  //   (id: string, leaf: boolean): void => {
  //     currentBlockId !== id
  //       ? setCurrentBlockId(id)
  //       : !leaf
  //       ? setBlocks(blocks.filter((item) => item.blockParent === id))
  //       : setBlockLeaf(blockLeaf.filter((item) => item.blockParent === id))
  //   },
  //   [blocks, currentBlockId, blockLeaf],
  // )

  const getCentroid = useMemo(() => {
    const array: number[] = []
    const centro = pegaFolha(currentBlockId)
    console.log(centro)
    console.log(currentBlockId)
    blockLeaf.forEach((item, index) => {
      if (centro === '') {
        if (index === 0) {
          array.push(...item.centroid)
        }
      } else {
        if (item.blockParent === centro) {
          array.push(...item.centroid)
        }
      }
    })
    return array
  }, [blockLeaf, currentBlockId, pegaFolha])

  const center = useMemo(() => {
    return {
      lat: getCentroid[1],
      lng: getCentroid[0],
    }
  }, [getCentroid])

  useEffect(() => {
    const map = L.map('map', {
      center: initialPosition || center,
      zoom: 5,
      zoomControl: false,
      layers: [
        L.tileLayer('http://{s}.google.com/vt/lyrs=s,h&x={x}&y={y}&z={z}', {
          maxZoom: 20,
          minZoom: 3,
          attribution: 'Google',
          subdomains: ['mt0', 'mt1', 'mt2', 'mt3'],
          accessToken: import.meta.env.VITE_GOOGLE_MAPS_API_KEY,
        }),
      ],
    })

    blockLeaf.forEach((item) => {
      const polygon = L.polygon(
        item.bounds.map((item) => [item[1], item[0]]),
        {
          color: '#ff7f2f',
          dashArray: '3',
          fillColor: '#ff7f2f',
          fillOpacity: 0.5,
          opacity: 0.8,
          weight: 4,
        },
      ).addTo(map)

      polygon.bindPopup(`
        <h3 class="h5 mb-0">
          ${item.name} <small>(${item.blockId})</small>
        </h3>
        <ul class="list-unstyled mb-0">
          <li>
            <b>Chuva:</b> ${item.data.rain}${dataUnit.rain}
          </li>
          <li>
            <b>Temperatura:</b> ${Math.round(item.data.temperature)}${
        dataUnit.temperature
      }
          </li>
          <li>
            <b>Umidade:</b> ${Math.round(item.data.relativeHumidity)}${
        dataUnit.relativeHumidity
      }
          </li>
          <li>
            <b>Vento:</b> ${Math.round(item.data.windSpeed)}${
        dataUnit.windSpeed
      }
          </li>
          <li>
            <b>Radiação solar:</b> ${item.data.solarIrradiation.toFixed(2)}${
        dataUnit.solarRadiation
      }
          </li>
        </ul>
      `)

      map.setView(center, 13)
    })

    return () => {
      map.remove()
    }
  }, [blockLeaf, center, initialPosition])

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

      <div id="map" className="map-container h-100 w-100" />
    </div>
  )
}

export default App
