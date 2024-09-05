import { NetworkKey, networksConfig } from '@/config/networks'
import { RootState } from '@/store'
import { createSelector, createSlice, PayloadAction } from '@reduxjs/toolkit'

interface NetworkState {
  networkKey: NetworkKey | null
  networkId: number | null
}

const initialState: NetworkState = {
  networkKey: null,
  networkId: null,
}

const networkSlice = createSlice({
  name: 'network',
  initialState,
  reducers: {
    setNetworkId(state, action: PayloadAction<number>) {
      state.networkId = action.payload
    },
  },
})

export const selectNetworkId = (state: RootState): number | null => {
  return state.network.networkId
}

export const selectNetworkKey = createSelector([selectNetworkId], (networkId): NetworkKey | null => {
  const networkKey =
    (Object.keys(networksConfig).find((key) => networksConfig[key as NetworkKey].id === networkId) as NetworkKey) ||
    null
  return networkKey
})

export const { setNetworkId } = networkSlice.actions
export const networkReducer = networkSlice.reducer
