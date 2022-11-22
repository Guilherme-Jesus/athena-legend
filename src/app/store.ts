import { Action, configureStore, ThunkAction } from '@reduxjs/toolkit'
import blockSlice from '../features/blocks/blockSlice'
import { blocksApi } from './services/blocks'

const store = configureStore({
  reducer: {
    blockSlice,
    [blocksApi.reducerPath]: blocksApi.reducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware().concat(blocksApi.middleware),
})

export default store
export type RootState = ReturnType<typeof store.getState>

export type AppDispatch = typeof store.dispatch
export type AppThunk = ThunkAction<void, RootState, null, Action<string>>
