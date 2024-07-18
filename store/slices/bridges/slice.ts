import { ActionCreatorWithPayload, PayloadAction, createSlice } from '@reduxjs/toolkit'
import { extraReducers } from './extraReducers'
import { initialState } from './initialState'
import { BridgeKey } from '@/config/chains'
import { TokenKey } from '@/config/token'

const bridgesSlice = createSlice({
  name: 'bridges',
  initialState,
  reducers: {
    setSourceChain: (state, action) => {
      state.sourceBridge = action.payload
    },
    setDestinationChain: (state, action) => {
      state.destinationBridge = action.payload
    },
    setInputError: (state, action) => {
      state.inputError = action.payload
    },
    clearInputError: (state) => {
      state.inputError = null
    },
    setSelectedFromToken: (state, action: PayloadAction<{ bridgeKey: BridgeKey | null; tokenKey: TokenKey }>) => {
      const { bridgeKey } = action.payload
      if (!bridgeKey) return
      state.data[bridgeKey].selectedFromToken = action.payload.tokenKey
    },
    setSelectedToToken: (state, action: PayloadAction<{ bridgeKey: BridgeKey; tokenKey: TokenKey | null }>) => {
      state.data[action.payload.bridgeKey].selectedToToken = action.payload.tokenKey
    },
  },
  extraReducers,
})

export const {
  setSourceChain,
  setDestinationChain,
  setInputError,
  clearInputError,
  setSelectedFromToken,
  setSelectedToToken,
} = bridgesSlice.actions
export const bridgesReducer = bridgesSlice.reducer

export namespace Bridges {
  export type TokenPayload =
    | ActionCreatorWithPayload<{ bridgeKey: BridgeKey; tokenKey: TokenKey }, 'bridges/setSelectedToToken'>
    | ActionCreatorWithPayload<{ bridgeKey: BridgeKey; tokenKey: TokenKey }, 'bridges/setSelectedFromToken'>
}
