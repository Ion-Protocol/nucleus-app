import { BridgeKey } from '@/config/bridges'
import { RootState } from '@/store'
import { createSlice, PayloadAction } from '@reduxjs/toolkit'

// Add fields to RouterQuery as needed
export interface RouterQuery {
  bridge?: BridgeKey | null
}

interface RouterState {
  path: string | null
  query: RouterQuery
}

const initialState: RouterState = {
  path: null,
  query: {
    bridge: null,
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
    setQuery(state, action: PayloadAction<RouterQuery>) {
      state.query = action.payload
    },
  },
})

export const { setPath, clearPath, setQuery } = routerSlice.actions
export const selectRouterPath = (state: RootState) => state.router.path
export const selectRouterQuery = (state: RootState) => state.router.query
export const selectBridgeKey = (state: RootState) => state.router.query.bridge

export const routerReducer = routerSlice.reducer
