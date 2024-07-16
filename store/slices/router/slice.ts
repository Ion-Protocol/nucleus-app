import { BridgeKey } from '@/config/bridges'
import { RootState } from '@/store'
import { createSelector, createSlice, PayloadAction } from '@reduxjs/toolkit'

// Add fields to RouterQuery as needed
export interface RouterQuery {
  bridge?: BridgeKey | null
}

interface RouterState {
  path: string | null
  query: RouterQuery | null
}

const initialState: RouterState = {
  path: null,
  query: null,
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

export const selectRouterQuery = (state: RootState) => {
  if (!state.router.query) {
    throw new Error(`Router query not found. It's possible it just hasn't loaded yet.`)
  }
  return state.router.query
}

export const selectBridgeKey = createSelector([selectRouterQuery], (routerQuery) => {
  const bridgeKey = routerQuery.bridge
  if (!bridgeKey) {
    throw new Error(`Bridge key not found in router query. It's possible it just hasn't loaded yet.`)
  }
  return bridgeKey
})

export const routerReducer = routerSlice.reducer
