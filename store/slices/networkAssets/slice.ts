import { ChainKey } from '@/types/ChainKey'
import { TokenKey } from '@/types/TokenKey'
import { PayloadAction, createSlice } from '@reduxjs/toolkit'
import { extraReducers } from './extraReducers'
import { initialState } from './initialState'
import { sanitizeDepositInput } from '@/utils/string'

const networkAssetsSlice = createSlice({
  name: 'networkAssets',
  initialState,
  reducers: {
    setSourceChain: (state, action) => {
      state.sourceChain = action.payload
    },
    setRedemptionChain: (state, action) => {
      state.redemptionChain = action.payload
    },
    resetSourceChain: (state) => {
      state.sourceChain = ChainKey.ETHEREUM
    },
    setSelectedSourceToken: (state, action: PayloadAction<{ tokenKey: TokenKey }>) => {
      state.selectedSourceToken = action.payload.tokenKey
    },
    clearSelectedSourceToken: (state) => {
      state.selectedSourceToken = null
    },
    clearPreviewFee: (state) => {
      state.previewFee.data = null
    },
    setTokenRateLoading: (state, action: PayloadAction<boolean>) => {
      state.tokenRate.loading = action.payload
    },
    setDepositAmount: (state, action) => {
      state.depositAmount = sanitizeDepositInput(action.payload, state.depositAmount)
    },
    setDepositAmountBypassDebounce: (state, action) => {
      state.depositAmount = action.payload
    },
    clearDepositAmount: (state) => {
      state.depositAmount = ''
    },
    setRedeemAmount: (state, action) => {
      state.redeemAmount = sanitizeDepositInput(action.payload, state.redeemAmount)
    },
    setReceiveAmount: (state, action) => {
      console.log('setReceiveAmount', action.payload)
      state.receiveAmount = action.payload
    },
    setSelectedReceiveToken: (state, action: PayloadAction<{ tokenKey: TokenKey }>) => {
      state.selectedReceiveToken = action.payload.tokenKey
    },
    setDepositAmountDebounceComplete: () => {}, // only used as an action to trigger a side effect
    setRedeemAmountDebounceComplete: () => {}, // only used as an action to trigger a side effect
    setSolanaAddress: (state, action) => {
      state.solanaAddress = action.payload
    },
  },
  extraReducers,
})

export const {
  resetSourceChain,
  clearDepositAmount,
  clearPreviewFee,
  clearSelectedSourceToken,
  setDepositAmount,
  setDepositAmountBypassDebounce,
  setDepositAmountDebounceComplete,
  setRedeemAmountDebounceComplete,
  setSelectedSourceToken,
  setSelectedReceiveToken,
  setRedeemAmount,
  setRedemptionChain,
  resetRedemptionChain,
  setReceiveAmount,
  setSourceChain,
  setSolanaAddress,
} = networkAssetsSlice.actions
export const networkAssetsReducer = networkAssetsSlice.reducer
