import { BridgeKey } from '@/config/bridges'
import { RootState } from '@/store'
import { createSlice, PayloadAction } from '@reduxjs/toolkit'

// Add fields to RouterQuery as needed
export interface RouterQuery {
  bridge?: BridgeKey
}

interface RouterState {
  path: string | null
  query: RouterQuery | null
}

const initialState: RouterState = {
  path: null,
  query: {
    bridge: BridgeKey.SEI,
  },
}

const routerSlice = createSlice({
  name: 'router',
  initialState,
  reducers: {
    setPath(state, action: PayloadAction<string | null>) {
      state.path = action.payload
    },
    clearPath(state) {
      state.path = null
    },
    setQuery(state, action: PayloadAction<RouterQuery | null>) {
      state.query = action.payload
    },
    clearQuery(state) {
      state.query = null
    },
  },
})

export const { setPath, clearPath, setQuery, clearQuery } = routerSlice.actions
export const selectRouterPath = (state: RootState) => state.router.path
export const selectRouterQuery = (state: RootState) => state.router.query

export const routerReducer = routerSlice.reducer
