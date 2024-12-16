import { configureStore } from '@reduxjs/toolkit'
import { graphSlice } from './graph'

export const store = configureStore({
  reducer: {
    [graphSlice.reducerPath]: graphSlice.reducer
  }
})

export type RootState = ReturnType<typeof store.getState>
export type AppDispatch = typeof store.dispatch
export type AppStore = typeof store