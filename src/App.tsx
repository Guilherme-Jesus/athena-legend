import './app.scss'
import './components/Map/map.scss'

import React, { useCallback, useEffect, useMemo, useState } from 'react'
import * as L from 'leaflet'

import axios from 'axios'
import { IListBlocks, IListBlocksLeaf } from './types'
import { dataUnit, displayData } from './components/utils'

import Blocks from './components/Blocks'
import Timeline from './components/Timeline'

const App: React.FC = (): React.ReactElement => {
  const [blocks, setBlocks] = useState<IListBlocks[]>([])
  const [currentBlockId, setCurrentBlockId] = useState<string>('C19') // hard coded
  const [blockLeaf, setBlockLeaf] = useState<IListBlocksLeaf[]>([])
  const [initialPosition] = useState<L.LatLngExpression>([
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
      .then((response) =>
        setBlockLeaf(
          response.data.filter(
            (blockLeaf: IListBlocksLeaf) => blockLeaf.bounds.length > 4,
          ),
        ),
      )
      .catch((error) => console.log(error))
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
      layers: [
        L.tileLayer('http://{s}.google.com/vt/lyrs=s,h&x={x}&y={y}&z={z}', {
          accessToken: import.meta.env.VITE_GOOGLE_MAPS_API_KEY,
          attribution: 'Google',
          maxZoom: 20,
          minZoom: 3,
          subdomains: ['mt0', 'mt1', 'mt2', 'mt3'],
        }),
      ],
      zoom: 3,
      zoomControl: false,
    })

    blockLeaf.forEach((item) => {
      const polygon = L.polygon(
        item.bounds.map((item) => [item[1], item[0]]),
        {
          color: 'var(--bs-primary)',
          dashArray: '3',
          fillColor: 'var(--bs-primary)',
          fillOpacity: 0.5,
          opacity: 0.8,
          weight: 4,
        },
      ).addTo(map)

      polygon.bindPopup(`
        <h3 class="h6 fw-bold px-2 mb-1">
          ${item.name}
        </h3>
        <table class="table table-bordered">
          <tbody>
            <tr>
              <td>
                <b>Chuva:</b>
              </td>
              <td>
                ${displayData(item.data.rain, dataUnit.rain)}
              </td>
            </tr>
            <tr>
              <td>
                <b>Temperatura:</b>
              </td>
              <td>
                ${displayData(item.data.temperature, dataUnit.temperature)}
              </td>
            </tr>
            <tr>
              <td>
                <b>Umidade do ar:</b>
              </td>
              <td>
                ${displayData(
                  item.data.relativeHumidity,
                  dataUnit.relativeHumidity,
                )}
              </td>
            </tr>
            <tr>
              <td>
                <b>Pressão atm.:</b>
              </td>
              <td>
                ${displayData(
                  item.data.atmosphericPressure,
                  dataUnit.atmosphericPressure,
                )}
              </td>
            </tr>
            <tr>
              <td>
                <b>Vento:</b>
              </td>
              <td>
                ${
                  item.data.windSpeed < 3
                    ? 'Sem vento'
                    : displayData(item.data.windSpeed, dataUnit.windSpeed)
                }
              </td>
            </tr>
            <tr>
              <td>
                <b>Radiação:</b>
              </td>
              <td>
                ${displayData(
                  item.data.solarIrradiation,
                  dataUnit.solarRadiation,
                )}
              </td>
            </tr>
          </tbody>
        </table>
      `)

      map.setView(center, 13)
    })

    return () => {
      map.remove()
    }
  }, [blockLeaf, center, initialPosition])

  return (
    <div className="App">
      <header className="p-3">HEADER</header>

      <nav className="nav p-3">
        <a href="#">link 1</a>
        <a href="#">link 2</a>
        <a href="#">link 3</a>
      </nav>

      <Blocks
        blocks={blocks}
        currentBlockId={currentBlockId}
        handleBlockClick={handleBlockClick}
      />

      <div className="timeline-container position-relative">
        <Timeline />
      </div>

      <div id="map" className="map-container h-100 w-100" />
    </div>
  )
}

export default App
