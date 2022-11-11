import './map.scss'

import React, { useEffect, useState } from 'react'
import * as L from 'leaflet'

const Map = (): React.ReactElement => {
  const [initialPosition] = useState<L.LatLngExpression>([
    -23.5505199, -46.63330939999999,
  ])

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
    L.control
      .zoom({
        position: 'topright',
      })
      .addTo(map)

    return () => {
      map.remove()
    }
  }, [initialPosition])

  return <div id="map" className="h-100 w-100" />
}

export default Map
