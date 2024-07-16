import { BridgeKey } from '@/config/chains'
import { RootState } from '@/store'
import { createSelector, createSlice, PayloadAction } from '@reduxjs/toolkit'

// Add fields to RouterQuery as needed
export interface RouterQuery {
  bridge?: BridgeKey | null
}

interface RouterState {
  path: string | null
  query: RouterQuery | null
  loading: boolean
}

const initialState: RouterState = {
  path: null,
  query: null,
  loading: false,
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
  return state.router.query
}

export const selectBridgeKey = createSelector([selectRouterQuery], (routerQuery): BridgeKey => {
  const bridgeKey = routerQuery?.bridge || BridgeKey.MORPH
  return bridgeKey
})

export const routerReducer = routerSlice.reducer
