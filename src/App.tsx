import './app.scss'
import './components/Map/map.scss'

import React, { useCallback, useEffect, useMemo, useState } from 'react'
import L from 'leaflet'
import axios from 'axios'
import Form from 'react-bootstrap/Form'

import { IHistorical, IListBlocks, IListBlocksLeaf } from './types'
import { dataUnit, displayData } from './components/utils'

import Blocks from './components/Blocks'
import Timeline from './components/Timeline'

const App: React.FC = (): React.ReactElement => {
  const [blocks, setBlocks] = useState<IListBlocks[]>([])
  const [blockAux, setBlockAux] = useState<IListBlocks[]>([])
  const [blockLeaf, setBlockLeaf] = useState<IListBlocksLeaf[]>([])
  const [historical, setHistorical] = useState<IHistorical[]>([])
  const [currentBlockId, setCurrentBlockId] = useState<string>('C19')
  const [initialPosition] = useState<[number, number]>([
    -23.5505199, -46.63330939999999,
  ])
  const [sensors, setSensors] = useState<string>('Normal')

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
      blockAux.forEach((item) => {
        if (item.blockId === blockId) {
          if (item.leafParent) {
            arrayS = item.blockId
            return arrayS
          }
        } else if (item.blockParent === blockId) {
          if (breaker === false) {
            if (!item.leafParent) {
              getLeaf(item.blockId)
            } else arrayS = item.blockId
            breaker = true
          }
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
    console.log(currentBlockId)
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

  const rainGrades: number[] = [0, 5, 10, 50, 100, 200]
  const temperatureGrades: number[] = [5, 10, 20, 30, 40]
  const relativeHumidityGrades: number[] = [20, 40, 60, 80, 100]

  const getColorRain = useCallback((rain: number): string => {
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

  const getColorTemperature = useCallback((temp: number): string => {
    return temp > 30
      ? '#67000d'
      : temp > 25
      ? '#a50f15'
      : temp > 20
      ? '#cb181d'
      : temp > 15
      ? '#ef3b2c'
      : temp > 10
      ? '#fb6a4a'
      : temp > 5
      ? '#fc9272'
      : temp > 0
      ? '#fcbba1'
      : temp > -5
      ? '#fee0d2'
      : '#fff5f0'
  }, [])

  const getColorHumidity = useCallback((relativeHumidity: number): string => {
    let color = ''

    switch (true) {
      case relativeHumidity > 100:
        color = '#4292c6'
        break
      case relativeHumidity > 90:
        color = '#6baed6'
        break
      case relativeHumidity > 80:
        color = '#9ecae1'
        break
      case relativeHumidity > 70:
        color = '#c6dbef'
        break
      case relativeHumidity > 60:
        color = '#deebf7'
        break
      default:
        color = '#f7fbff'
    }

    return color
  }, [])

  const selectedSensors = [
    'Normal',
    'Chuva',
    'Temperatura',
    'Umidade relativa do ar',
  ]

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

    const info = new L.Control()
    const legend = new L.Control({
      position: 'bottomright',
    })

    if (sensors === 'Normal') {
      blockLeaf.forEach((item) => {
        const polygon = L.polygon(
          item.bounds.map((item: any) => [item[1], item[0]]),
          {
            color: 'var(--bs-primary)',
            fillColor: 'var(--bs-primary)',
            fillOpacity: 0.2,
            weight: 2,
          },
        ).addTo(map)

        polygon.bindPopup(`
          <h3 class="h6 fw-bold px-2 mb-1">
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
                  ${displayData(item.data.temperature, 1, dataUnit.temperature)}
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
                      ? displayData(item.data.windSpeed, 1, dataUnit.windSpeed)
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
          </table>
        `)
      })
    }

    if (sensors === 'Chuva') {
      historical?.forEach((item) => {
        L.polygon(
          item.bounds.map((item: any) => [item[1], item[0]]),
          {
            color: 'var(--bs-white)',
            fillColor: getColorRain(item.data.rain),
            fillOpacity: 1,
            weight: 2,
          },
        )

          /// É possivel escolher entre o bindPopup e ou mouseover/mouseout

          .on('mouseover', () => {
            info.onAdd = () => {
              const div = L.DomUtil.create('div', 'map-area-info')
              div.innerHTML = `
                <h3 class="h5 fw-bold px-2 mb-1">
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
                </table>
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
            <h3 class="h6 fw-bold px-2 mb-1">
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
            </table>
          `,
          )
          .addTo(map)

        legend.onAdd = () => {
          const div = L.DomUtil.create('div')
          const labels = [
            `<h4 class="d-block h6 fw-bold mb-0">Chuva (${dataUnit.rain.trim()})</h4>`,
          ]
          rainGrades.forEach((grade, index) => {
            labels.push(
              `<span class="color-container" style="background:${getColorRain(
                grade,
              )}"></span> ${
                rainGrades[index + 1]
                  ? `${grade}&ndash;${rainGrades[index + 1]}`
                  : `> ${grade}`
              }`,
            )
          })
          div.innerHTML = labels.join('<br>')
          return div
        }
        legend.addTo(map)
      })
    }

    if (sensors === 'Temperatura') {
      historical?.forEach((item) => {
        L.polygon(
          item.bounds.map((item: any) => [item[1], item[0]]),
          {
            color: 'var(--bs-white)',
            fillColor: getColorTemperature(item.data.temperature),
            fillOpacity: 1,
            weight: 2,
          },
        )

          /// É possivel escolher entre o bindPopup e ou mouseover/mouseout

          .on('mouseover', () => {
            info.onAdd = () => {
              const div = L.DomUtil.create('div', 'map-area-info')
              div.innerHTML = `
                <h3 class="h5 fw-bold px-2 mb-1">
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
                </table>
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
            <h3 class="h6 fw-bold px-2 mb-1">
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
            </table>
          `,
          )
          .addTo(map)

        legend.onAdd = () => {
          const div = L.DomUtil.create('div')
          const labels = [
            `<span class="d-block h6 fw-bold mb-0">Temperatura (${dataUnit.temperature.trim()})</span>`,
          ]
          temperatureGrades.forEach((grade, index) => {
            labels.push(
              `<span class="color-container" style="background:${getColorTemperature(
                grade,
              )}"></span> ${
                temperatureGrades[index + 1]
                  ? `${grade}&ndash;${temperatureGrades[index + 1]}`
                  : `> ${grade}`
              }`,
            )
          })
          div.innerHTML = labels.join('<br>')
          return div
        }
        legend.addTo(map)
      })
    }

    if (sensors === 'Umidade') {
      historical?.forEach((item) => {
        L.polygon(
          item.bounds.map((item: any) => [item[1], item[0]]),
          {
            color: 'var(--bs-white)',
            fillColor: getColorHumidity(item.data.relativeHumidity),
            fillOpacity: 1,
            weight: 2,
          },
        )

          /// É possivel escolher entre o bindPopup e ou mouseover/mouseout

          .on('mouseover', () => {
            info.onAdd = () => {
              const div = L.DomUtil.create('div', 'map-area-info')
              div.innerHTML = `
                <h3 class="h5 fw-bold px-2 mb-1">
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
                </table>
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
            <h3 class="h6 fw-bold px-2 mb-1">
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
            </table>
          `,
          )
          .addTo(map)

        legend.onAdd = () => {
          const div = L.DomUtil.create('div')
          const labels = [
            `<span class="d-block h6 fw-bold mb-0">Umidade (${dataUnit.relativeHumidity.trim()})</span>`,
          ]
          relativeHumidityGrades.forEach((grade, index) => {
            labels.push(
              `<span class="color-container" style="background:${getColorHumidity(
                grade,
              )}"></span> ${
                relativeHumidityGrades[index + 1]
                  ? `${grade}&ndash;${relativeHumidityGrades[index + 1]}`
                  : `> ${grade}`
              }`,
            )
          })
          div.innerHTML = labels.join('<br>')
          return div
        }
        legend.addTo(map)
      })
    }

    map.setView(center.lat === undefined ? initialPosition : center, 13)

    return () => {
      map.remove()
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [
    blockLeaf,
    center,
    getColorHumidity,
    getColorRain,
    getColorTemperature,
    historical,
    initialPosition,
    sensors,
  ])

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

      <Timeline />

      <div className="map-container">
        <Form.Select
          className="heat-map-selector shadow position-absolute"
          onChange={(e) => {
            setSensors(e.target.value)
          }}
        >
          {selectedSensors.map((item) => (
            <option key={item} value={item} selected={item === 'Normal'}>
              {item}
            </option>
          ))}
        </Form.Select>
        <div id="map" className="h-100 w-100" />
      </div>
    </div>
  )
}

export default App
