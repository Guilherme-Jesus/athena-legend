import './app.scss'

import * as L from 'leaflet'
import React, { useCallback, useEffect, useMemo, useState } from 'react'

import axios from 'axios'
import Blocks from './components/Blocks'
import './pages/Mapa/map.scss'
import { IListBlocks, IListBlocksLeaf } from './types/types'

const App: React.FC = (): React.ReactElement => {
  const [blocks, setBlocks] = useState<IListBlocks[]>([])
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
  }, [currentBlockId])

  const handleBlockClick = useCallback(
    (id: string, leaf: boolean): void => {
      if (currentBlockId !== id) {
        setCurrentBlockId(id)
      } else if (!leaf) {
        setBlocks(blocks.filter((item) => item.blockParent === id))
      }
    },
    [blocks, currentBlockId],
  )
  const getCentroid = useMemo(() => {
    const array: number[] = []
    blockLeaf.forEach((item, index) => {
      if (index === 0 && index < 4) {
        array.push(...item.centroid)
      }
    })
    console.log(array)
    return array
  }, [blockLeaf])

  const center = useMemo(() => {
    return {
      lat: getCentroid[1],
      lng: getCentroid[0],
    }
  }, [getCentroid])

  useEffect(() => {
    const map = L.map('map', {
      center: initialPosition,
      zoom: 3,
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
          fillColor: '#ff7f2f',
          fillOpacity: 0.5,
          opacity: 0.8,
          dashArray: '3',
          weight: 4,
        },
      ).addTo(map)
      polygon.bindPopup(`<b>${item.blockId}</b>
       </br>
      <b>${item.name}</b>
      </br>
      <b>Chuva: ${item.data.rain} mm</b>
      </br>
      <b>Temperatura: ${Math.round(item.data.temperature)}ºC</b>
      </br>
      <b>Umidade: ${Math.round(item.data.relativeHumidity)}%</b>
      </br>
      <b>Vel.Vento: ${Math.round(item.data.windSpeed)} km/h</b>
      </br>
      <b>Rad.Solar: ${item.data.solarIrradiation.toFixed(2)} Wh/m²</b>
      
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

      <main>
        <div id="map" style={{ height: '83vh', width: '100%' }} />
      </main>
    </div>
  )
}

export default App
