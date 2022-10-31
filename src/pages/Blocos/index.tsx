import React, { useCallback, useEffect, useState } from 'react'
import useRequestData from '../../hooks/useRequestData'
import { IBlocks } from '../../types/blocks'
import { ILeaf } from '../../types/leaf'

function Blocos() {
  const { data, error, isFetching } = useRequestData<IBlocks[]>('/blocks')
  const [blocks, setBlocks] = useState<IBlocks[]>([])
  const [blockLeafId, setBlockLeafId] = useState<string>('')

  const { data: leaf } = useRequestData<ILeaf[]>(
    `/leaf/?blockParent=${blockLeafId}`,
  )

  useEffect(() => {
    return setBlocks(
      data ? data.filter((item) => item.blockParent === '0') : [],
    )
  }, [data])

  const selectedBlock = useCallback(
    (blockId: string, leafParent: boolean) => {
      if (!leafParent) {
        setBlocks(
          data ? data.filter((block) => block.blockParent === blockId) : [],
        )
      } else {
        setBlockLeafId(blockId)
      }
    },
    [data],
  )

  const backBlocks = useCallback(() => {
    setBlockLeafId('')
    blocks.forEach((item) => {
      const blockItem = data
        ? data.filter((items) => items.blockId === item.blockParent)
        : []
      blockItem.forEach((bck) => {
        setBlocks(
          data
            ? data.filter((items) => items.blockParent === bck.blockParent)
            : [],
        )
      })
    })
  }, [blocks, data])

  return (
    <div>
      <h1>Blocos</h1>
      {isFetching && <p>Carregando...</p>}
      {error && <p>Erro ao carregar os blocos</p>}
      <button
        type="button"
        onClick={() => {
          backBlocks()
        }}
      >
        Voltar
      </button>
      {blocks.map((block) => (
        <div key={block.blockId}>
          <button
            type="button"
            onClick={() => selectedBlock(block.blockId, block.leafParent)}
          >
            {block.name}
          </button>
        </div>
      ))}
      {blockLeafId && (
        <div>
          {leaf?.map((item) => (
            <div key={item.blockId}>
              <button type="button">{item.name}</button>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}

export default Blocos
