import React, { useState } from 'react'
import * as tj from '@mapbox/togeojson'
import rewind from '@mapbox/geojson-rewind'

function KmlReader() {
  const [layer, setLayer] = useState(null)

  const handleFileSelection = (event) => {
    const file = event.target.files[0] // get file
    console.log(file)
    const ext = getFileExtension(file)
    const reader = new FileReader()

    // on load file end, parse the text read
    reader.onloadend = (event) => {
      const text = event.target.result
      if (ext === 'kml') {
        parseTextAsKml(text)
      } else {
        const json = JSON.parse(text as string)
        rewind(json, false)
        console.log(json)
        setLayer(json)
      }
    }

    reader.readAsText(file) // start reading file
  }

  const parseTextAsKml = (text) => {
    const dom = new DOMParser().parseFromString(text, 'text/xml') // create xml dom object
    const converted = tj.kml(dom) // convert xml dom to geojson
    rewind(converted, false) // correct right hand rule
    console.log(converted.features[0].geometry)
    setLayer(converted) // save converted geojson to hook state
  }

  const getFileExtension = (file) => {
    const name = file.name
    const lastDot = name.lastIndexOf('.')
    return name.substring(lastDot + 1)
  }

  const hashString = (str) => {
    let hash = 0
    let i
    let chr
    for (i = 0; i < Math.min(str.length, 255); i++) {
      chr = str.charCodeAt(i)
      hash = (hash << 5) - hash + chr
      hash |= 0 // Convert to 32bit integer
    }
    return hash
  }

  return (
    <div>
      <input type="file" onChange={handleFileSelection} />
      {layer && (
        <div>
          <h3>Layer</h3>
          <pre>{JSON.stringify(layer, null, 2)}</pre>
        </div>
      )}
    </div>
  )
}

export default KmlReader
