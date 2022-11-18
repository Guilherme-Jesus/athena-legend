import SortableTree, {
  addNodeUnderParent,
  changeNodeAtPath,
  removeNodeAtPath,
  toggleExpandedForAll,
} from '@nosferatu500/react-sortable-tree'
import '@nosferatu500/react-sortable-tree/style.css'
import axios from 'axios'
import React, { useCallback, useEffect, useState } from 'react'
import { Button, InputGroup } from 'react-bootstrap'
import { Daum } from '../../types'

function CustomNosferatu() {
  const [daum, setDaum] = useState<Daum[]>([])
  const [searchString, setSearchString] = useState<string>('')
  const [searchFocusIndex, setSearchFocusIndex] = useState<number>(0)
  const [updateDaum, setUpdateDaum] = useState<Daum[]>([])

  useEffect(() => {
    axios.get('http://localhost:7010/data').then((res) => {
      setDaum(res.data)
    })
  }, [])

  const handleSearchStringChange = useCallback(
    (event: React.ChangeEvent<HTMLInputElement>) => {
      setSearchString(event.target.value)
    },
    [],
  )

  const handleChange = (daum: Daum[]) => {
    setUpdateDaum(daum)
    setDaum(daum)
  }
  console.log(updateDaum)

  const expandAll = useCallback(() => {
    const expanded = toggleExpandedForAll({
      treeData: daum,
      expanded: true,
    }) as Daum[]
    setDaum(expanded)
  }, [daum])

  const collapseAll = useCallback(() => {
    const expanded = toggleExpandedForAll({
      treeData: daum,
      expanded: false,
    }) as Daum[]
    setDaum(expanded)
  }, [daum])

  const handleSave = useCallback(() => {
    if (updateDaum.length > 0) {
      axios
        .put(`http://localhost:7010/data/${updateDaum[0].id}`, {
          id: updateDaum[0].id,
          title: updateDaum[0].title,
          subtitle: updateDaum[0].subtitle,
          blockParent: updateDaum[0].blockParent,
          leafParent: updateDaum[0].leafParent,
          date: updateDaum[0].date,
          data: updateDaum[0].data,
          children: updateDaum[0].children,
        })
        .then((res) => {
          setUpdateDaum(res.data)
          expandAll()
        })
        .catch((err) => {
          console.log(err)
        })
    }
  }, [expandAll, updateDaum])

  const addNode = useCallback((daum: Daum[], path: number[]) => {
    const newDaum = addNodeUnderParent({
      treeData: daum,
      parentKey: path[path.length - 1],
      expandParent: true,
      getNodeKey: ({ treeIndex }) => treeIndex,
      newNode: {
        title: 'Nova Área',
        children: [],
        subtitle: 'Nova Área',
      },
      addAsFirstChild: true,
    }).treeData as Daum[]
    setDaum(newDaum)
    setUpdateDaum(newDaum)
  }, [])

  const removeNode = useCallback((daum: Daum[], path: number[]) => {
    const newDaum = removeNodeAtPath({
      treeData: daum,
      path,
      getNodeKey: ({ treeIndex }) => treeIndex,
    }) as Daum[]
    setDaum(newDaum as Daum[])
    setUpdateDaum(newDaum)
  }, [])

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
        {daum.length > 0 && (
          <div>
            <Button onClick={expandAll}>Expandir</Button>
            <Button onClick={collapseAll}>Recolher</Button>
            <Button
              onClick={() => {
                handleSave()
              }}
            >
              Save
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
        treeData={daum}
        onChange={handleChange}
        searchFinishCallback={(matches) =>
          setSearchFocusIndex(
            matches.length > 0 ? searchFocusIndex % matches.length : 0,
          )
        }
        generateNodeProps={({ node, path }) => ({
          buttons: [
            <Button
              key={node.id}
              variant="primary"
              onClick={() => {
                addNode(daum, path)
              }}
            >
              Criar
            </Button>,
            <Button
              key={node.id}
              variant="secondary"
              onClick={() => {
                removeNode(daum, path)
              }}
            >
              Remover
            </Button>,
          ],
          title: (
            <InputGroup>
              <input
                type="text"
                value={node.title}
                onChange={(e) => {
                  setDaum((state) => {
                    const newDaum = changeNodeAtPath({
                      treeData: state,
                      path,
                      getNodeKey: ({ treeIndex }) => treeIndex,
                      newNode: {
                        ...node,
                        title: e.target.value,
                      },
                    }) as Daum[]
                    setUpdateDaum(newDaum)
                    return newDaum
                  })
                }}
              />
              <input
                type="text"
                value={node.subtitle}
                onChange={(e) => {
                  setDaum((state) => {
                    const newDaum = changeNodeAtPath({
                      treeData: state,
                      path,
                      getNodeKey: ({ treeIndex }) => treeIndex,
                      newNode: {
                        ...node,
                        subtitle: e.target.value,
                      },
                    }) as Daum[]
                    setUpdateDaum(newDaum)
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

export default CustomNosferatu
