import { ChainKey } from '@/types/ChainKey'
import { RootState } from '@/store'
import { createSelector, createSlice, PayloadAction } from '@reduxjs/toolkit'

// Add fields to RouterQuery as needed
export interface RouterQuery {
  bridge?: ChainKey | null
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

export const selectChainKeyFromRoute = createSelector([selectRouterQuery], (routerQuery): ChainKey | null => {
  const chainKey = routerQuery?.bridge
  if (!chainKey) return null
  return chainKey
})

export const routerReducer = routerSlice.reducer
