import SortableTree, {
  changeNodeAtPath,
  getFlatDataFromTree,
  getTreeFromFlatData,
  toggleExpandedForAll,
} from '@nosferatu500/react-sortable-tree'
import '@nosferatu500/react-sortable-tree/style.css'

import rewind from '@mapbox/geojson-rewind'
import * as tj from '@mapbox/togeojson'
import { Button } from 'reactstrap'

import axios from 'axios'
import { useCallback, useEffect, useState } from 'react'
import { ButtonGroup, FormControl, InputGroup } from 'react-bootstrap'
import {
  useCreateBlocksMutation,
  useGetBlocksQuery,
  useUpdateBlocksMutation,
} from '../../app/services/blocks'
import { changeBlocks } from '../../features/blocks/blockSlice'
import { useAppDispatch, useAppSelector } from '../../hooks/useTypedSelector'
import { IListBlocks, Root } from '../../types'

// Estilo
import './edit.scss'

// Icones
import { MdSearch } from 'react-icons/md'
import RemoveBlocks from '../../components/Blocks/RemoveBlocks'
import CreateBlock from '../../components/Blocks/CreateBlock'

const EditBlocks = () => {
  const [bounds, setBounds] = useState<Root>()
  const { blocks } = useAppSelector((state) => state.blockSlice)
  const dispatch = useAppDispatch()

  const [searchString, setSearchString] = useState<string>('')
  const [searchFocusIndex, setSearchFocusIndex] = useState<number>(0)
  const handleSearchStringChange = useCallback((event: any) => {
    setSearchString(event.target.value)
  }, [])

  const { data: blocksData } = useGetBlocksQuery()
  const [createBlock] = useCreateBlocksMutation()
  const [updateBlock] = useUpdateBlocksMutation()

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

  // const hashString = (str) => {
  //   let hash = 0
  //   let i
  //   let chr
  //   for (i = 0; i < Math.min(str.length, 255); i++) {
  //     chr = str.charCodeAt(i)
  //     hash = (hash << 5) - hash + chr
  //     hash |= 0 // Convert to 32bit integer
  //   }
  //   return hash
  // }

  useEffect(() => {
    blocksData && dispatch(changeBlocks(blocksData))
  }, [blocksData, dispatch])

  const someOnlineAdvice = {
    treeData: getTreeFromFlatData({
      flatData: blocks.map((node) => ({
        ...node,
        title: node.name,
      })),
      getKey: (node) => node.blockId,
      getParentKey: (node) => node.blockParent,
      rootKey: '0',
    }),
  }

  const expandAll = useCallback(() => {
    const expanded = toggleExpandedForAll({
      treeData: someOnlineAdvice.treeData,
      expanded: true,
    }) as IListBlocks[]
    dispatch(changeBlocks(expanded))
  }, [dispatch, someOnlineAdvice.treeData])

  const collapseAll = useCallback(() => {
    const expanded = toggleExpandedForAll({
      treeData: someOnlineAdvice.treeData,
      expanded: false,
    }) as IListBlocks[]
    dispatch(changeBlocks(expanded))
  }, [dispatch, someOnlineAdvice.treeData])

  const flatData = getFlatDataFromTree({
    treeData: someOnlineAdvice.treeData,
    getNodeKey: ({ node }) => node.blockId, // This ensures your "id" properties are exported in the path
    ignoreCollapsed: false,
  }).map(({ node, path }) => ({
    blockId: node.blockId,
    name: node.name,
    abrv: node.abrv,
    blockParent: path.length > 1 ? path[path.length - 2] : '0',
    data: node.data,
    date: node.date,
    leafParent: node.leafParent,
  }))

  const handleSave = useCallback(() => {
    flatData.forEach((block) => {
      if (block.blockId === '0') {
        createBlock(block as IListBlocks)
      } else {
        updateBlock(block as IListBlocks)
      }
    })
  }, [createBlock, flatData, updateBlock])

  const onChange = (treeData: IListBlocks[]) => {
    dispatch(changeBlocks(treeData))
  }

  const handleCreateBlock = useCallback(
    (blockId: string) => {
      createBlock({
        blockId: Math.random().toString(36),
        name: 'Nova Área',
        abrv: 'Editar Abreviação',
        blockParent: blockId,
        leafParent: true,
        date: new Date(),
        data: {
          windSpeed: Math.floor(Math.random() * 100),
          solarIrradiation: Math.floor(Math.random() * 100),
          temperature: Math.floor(Math.random() * 100),
          rain: Math.floor(Math.random() * 100),
          relativeHumidity: Math.floor(Math.random() * 100),
          atmosphericPressure: Math.floor(Math.random() * 100),
        },
      }).unwrap()
    },
    [createBlock],
  )

  const handleChangeName = useCallback(
    (path: number[], node: any, e: any) => {
      const newBlocks = changeNodeAtPath({
        treeData: someOnlineAdvice.treeData,
        path,
        getNodeKey: ({ treeIndex }) => treeIndex,
        newNode: { ...node, name: e.target.value },
      }) as IListBlocks[]
      dispatch(changeBlocks(newBlocks))
    },
    [dispatch, someOnlineAdvice.treeData],
  )

  const handleChangeAbrv = useCallback(
    (path: number[], node: any, e: any) => {
      const newBlocks = changeNodeAtPath({
        treeData: someOnlineAdvice.treeData,
        path,
        getNodeKey: ({ treeIndex }) => treeIndex,
        newNode: { ...node, abrv: e.target.value },
      }) as IListBlocks[]
      dispatch(changeBlocks(newBlocks))
    },
    [dispatch, someOnlineAdvice.treeData],
  )

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
  return (
    <div className="containerEdit">
      <div>
        {blocks.length > 0 && (
          <div className="headerContainer">
            <span className="textHeader">Gerencie seus Blocos:</span>
            <div className="searchContainer">
              <input
                type="text"
                value={searchString}
                onChange={handleSearchStringChange}
                placeholder="Pesquisar por fazendas"
                className="inputSearch"
              />
              <MdSearch size={20} />
            </div>
            <div className="buttonsContainer">
              <Button onClick={expandAll} className="buttonHeader">
                Expandir
              </Button>
              <Button onClick={collapseAll} className="buttonHeader">
                Recolher
              </Button>
              <Button
                onClick={() => {
                  handleSave()
                }}
                className="buttonHeader"
              >
                Salvar
              </Button>
            </div>
          </div>
        )}
      </div>

      <SortableTree
        searchQuery={searchString}
        searchFocusOffset={searchFocusIndex}
        treeData={someOnlineAdvice.treeData}
        onChange={onChange}
        searchFinishCallback={(matches) =>
          setSearchFocusIndex(
            matches.length > 0 ? searchFocusIndex % matches.length : 0,
          )
        }
        generateNodeProps={({ node, path }) => ({
          buttons: [
            <ButtonGroup key={node.blockId}>
              <input type="file" onChange={handleFileSelection} />
              <Button
                onClick={() => {
                  bounds.features.forEach((feature) => {
                    axios.post(`http://localhost:7010/blockLeaf/`, {
                      blockId: feature.id,
                      name: feature.properties.name,
                      abrv: feature.properties.name,
                      blockParent: node.blockId,
                      leafParent: false,
                      date: node.date,
                      data: node.data,
                      bounds: arrayCoords(feature.id),
                      centroid: arrayCentroid(feature.id),
                    })
                    axios.post(`http://localhost:7010/historical/`, {
                      blockId: feature.id,
                      name: feature.properties.name,
                      abrv: feature.properties.name,
                      blockParent: node.blockId,
                      leafParent: false,
                      date: node.date,
                      data: node.data,
                      bounds: arrayCoords(feature.id),
                      centroid: arrayCentroid(feature.id),
                    })
                  })
                }}
              >
                Upload
              </Button>
              <Button
                variant="primary"
                onClick={() => {
                  handleCreateBlock(node.blockId)
                }}
              >
                Criar
              </Button>
              <RemoveBlocks
                blockId={node.blockId}
                name={node.name}
                blockParent={node.blockParent}
              />
              <CreateBlock
                blockId={node.blockId}
                data={node.data}
                date={node.date}
              />
            </ButtonGroup>,
          ],
          title: (
            <InputGroup>
              <FormControl
                placeholder="Nome"
                aria-label="Nome"
                aria-describedby="basic-addon1"
                value={node.name}
                onChange={(e) => {
                  handleChangeName(path, node, e)
                }}
              />
              <FormControl
                placeholder="Abreviação"
                aria-label="Abreviação"
                aria-describedby="basic-addon1"
                value={node.abrv}
                onChange={(e) => {
                  handleChangeAbrv(path, node, e)
                }}
              />
            </InputGroup>
          ),
        })}
      />
    </div>
  )
}

export default EditBlocks
