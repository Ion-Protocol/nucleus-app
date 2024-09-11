import { ChainKey } from '@/types/ChainKey'
import { TokenKey } from '@/types/TokenKey'
import { PayloadAction, createSlice } from '@reduxjs/toolkit'
import { extraReducers } from './extraReducers'
import { initialState } from './initialState'
import { sanitizeDepositInput } from '@/utils/string'

const bridgesSlice = createSlice({
  name: 'bridges',
  initialState,
  reducers: {
    setSourceChain: (state, action) => {
      state.sourceChain = action.payload
    },
    resetSourceChain: (state) => {
      state.sourceChain = ChainKey.ETHEREUM
    },
    setDestinationChain: (state, action) => {
      state.destinationChain = action.payload
    },
    setSelectedFromToken: (state, action: PayloadAction<{ tokenKey: TokenKey }>) => {
      state.selectedSourceToken = action.payload.tokenKey
    },
    clearSelectedFromToken: (state) => {
      state.selectedSourceToken = null
    },
    clearPreviewFee: (state) => {
      state.previewFee = null
    },
    setTokenRateInQuoteLoading: (state, action: PayloadAction<boolean>) => {
      state.tokenRateInQuoteLoading = action.payload
    },
    setInputValue: (state, action) => {
      state.depositAmount = sanitizeDepositInput(action.payload, state.depositAmount)
    },
    setInputValueBypassDebounce: (state, action) => {
      state.depositAmount = action.payload
    },
    clearInputValue: (state) => {
      state.depositAmount = ''
    },
    setInputValueDebounceComplete: () => {}, // only used as an action to trigger a side effect
  },
  extraReducers,
})

export const {
  resetSourceChain,
  clearInputValue,
  clearPreviewFee,
  clearSelectedFromToken,
  setDestinationChain,
  setInputValue,
  setInputValueBypassDebounce,
  setInputValueDebounceComplete,
  setSelectedFromToken,
  setSourceChain,
} = bridgesSlice.actions
export const bridgesReducer = bridgesSlice.reducer
