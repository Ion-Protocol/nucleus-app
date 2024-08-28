import { ChainKey, chainsConfig } from '@/config/chains'
import { tokensConfig } from '@/config/token'
import { TokenKey } from '@/types/TokenKey'
import { RootState } from '@/store'
import { createSelector, createSlice, PayloadAction } from '@reduxjs/toolkit'
import { BridgeKey } from '@/types/BridgeKey'

interface ChainState {
  chainKey: ChainKey | null
  chainId: number | null
}

const initialState: ChainState = {
  chainKey: null,
  chainId: null,
}

const chainSlice = createSlice({
  name: 'chain',
  initialState,
  reducers: {
    setChainId(state, action: PayloadAction<number>) {
      state.chainId = action.payload
    },
  },
})

export const selectChainId = (state: RootState): number | null => {
  return state.chain.chainId
}

export const selectChainKey = createSelector([selectChainId], (chainId): ChainKey | null => {
  const chainKey =
    (Object.keys(chainsConfig).find((key) => chainsConfig[key as ChainKey].id === chainId) as ChainKey) || null
  return chainKey
})

export const { setChainId } = chainSlice.actions
export const chainReducer = chainSlice.reducer
