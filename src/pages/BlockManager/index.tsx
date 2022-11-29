import SortableTree, {
  changeNodeAtPath,
  getFlatDataFromTree,
  getTreeFromFlatData,
  toggleExpandedForAll,
} from '@nosferatu500/react-sortable-tree'
import '@nosferatu500/react-sortable-tree/style.css'

import { Button } from 'reactstrap'

import { useCallback, useEffect, useState } from 'react'
import { ButtonGroup, FormControl, InputGroup } from 'react-bootstrap'
import {
  useGetBlocksQuery,
  useUpdateBlocksMutation,
} from '../../app/services/blocks'
import { changeBlocks } from '../../features/blocks/blockSlice'
import { useAppDispatch, useAppSelector } from '../../hooks/useTypedSelector'
import { IListBlocks } from '../../types'

// Estilo
import './styles/edit.scss'
import './styles/droppable.scss'

// Icones
import { MagnifyingGlass } from 'phosphor-react'
import CreateBlock from '../../components/Blocks/CreateBlock'
import RemoveBlocks from '../../components/Blocks/RemoveBlocks'

const EditBlocks = () => {
  const { blocks } = useAppSelector((state) => state.blockSlice)
  const dispatch = useAppDispatch()

  const [searchString, setSearchString] = useState<string>('')
  const [searchFocusIndex, setSearchFocusIndex] = useState<number>(0)
  const handleSearchStringChange = useCallback((event: any) => {
    setSearchString(event.target.value)
  }, [])

  const { data: blocksData } = useGetBlocksQuery()
  const [updateBlock] = useUpdateBlocksMutation()

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
      updateBlock(block as IListBlocks)
    })
  }, [flatData, updateBlock])

  const onChange = (treeData: IListBlocks[]) => {
    dispatch(changeBlocks(treeData))
  }

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
              <MagnifyingGlass size={24} />
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
        canDrag={({ node }) => node.blockParent !== '0'}
        onDragStateChanged={({ isDragging }) => {
          if (!isDragging) {
            handleSave()
          }
        }}
        onChange={onChange}
        searchFinishCallback={(matches) =>
          setSearchFocusIndex(
            matches.length > 0 ? searchFocusIndex % matches.length : 0,
          )
        }
        generateNodeProps={({ node, path }) => ({
          buttons: [
            <ButtonGroup key={node.blockId}>
              <RemoveBlocks
                blockId={node.blockId}
                name={node.name}
                blockParent={node.blockParent}
              />
              <CreateBlock blockId={node.blockId} />
            </ButtonGroup>,
          ],
          title: (
            <div className="inputFormFarm">
              <div>
                <input
                  className="inputFarm"
                  placeholder="Nome"
                  aria-label="Nome"
                  aria-describedby="basic-addon1"
                  value={node.name}
                  onChange={(e) => {
                    handleChangeName(path, node, e)
                  }}
                />
              </div>
              <div>
                <input
                  className="inputAbrv"
                  placeholder="Abreviação"
                  aria-label="Abreviação"
                  aria-describedby="basic-addon1"
                  value={node.abrv}
                  onChange={(e) => {
                    handleChangeAbrv(path, node, e)
                  }}
                />
              </div>
            </div>
          ),
        })}
      />
    </div>
  )
}

export default EditBlocks
