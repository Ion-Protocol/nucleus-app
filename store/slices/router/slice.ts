import { ChainKey } from '@/types/ChainKey'
import { RootState } from '@/store'
import { createSelector, createSlice, PayloadAction } from '@reduxjs/toolkit'
import { TokenKey } from '@/types/TokenKey'

// Add fields to RouterQuery as needed
export interface RouterQuery {
  token?: TokenKey | null
}

interface RouterState {
  path: string | null
  query: RouterQuery | null
  ready: boolean
}

const initialState: RouterState = {
  path: null,
  query: null,
  ready: false,
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
    setRouterReady(state, action: PayloadAction<boolean>) {
      state.ready = action.payload
    },
  },
})

export const { setPath, clearPath, setQuery, setRouterReady } = routerSlice.actions
export const selectRouterPath = (state: RootState) => state.router.path
export const selectRouterReady = (state: RootState) => state.router.ready

export const selectRouterQuery = (state: RootState) => {
  return state.router.query
}

export const selectNetworkAssetFromRoute = (state: RootState): TokenKey | null => {
  const routerQuery = selectRouterQuery(state)
  const tokenKey = routerQuery?.token || localStorage.getItem('networkAsset')
  if (!tokenKey) return null
  return tokenKey as TokenKey
}

export const routerReducer = routerSlice.reducer
