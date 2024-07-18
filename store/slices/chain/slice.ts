import { ChainKey, chainsConfig } from '@/config/chains'
import { TokenKey, tokensConfig } from '@/config/token'
import { RootState } from '@/store'
import { createSelector, createSlice, PayloadAction } from '@reduxjs/toolkit'

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

// export const selectChain = (state: RootState): ChainKey | null => {
//   return state.chain.chainKey
// }
export const selectChainId = (state: RootState): number | null => {
  return state.chain.chainId
}

export const selectChainKey = createSelector([selectChainId], (chainId): ChainKey | null => {
  return (Object.keys(chainsConfig).find((key) => chainsConfig[key as ChainKey].id === chainId) as ChainKey) || null
})

export const selectToken = (tokenKey: TokenKey | null) =>
  createSelector([selectChainKey], (chain) => {
    if (!chain || !tokenKey) return null
    return tokensConfig[tokenKey].chains[chain]
  })

export const selectTokenAddress = (tokenKey: TokenKey | null) =>
  createSelector([selectChainKey], (chain) => {
    if (!chain || !tokenKey) return null
    return tokensConfig[tokenKey].chains[chain].address
  })

export const { setChainId } = chainSlice.actions
export const chainReducer = chainSlice.reducer
