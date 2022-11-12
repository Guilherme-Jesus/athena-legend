import './app.scss'
import './components/Map/map.scss'

import * as L from 'leaflet'
import React, { useCallback, useEffect, useMemo, useState } from 'react'

import axios from 'axios'
import { IHistorical, IListBlocks, IListBlocksLeaf } from './types/types'

import Blocks from './components/Blocks'
import { dataUnit } from './components/utils'

const App: React.FC = (): React.ReactElement => {
  const [blocks, setBlocks] = useState<IListBlocks[]>([])
  const [blockAux, setBlockAux] = useState<IListBlocks[]>([])
  const [blockLeaf, setBlockLeaf] = useState<IListBlocksLeaf[]>([])
  const [historical, setHistorical] = useState<IHistorical[]>([])
  const [currentBlockId, setCurrentBlockId] = useState<string>('C19')
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
      .get(`http://localhost:7010/historical`)
      .then((response) => {
        setHistorical(
          response.data.filter(
            (historical: IHistorical) => historical.bounds.length > 4,
          ),
        )
      })
      .catch((err) => {
        console.log(err)
      })
  }, [])

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
    if (blockAux.length === 0) {
      fetch('http://localhost:7010/blocks', {
        headers: {
          'Content-Type': 'application/json',
          Accept: 'application/json',
        },
      }).then((response) => {
        response.json().then((res) => {
          setBlockAux(res)
        })
      })
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [blockAux])

  const getLeaf = useCallback(
    (blockId: string) => {
      let arrayS: string = ''
      let breaker: boolean = false
      blockAux
        .filter((item) => item.blockParent === blockId)
        .forEach((items) => {
          if (breaker === false) {
            if (!items.leafParent) {
              getLeaf(items.blockId)
            } else arrayS = items.blockId
            breaker = true
          }
        })

      return arrayS
    },
    [blockAux],
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

  const getCentroid = useMemo(() => {
    const array: number[] = []
    const leafStr = getLeaf(currentBlockId)
    blockLeaf.forEach((item, index) => {
      if (leafStr === '') {
        if (index === 0) {
          array.push(...item.centroid)
        }
      } else {
        if (item.blockParent === leafStr) {
          array.push(...item.centroid)
        }
      }
    })
    return array
  }, [blockLeaf, currentBlockId, getLeaf])

  const center = useMemo(() => {
    return {
      lat: getCentroid[1],
      lng: getCentroid[0],
    }
  }, [getCentroid])

  const getColor = (rain: number): string => {
    return rain > 200
      ? '#08306b'
      : rain > 100
      ? '#4292c6'
      : rain > 50
      ? '#9ecae1'
      : rain > 10
      ? '#c6dbef'
      : rain > 5
      ? '#deebf7'
      : '#f7fbff'
  }

  useEffect(() => {
    const map = L.map('map', {
      center: initialPosition,
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
        item.bounds.map((item: any) => [item[1], item[0]]),
        {
          color: '#ff7f2f',
          dashArray: '3',
          fillColor: '#ff7f2f',
          fillOpacity: 0.5,
          opacity: 0.8,
          weight: 4,
        },
      ).addTo(map)

      map.setView(center, 12)
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
    })
    const info = new L.Control()
    const legend = new L.Control({
      position: 'bottomright',
    })
    historical?.forEach((item) => {
      L.polygon(
        item.bounds.map((item: any) => [item[1], item[0]]),
        {
          color: '#ff7f2f',
          dashArray: '3',
          fillColor: getColor(item.data.rain),
          fillOpacity: 0.5,
          opacity: 0.8,
          weight: 4,
        },
      )

        /// É possivel escolher entre o bindPopup e ou mouseover/mouseout

        .on('mouseover', () => {
          info.onAdd = () => {
            const div = L.DomUtil.create('div', 'info')
            div.innerHTML = `
        <h3 class="h5 mb-0">
          ${item.name} <small>(${item.blockId})</small>
        </h3>
        <ul class="list-unstyled mb-0">
          <li>  
          <b>Chuva:</b> ${Math.round(item.data.rain)}${dataUnit.rain}
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
           `
            return div
          }
          info.addTo(map)
        })

        .on('mouseout', () => {
          info.remove()
        })

        .bindPopup(
          `
        <h3 class="h5 mb-0">
        ${item.name} <small>(${item.blockId})</small>
        </h3>
        <ul class="list-unstyled mb-0">
          <li>  
          <b>Chuva:</b> ${Math.round(item.data.rain)}${dataUnit.rain}
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
          `,
        )
        .addTo(map)

      legend.onAdd = () => {
        const div = L.DomUtil.create('div', 'info legend')
        const grades = [0, 5, 10, 50, 100, 200]
        const labels = ['<strong>Chuva (mm)</strong>']
        grades.forEach((grade, index) => {
          labels.push(
            `<i style="background:${getColor(grade)}"></i> ${
              grades[index + 1]
                ? `${grade} - ${grades[index + 1]}`
                : `> ${grade}`
            }`,
          )
        })
        div.innerHTML = labels.join('<br>')
        return div
      }
      legend.addTo(map)
    })

    return () => {
      map.remove()
    }
  }, [blockLeaf, center, historical, initialPosition])

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
