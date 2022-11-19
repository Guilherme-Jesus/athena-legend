import SortableTree, {
  getFlatDataFromTree,
  getTreeFromFlatData,
} from '@nosferatu500/react-sortable-tree'
import '@nosferatu500/react-sortable-tree/style.css'
import axios from 'axios'
import { useEffect, useState } from 'react'
import { IListBlocks } from '../../types'

function EditBlocks() {
  const [blocks, setBlocks] = useState<IListBlocks[]>([])

  useEffect(() => {
    axios.get('http://localhost:7010/blocks').then((res) => {
      setBlocks(res.data)
    })
  }, [])

  const handleChange = (blocks: IListBlocks[]) => {
    setBlocks(blocks)
  }

  const someOnlineAdvice = {
    treeData: getTreeFromFlatData({
      flatData: blocks.map((node) => ({ ...node, title: node.name })),
      getKey: (node) => node.blockId,
      getParentKey: (node) => node.blockParent,
      rootKey: '0',
    }),
  }

  const flatData = getFlatDataFromTree({
    treeData: someOnlineAdvice.treeData,
    getNodeKey: ({ node }) => node.blockId,
    ignoreCollapsed: false,
  }).map(({ node, path }) => ({
    blockId: node.blockId, // The node's ID
    name: node.name, // The node's title
    blockParent: path.length > 1 ? path[path.length - 2] : null, // The parent ID
  }))
  console.log(flatData)

  return (
    <div style={{ height: 800, width: 800 }}>
      <SortableTree
        treeData={someOnlineAdvice.treeData}
        onChange={handleChange}
      />
    </div>
  )
}

export default EditBlocks
