import SortableTree, {
  addNodeUnderParent,
  changeNodeAtPath,
  getFlatDataFromTree,
  getTreeFromFlatData,
  removeNodeAtPath,
  toggleExpandedForAll,
} from '@nosferatu500/react-sortable-tree'
import '@nosferatu500/react-sortable-tree/style.css'
import axios from 'axios'

import { useCallback, useEffect, useState } from 'react'
import { Button, ButtonGroup, InputGroup } from 'react-bootstrap'
import { IListBlocks } from '../../types'

const EditBlocks = () => {
  const [blocks, setBlocks] = useState<IListBlocks[]>([])
  const [searchString, setSearchString] = useState<string>('')
  const [searchFocusIndex, setSearchFocusIndex] = useState<number>(0)
  const handleSearchStringChange = useCallback((event: any) => {
    setSearchString(event.target.value)
  }, [])

  useEffect(() => {
    fetch('http://localhost:7010/blocks')
      .then((response) => response.json())
      .then((response) => setBlocks(response))
  }, [])

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
    setBlocks(expanded)
  }, [someOnlineAdvice.treeData])

  const collapseAll = useCallback(() => {
    const expanded = toggleExpandedForAll({
      treeData: someOnlineAdvice.treeData,
      expanded: false,
    }) as IListBlocks[]
    setBlocks(expanded)
  }, [someOnlineAdvice.treeData])

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
      axios
        .put(`http://localhost:7010/blocks/${block.blockId}`, {
          blockId: block.blockId,
          name: block.name,
          abrv: block.abrv,
          blockParent: block.blockParent.toString(),
          leafParent: block.leafParent,
          date: block.date,
          data: block.data,
        })
        .then((res) => {
          setBlocks(res.data)
          expandAll()
        })
        .catch((err) => {
          console.log(err)
        })
    })
  }, [expandAll, flatData])

  const onChange = (treeData: IListBlocks[]) => {
    setBlocks(treeData)
  }

  const addNode = useCallback(
    (path: number[], blockParent: string) => {
      const newBlocks = addNodeUnderParent({
        treeData: someOnlineAdvice.treeData,
        parentKey: path[path.length - 1],
        expandParent: true,
        getNodeKey: ({ treeIndex }) => treeIndex,
        newNode: {
          blockId: Math.random().toString(36),
          name: 'Nova Área',
          abrv: 'Editar Abreviação',
          blockParent,
          leafParent: false,
          date: new Date().toLocaleDateString(),
          data: {
            windSpeed: Math.floor(Math.random() * 100),
            solarIrradiation: Math.floor(Math.random() * 100),
            temperature: Math.floor(Math.random() * 100),
            rain: Math.floor(Math.random() * 100),
            relativeHumidity: Math.floor(Math.random() * 100),
          },
        },
        addAsFirstChild: true,
      }).treeData as IListBlocks[]
      console.log(newBlocks)
      setBlocks(newBlocks)
    },
    [someOnlineAdvice.treeData],
  )

  const removeNode = useCallback(
    (path: number[]) => {
      const newBlocks = removeNodeAtPath({
        treeData: someOnlineAdvice.treeData,
        path,
        getNodeKey: ({ treeIndex }) => treeIndex,
      }) as IListBlocks[]
      setBlocks(newBlocks)
    },
    [someOnlineAdvice.treeData],
  )

  return (
    <div style={{ height: 800, width: 800 }}>
      <div
        style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          marginBottom: 10,
        }}
      >
        {blocks.length > 0 && (
          <div>
            <Button onClick={expandAll}>Expandir</Button>
            <Button onClick={collapseAll}>Recolher</Button>
            <Button
              onClick={() => {
                handleSave()
              }}
            >
              Salvar
            </Button>
          </div>
        )}
      </div>
      <div>
        <input
          type="text"
          value={searchString}
          onChange={handleSearchStringChange}
          placeholder="Pesquisar"
        />
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
              <Button
                variant="primary"
                onClick={() => {
                  axios.post('http://localhost:7010/blocks', {
                    blockId: Math.random().toString(36),
                    name: 'Nova Área',
                    abrv: 'Editar Abreviação',
                    blockParent: node.blockId,
                    leafParent: false,
                    date: new Date().toLocaleDateString(),
                    data: {
                      windSpeed: Math.floor(Math.random() * 100),
                      solarIrradiation: Math.floor(Math.random() * 100),
                      temperature: Math.floor(Math.random() * 100),
                      rain: Math.floor(Math.random() * 100),
                      relativeHumidity: Math.floor(Math.random() * 100),
                    },
                  })
                  addNode(path, node.blockId)
                }}
              >
                Criar
              </Button>
              <Button
                variant="secondary"
                onClick={() => {
                  axios.delete(`http://localhost:7010/blocks/${node.blockId}`)
                  removeNode(path)
                }}
              >
                Remover
              </Button>
            </ButtonGroup>,
          ],
          title: (
            <InputGroup>
              <input
                type="text"
                value={node.name}
                onChange={(e) => {
                  setBlocks((state) => {
                    const newDaum = changeNodeAtPath({
                      treeData: state,
                      path,
                      getNodeKey: ({ treeIndex }) => treeIndex,
                      newNode: {
                        ...node,
                        name: e.target.value,
                      },
                    }) as IListBlocks[]
                    return newDaum
                  })
                }}
              />
              <input
                type="text"
                value={node.abrv}
                onChange={(e) => {
                  setBlocks((state) => {
                    const newDaum = changeNodeAtPath({
                      treeData: state,
                      path,
                      getNodeKey: ({ treeIndex }) => treeIndex,
                      newNode: {
                        ...node,
                        abrv: e.target.value,
                      },
                    }) as IListBlocks[]
                    return newDaum
                  })
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
