import './map.scss'

import React, { memo, useCallback, useEffect, useMemo, useState } from 'react'
import * as L from 'leaflet'

import useRequestData from '../../hooks/useRequestData'
import { IListBlocks, IListBlocksLeaf } from '../../types'
import { dataUnit, displayData } from '../utils'

import Dropdown from 'react-bootstrap/Dropdown'
import DropdownButton from 'react-bootstrap/DropdownButton'

type MapProps = {
  blockLeaves: IListBlocksLeaf[]
  currentBlockId: string
}

const Map: React.FC<MapProps> = ({
  blockLeaves,
  currentBlockId,
}): React.ReactElement => {
  const [initialPosition] = useState<L.LatLngExpression>([-15.77972, -47.92972])
  const [layerView, setLayerView] = useState<string>('Normal')

  const { data: blocksAux } = useRequestData<IListBlocks[]>('/blocks')

  const { data: blockLeavesHistorical } =
    useRequestData<IListBlocksLeaf[]>('/historical')

  const layerViews = [
    'Normal',
    'Chuva',
    'Temperatura',
    'Umidade relativa do ar',
  ]

  const rainGrades = [0, 5, 10, 50, 100, 200]
  const temperatureGrades = [5, 10, 20, 30, 40]
  const relativeHumidityGrades = [20, 40, 60, 80, 100]

  const getBounds = useCallback((coords: number[]) => {
    const childrenBounds = coords.length > 4

    return childrenBounds
      ? coords.map((coord: any) => {
          return {
            lat: coord[1],
            lng: coord[0],
          }
        })
      : {
          lat: coords[1],
          lng: coords[0],
        }
  }, [])

  const getLeafId = useCallback(
    (blockId: string) => {
      let leafId = ''
      let breaker = false

      blocksAux?.forEach((item) => {
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
      layers: [
        L.tileLayer('http://{s}.google.com/vt/lyrs=s,h&x={x}&y={y}&z={z}', {
          accessToken: import.meta.env.VITE_GOOGLE_MAPS_API_KEY,
          attribution: 'Google',
          maxZoom: 20,
          minZoom: 3,
          subdomains: ['mt0', 'mt1', 'mt2', 'mt3'],
        }),
      ],
      zoomControl: false,
    })

    // const info = new L.Control()

    const legend = new L.Control({
      position: 'bottomright',
    })

    if (layerView === 'Normal')
      blockLeaves.forEach((item) =>
        L.polygon(getBounds(item.bounds) as L.LatLngExpression[], {
          color: 'var(--bs-primary)',
          fillColor: 'var(--bs-primary)',
          fillOpacity: 0.2,
          weight: 2,
        })
          .addTo(map)
          .bindPopup(getInfoWindowTemplate(item)),
      )

    if (layerView === 'Chuva')
      blockLeavesHistorical?.forEach((item) => {
        L.polygon(getBounds(item.bounds) as L.LatLngExpression[], {
          color: 'var(--bs-white)',
          fillColor: getRainGradeColor(item.data.rain),
          fillOpacity: 1,
          weight: 2,
        })
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
        L.polygon(getBounds(item.bounds) as L.LatLngExpression[], {
          color: 'var(--bs-white)',
          fillColor: getTemperatureGradeColor(item.data.temperature),
          fillOpacity: 1,
          weight: 2,
        })
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

    if (layerView === 'Umidade relativa do ar')
      blockLeavesHistorical?.forEach((item) => {
        L.polygon(getBounds(item.bounds) as L.LatLngExpression[], {
          color: 'var(--bs-white)',
          fillColor: getRelativeHumidityGradeColor(item.data.relativeHumidity),
          fillOpacity: 1,
          weight: 2,
        })
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
    <div
      className={`map-container${
        mapCenter.lat === undefined ? ' map-loading' : ''
      }`}
    >
      {mapCenter.lat === undefined ? (
        <div
          className="skeleton-box h-100 w-100"
          tabIndex={0}
          role="progressbar"
          aria-busy="true"
          aria-valuemin={0}
          aria-valuemax={100}
          aria-valuetext="Carregando..."
        />
      ) : (
        <DropdownButton
          title={layerView === 'Normal' ? 'Somente áreas' : layerView}
          variant="primary"
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
      )}
      <div id="map" className="h-100 w-100" />
    </div>
  )
}

export default memo(Map)
