import { ActionCreatorWithPayload, PayloadAction, createSlice } from '@reduxjs/toolkit'
import { extraReducers } from './extraReducers'
import { initialState } from './initialState'
import { BridgeKey } from '@/types/BridgeKey'
import { TokenKey } from '@/types/TokenKey'

const bridgesSlice = createSlice({
  name: 'bridges',
  initialState,
  reducers: {
    setSourceChain: (state, action) => {
      state.sourceBridge = action.payload
    },
    resetSourceChain: (state) => {
      state.sourceBridge = BridgeKey.ETHEREUM
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
    setSelectedFromToken: (state, action: PayloadAction<{ tokenKey: TokenKey }>) => {
      state.selectedFromToken = action.payload.tokenKey
    },
    clearSelectedFromToken: (state) => {
      state.selectedFromToken = null
    },
    clearPreviewFee: (state) => {
      state.previewFee = null
    },
    setInputValue: (state, action) => {
      state.inputValue = action.payload
    },
    clearInputValue: (state) => {
      state.inputValue = ''
    },
    setInputValueDebounceComplete: () => {}, // only used as an action to trigger a side effect
  },
  extraReducers,
})

export const {
  clearInputError,
  resetSourceChain,
  clearInputValue,
  clearPreviewFee,
  clearSelectedFromToken,
  setDestinationChain,
  setInputError,
  setInputValue,
  setInputValueDebounceComplete,
  setSelectedFromToken,
  setSourceChain,
} = bridgesSlice.actions
export const bridgesReducer = bridgesSlice.reducer
