import { createSlice, PayloadAction } from '@reduxjs/toolkit'
import { IListBlocks } from '../../types'

interface Block {
  blocks: IListBlocks[]
  isLoading: boolean
  error: Error | any
}

const initialState: Block = {
  blocks: [],
  isLoading: false,
  error: null,
}

const blockSlice = createSlice({
  name: 'block',
  initialState,
  reducers: {
    changeBlocks: (state, action: PayloadAction<IListBlocks[]>) => {
      state.blocks = action.payload
    },
  },
})

export const { changeBlocks } = blockSlice.actions
export default blockSlice.reducer
