import rewind from '@mapbox/geojson-rewind'
import * as tj from '@mapbox/togeojson'
import axios from 'axios'
import { NotePencil } from 'phosphor-react'
import { useCallback, useState } from 'react'
import { Button, Form, Modal } from 'react-bootstrap'
import { Root } from '../../../types'
import '../styles/buttons.scss'
import './create.scss'
type Props = {
  blockId: string
  leafParent: boolean
}

function CreateBlock({ blockId, leafParent }: Props) {
  const [bounds, setBounds] = useState<Root>()

  const [show, setShow] = useState(false)
  const handleClose = () => setShow(false)
  const handleShow = () => setShow(true)

  const [name, setName] = useState('')
  const [abrv, setAbrv] = useState('')

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
        setBounds(json)
      }
    }

    reader.readAsText(file) // start reading file
  }

  const parseTextAsKml = (text) => {
    const dom = new DOMParser().parseFromString(text, 'text/xml') // create xml dom object
    const converted = tj.kml(dom) // convert xml dom to geojson
    rewind(converted, false) // correct right hand rule
    console.log(converted)
    setBounds(converted) // save converted geojson to hook state
  }

  const getFileExtension = (file) => {
    const name = file.name
    const lastDot = name.lastIndexOf('.')
    return name.substring(lastDot + 1)
  }
  const arrayCoords = useCallback(
    (id: string) => {
      const arrayCoord: any[] = []
      bounds.features
        .filter((feature) => feature.id === id)
        .forEach((layer) => {
          layer.geometry.coordinates.forEach((feature) => {
            feature.forEach((coord) => {
              arrayCoord.push([coord[0], coord[1]])
            })
          })
        })
      return arrayCoord
    },
    [bounds],
  )

  const arrayCentroid = useCallback(
    (id: string) => {
      const arrayCentroid: any[] = []
      bounds.features
        .filter((feature) => feature.id === id)
        .forEach((layer) => {
          layer.geometry.coordinates.forEach((feature) => {
            feature.forEach((coord) => {
              arrayCentroid.push([coord[0], coord[1]])
            })
          })
        })
      return arrayCentroid[0]
    },
    [bounds],
  )

  const handleCreateKml = useCallback(
    (blockId: string) => {
      bounds.features.forEach((feature) => {
        const newLeaf = {
          blockId: feature.id,
          name: feature.properties.name,
          abrv: feature.properties.name,
          blockParent: blockId,
          leafParent: false,
          date: new Date(),
          data: {
            windSpeed: Math.floor(Math.random() * 100),
            solarIrradiation: Math.floor(Math.random() * 100),
            temperature: Math.floor(Math.random() * 100),
            rain: Math.floor(Math.random() * 100),
            relativeHumidity: Math.floor(Math.random() * 100),
            atmosphericPressure: Math.floor(Math.random() * 100),
          },
          bounds: arrayCoords(feature.id),
          centroid: arrayCentroid(feature.id),
        }
        axios.post(`http://localhost:7010/blockLeaf/`, {
          ...newLeaf,
        })
        axios.post(`http://localhost:7010/historical/`, {
          ...newLeaf,
        })
      })
    },
    [arrayCentroid, arrayCoords, bounds],
  )

  const handleCreateBlockAndKml = useCallback(
    (blockId: string, leafParent: boolean) => {
      const newBlock = {
        blockId: Math.random().toString(36),
        name,
        abrv,
        blockParent: blockId,
        leafParent,
        date: new Date(),
        data: {
          windSpeed: Math.floor(Math.random() * 100),
          solarIrradiation: Math.floor(Math.random() * 100),
          temperature: Math.floor(Math.random() * 100),
          rain: Math.floor(Math.random() * 100),
          relativeHumidity: Math.floor(Math.random() * 100),
          atmosphericPressure: Math.floor(Math.random() * 100),
        },
      }
      if (bounds) {
        axios
          .post(`http://localhost:7010/blocks/`, {
            ...newBlock,
            leafParent: true,
          })
          .then((response) => {
            handleCreateKml(response.data.blockId)
          })
        setShow(false)
      } else {
        axios.post(`http://localhost:7010/blocks/`, {
          ...newBlock,
          leafParent: false,
        })
        setShow(false)
      }
    },
    [abrv, bounds, handleCreateKml, name],
  )

  return (
    <>
      <button className="buttonBody" onClick={handleShow}>
        <NotePencil size={20} alt="Criar" />
      </button>
      <Modal
        show={show}
        onHide={handleClose}
        backdropClassName="backdropContent"
        contentClassName="ModalContent"
      >
        <Modal.Header closeButton style={{ display: 'flex' }}>
          <Modal.Title>Criar Bloco</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form>
            <Form.Group controlId="formBasicEmail">
              <Form.Label>Nome do Bloco</Form.Label>
              <Form.Control
                type="text"
                placeholder="Nome do Bloco"
                className="inputForm"
                onChange={(e) => setName(e.target.value)}
              />
            </Form.Group>
            <Form.Group controlId="formBasicPassword">
              <Form.Label>Abreviação</Form.Label>
              <Form.Control
                type="text"
                placeholder="Abreviação do Bloco"
                className="inputForm"
                onChange={(e) => setAbrv(e.target.value)}
              />
            </Form.Group>
            <Form.Group controlId="formFileSm" className="mb-3">
              <Form.Label className="formLabelBottom">
                Selecione o arquivo com as coordenadas do Bloco (KML)
              </Form.Label>
              <Form.Control
                type="file"
                size="sm"
                onChange={handleFileSelection}
              />
            </Form.Group>
          </Form>
        </Modal.Body>
        <Modal.Footer>
          <Button
            variant="secondary"
            className="buttonClose"
            onClick={handleClose}
          >
            Fechar
          </Button>
          <Button
            variant="primary"
            className="buttonConfirm"
            onClick={() => handleCreateBlockAndKml(blockId, leafParent)}
          >
            Criar Bloco
          </Button>
        </Modal.Footer>
      </Modal>
    </>
  )
}

export default CreateBlock
