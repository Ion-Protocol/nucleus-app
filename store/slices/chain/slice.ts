import { ChainKey } from '@/config/chains'
import { RootState } from '@/store'
import { createSelector, createSlice, PayloadAction } from '@reduxjs/toolkit'
import { selectChainConfig } from '../bridges'

interface ChainState {
  chainKey: ChainKey
  chainId: number
}

const initialState: ChainState = {
  chainKey: ChainKey.MAINNET,
  chainId: 1,
}

const chainSlice = createSlice({
  name: 'chain',
  initialState,
  reducers: {
    setChainKey(state, action: PayloadAction<ChainKey>) {
      state.chainKey = action.payload
    },
    setChainId(state, action: PayloadAction<number>) {
      state.chainId = action.payload
    },
  },
})

export const selectChain = (state: RootState) => {
  if (!state) return ChainKey.MAINNET
  return state.chain.chainKey
}
export const selectChainId = (state: RootState) => {
  if (!state) return 1
  return state.chain.chainId
}
export const { setChainKey, setChainId } = chainSlice.actions
export const chainReducer = chainSlice.reducer
