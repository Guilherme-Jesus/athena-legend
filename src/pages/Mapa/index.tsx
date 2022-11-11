/* eslint-disable no-plusplus */
/* eslint-disable react-hooks/exhaustive-deps */
import * as L from 'leaflet'
import { useEffect, useState } from 'react'

import './map.scss'

function Map() {
  const [initialPosition, setInitialPosition] = useState<[number, number]>([
    -23.5505199, -46.63330939999999,
  ])

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
    L.control
      .zoom({
        position: 'bottomright',
      })
      .addTo(map)

    return () => {
      map.remove()
    }
  }, [initialPosition])

  return <div id="map" style={{ height: '83vh', width: '100%' }} />
}

export default Map
