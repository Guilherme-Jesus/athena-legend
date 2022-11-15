import './map.scss'

import React, { useCallback, useEffect, useMemo, useState } from 'react'
import * as L from 'leaflet'
import { dataUnit, displayData } from '../utils'
import axios from 'axios'
import { IListBlocks, IListBlocksLeaf } from '../../types'
import Dropdown from 'react-bootstrap/Dropdown'
import DropdownButton from 'react-bootstrap/DropdownButton'

const Map = ({
  currentBlockId,
  blockLeaves,
}: {
  currentBlockId: string
  blockLeaves: IListBlocksLeaf[]
}): React.ReactElement => {
  const [initialPosition] = useState<L.LatLngExpression>([
    -23.5505199, -46.63330939999999,
  ])
  const [layerView, setLayerView] = useState<string>('Normal')

  const [blocksAux, setBlocksAux] = useState<IListBlocks[]>([])

  const [blockLeavesHistorical, setBlockLeavesHistorical] = useState<
    IListBlocksLeaf[]
  >([])

  const layerViews = [
    'Normal',
    'Chuva',
    'Temperatura',
    'Umidade relativa do ar',
  ]

  const rainGrades = [0, 5, 10, 50, 100, 200]
  const temperatureGrades = [5, 10, 20, 30, 40]
  const relativeHumidityGrades = [20, 40, 60, 80, 100]

  useEffect(() => {
    if (blocksAux.length === 0)
      fetch('http://localhost:7010/blocks', {
        headers: {
          'Content-Type': 'application/json',
          Accept: 'application/json',
        },
      }).then((response) => {
        response.json().then((res) => {
          setBlocksAux(res)
        })
      })
  }, [blocksAux])

  useEffect(() => {
    axios
      .get(`http://localhost:7010/historical`)
      .then((response) => {
        setBlockLeavesHistorical(
          response.data.filter(
            (blockLeavesHistorical: IListBlocksLeaf) =>
              blockLeavesHistorical.bounds.length > 4,
          ),
        )
      })
      .catch((error) => console.log(error))
  }, [])
  const getLeafId = useCallback(
    (blockId: string) => {
      let leafId = ''
      let breaker = false

      blocksAux.forEach((item) => {
        if (item.blockId === blockId) {
          if (item.leafParent) {
            leafId = item.blockId

            return leafId
          }
        } else if (item.blockParent === blockId) {
          if (!breaker) {
            if (!item.leafParent) {
              getLeafId(item.blockId)
            } else leafId = item.blockId
            breaker = true
          }
        }
      })

      return leafId
    },
    [blocksAux],
  )
  const getCentroid = useMemo(() => {
    const array: number[] = []
    const leafId = getLeafId(currentBlockId)

    blockLeaves.forEach((item, index) => {
      if (leafId === '') {
        if (index === 0) array.push(...item.centroid)
      } else {
        if (item.blockParent === leafId) array.push(...item.centroid)
      }
    })

    return array
  }, [blockLeaves, currentBlockId, getLeafId])

  const mapCenter = useMemo(() => {
    return {
      lat: getCentroid[1],
      lng: getCentroid[0],
    }
  }, [getCentroid])

  const getRainGradeColor = useCallback((rain: number): string => {
    let color = ''

    switch (true) {
      case rain > 200:
        color = '#08306b'
        break
      case rain > 100:
        color = '#4292c6'
        break
      case rain > 50:
        color = '#9ecae1'
        break
      case rain > 10:
        color = '#c6dbef'
        break
      case rain > 5:
        color = '#deebf7'
        break
      default:
        color = '#f7fbff'
        break
    }

    return color
  }, [])

  const getTemperatureGradeColor = useCallback(
    (temperature: number): string => {
      let color = ''

      switch (true) {
        case temperature > 30:
          color = '#67000d'
          break
        case temperature > 25:
          color = '#a50f15'
          break
        case temperature > 20:
          color = '#cb181d'
          break
        case temperature > 15:
          color = '#ef3b2c'
          break
        case temperature > 10:
          color = '#fb6a4a'
          break
        case temperature > 5:
          color = '#fc9272'
          break
        case temperature > 0:
          color = '#fcbba1'
          break
        case temperature > -5:
          color = '#fee0d2'
          break
        default:
          color = '#fff5f0'
      }

      return color
    },
    [],
  )

  const getRelativeHumidityGradeColor = useCallback(
    (relativeHumidity: number): string => {
      let color = ''

      switch (true) {
        case relativeHumidity > 90:
          color = '#4292c6'
          break
        case relativeHumidity > 80:
          color = '#6baed6'
          break
        case relativeHumidity > 70:
          color = '#9ecae1'
          break
        case relativeHumidity > 60:
          color = '#c6dbef'
          break
        case relativeHumidity > 50:
          color = '#deebf7'
          break
        default:
          color = '#f7fbff'
      }

      return color
    },
    [],
  )

  const getInfoWindowTemplate = useCallback((item: IListBlocksLeaf) => {
    return `<h3 class="h5 fw-bold px-2 mb-1">
              ${item.name}
            </h3>
            <table class="table table-bordered mb-0">
              <tbody>
                <tr>
                  <td>
                    <b>Chuva:</b>
                  </td>
                  <td>
                    ${displayData(item.data.rain, 1, dataUnit.rain)}
                  </td>
                </tr>
                <tr>
                  <td>
                    <b>Temperatura:</b>
                  </td>
                  <td>
                    ${displayData(
                      item.data.temperature,
                      1,
                      dataUnit.temperature,
                    )}
                  </td>
                </tr>
                <tr>
                  <td>
                    <b>Umidade do ar:</b>
                  </td>
                  <td>
                    ${displayData(
                      item.data.relativeHumidity,
                      0,
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
                      1,
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
                      item.data.windSpeed >= 0.3
                        ? displayData(
                            item.data.windSpeed,
                            1,
                            dataUnit.windSpeed,
                          )
                        : '--'
                    }
                  </td>
                </tr>
                <tr>
                  <td>
                    <b>Radiação solar:</b>
                  </td>
                  <td>
                    ${displayData(
                      item.data.solarIrradiation,
                      0,
                      dataUnit.solarRadiation,
                    )}
                  </td>
                </tr>
              </tbody>
            </table>`
  }, [])

  const getLegendTemplate = useCallback(
    (sensorName: string, unit: string, grades: number[]): string => {
      let template = `<h4 class="h6 fw-bold">
                        ${sensorName} (${unit.trim()})
                      </h4>
                      <div class="d-flex flex-column">`
      grades.forEach(
        (grade, index) =>
          (template += `<div class="d-flex align-items-center gap-2">
                          <span class="color-container" style="background:${
                            (sensorName.slice(0, 3).toLowerCase() === 'chu' &&
                              getRainGradeColor(grade)) ||
                            (sensorName.slice(0, 3).toLowerCase() === 'tem' &&
                              getTemperatureGradeColor(grade)) ||
                            (sensorName.slice(0, 3).toLowerCase() === 'umi' &&
                              getRelativeHumidityGradeColor(grade))
                          }"></span>
                          ${
                            grades[index + 1]
                              ? `${grade}&ndash;${grades[index + 1]}`
                              : `&gt; ${grade}`
                          }
                        </div>`),
      )
      template += '</div>'

      return template
    },
    [
      getRainGradeColor,
      getRelativeHumidityGradeColor,
      getTemperatureGradeColor,
    ],
  )

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
      zoom: 5,
      zoomControl: false,
    })

    // const info = new L.Control()

    const legend = new L.Control({
      position: 'bottomright',
    })

    if (layerView === 'Normal')
      blockLeaves.forEach((item) =>
        L.polygon(
          item.bounds.map((itemBound: any) => [itemBound[1], itemBound[0]]),
          {
            color: 'var(--bs-primary)',
            fillColor: 'var(--bs-primary)',
            fillOpacity: 0.2,
            weight: 2,
          },
        )
          .addTo(map)
          .bindPopup(getInfoWindowTemplate(item)),
      )

    if (layerView === 'Chuva')
      blockLeavesHistorical?.forEach((item) => {
        L.polygon(
          item.bounds.map((itemBound: any) => [itemBound[1], itemBound[0]]),
          {
            color: 'var(--bs-white)',
            fillColor: getRainGradeColor(item.data.rain),
            fillOpacity: 1,
            weight: 2,
          },
        )
          // É possivel escolher entre o bindPopup ou mouseover/mouseout
          /* .on('mouseover', () => {
            info.onAdd = () => {
              const div = L.DomUtil.create('div', 'map-area-info')
              div.innerHTML = getInfoWindowTemplate(item)

              return div
            }
            info.addTo(map)
          })
          .on('mouseout', () => {
            info.remove()
          }) */
          .bindPopup(getInfoWindowTemplate(item))
          .addTo(map)

        legend.onAdd = () => {
          const div = L.DomUtil.create('div')
          div.innerHTML = getLegendTemplate('Chuva', dataUnit.rain, rainGrades)

          return div
        }

        legend.addTo(map)
      })

    if (layerView === 'Temperatura')
      blockLeavesHistorical?.forEach((item) => {
        L.polygon(
          item.bounds.map((itemBound: any) => [itemBound[1], itemBound[0]]),
          {
            color: 'var(--bs-white)',
            fillColor: getTemperatureGradeColor(item.data.temperature),
            fillOpacity: 1,
            weight: 2,
          },
        )
          // É possivel escolher entre o bindPopup ou mouseover/mouseout
          /* .on('mouseover', () => {
            info.onAdd = () => {
              const div = L.DomUtil.create('div', 'map-area-info')
              div.innerHTML = getInfoWindowTemplate(item)

              return div
            }
            info.addTo(map)
          })
          .on('mouseout', () => {
            info.remove()
          }) */
          .bindPopup(getInfoWindowTemplate(item))
          .addTo(map)

        legend.onAdd = () => {
          const div = L.DomUtil.create('div')
          div.innerHTML = getLegendTemplate(
            'Temperatura',
            dataUnit.temperature,
            temperatureGrades,
          )

          return div
        }

        legend.addTo(map)
      })

    if (layerView === 'Umidade')
      blockLeavesHistorical?.forEach((item) => {
        L.polygon(
          item.bounds.map((itemBound: any) => [itemBound[1], itemBound[0]]),
          {
            color: 'var(--bs-white)',
            fillColor: getRelativeHumidityGradeColor(
              item.data.relativeHumidity,
            ),
            fillOpacity: 1,
            weight: 2,
          },
        )
          // É possivel escolher entre o bindPopup ou mouseover/mouseout
          /* .on('mouseover', () => {
            info.onAdd = () => {
              const div = L.DomUtil.create('div', 'map-area-info')
              div.innerHTML = getInfoWindowTemplate(item)

              return div
            }
            info.addTo(map)
          })
          .on('mouseout', () => {
            info.remove()
          }) */
          .bindPopup(getInfoWindowTemplate(item))
          .addTo(map)

        legend.onAdd = () => {
          const div = L.DomUtil.create('div')
          div.innerHTML = getLegendTemplate(
            'Umidade',
            dataUnit.relativeHumidity,
            relativeHumidityGrades,
          )

          return div
        }

        legend.addTo(map)
      })

    map.setView(mapCenter.lat === undefined ? initialPosition : mapCenter, 13)

    return () => {
      map.remove()
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [blockLeaves, blockLeavesHistorical, layerView, mapCenter])

  return (
    <div className="map-container">
      <DropdownButton
        title="Camadas do mapa"
        variant="primary"
        size="sm"
        className="map-layers-selector shadow position-absolute"
      >
        {layerViews.map((item) => (
          <Dropdown.Item
            as="button"
            key={item}
            onClick={() => setLayerView(item)}
          >
            {item === 'Normal' ? 'Somente áreas' : item}
          </Dropdown.Item>
        ))}
      </DropdownButton>
      <div id="map" className="h-100 w-100" />
    </div>
  )
}

export default Map
