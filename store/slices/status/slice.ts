import { RootState } from '@/store'
import { truncateTxHash } from '@/utils/string'
import { createSelector, createSlice, PayloadAction } from '@reduxjs/toolkit'

interface StatusState {
  error: {
    title: string | null
    message: string | null
  }
  transaction: {
    successMessage: string | null
    txHash: string | null
    explorerUrl: string | null
  }
  termsAccepted: boolean
}

const initialState: StatusState = {
  error: {
    title: null,
    message: null,
  },
  transaction: {
    successMessage: null,
    txHash: null,
    explorerUrl: null,
  },
  termsAccepted: false,
}

const statusSlice = createSlice({
  name: 'status',
  initialState,
  reducers: {
    setErrorMessage(state, action: PayloadAction<string | null>) {
      state.error.message = action.payload
    },
    setErrorTitle(state, action: PayloadAction<string | null>) {
      state.error.title = action.payload
    },
    clearError(state) {
      state.error = { title: null, message: null }
    },
    setTransactionSuccessMessage(state, action: PayloadAction<string | null>) {
      state.transaction.successMessage = action.payload
    },
    setTransactionTxHash(state, action: PayloadAction<string | null>) {
      state.transaction.txHash = action.payload
    },
    setTransactionExplorerUrl(state, action: PayloadAction<string | null>) {
      state.transaction.explorerUrl = action.payload
    },
    clearTransactionSuccess(state) {
      state.transaction.successMessage = null
      state.transaction.txHash = null
    },
    acceptTerms(state) {
      state.termsAccepted = true
    },
    setTermsAccepted(state, action: PayloadAction<boolean>) {
      state.termsAccepted = action.payload
    },
  },
})

export const {
  setErrorMessage,
  setErrorTitle,
  clearError,
  setTransactionSuccessMessage,
  setTransactionTxHash,
  clearTransactionSuccess,
  setTransactionExplorerUrl,
  acceptTerms,
  setTermsAccepted,
} = statusSlice.actions
export const selectError = (state: RootState) => state.status.error
export const selectErrorMessage = (state: RootState) => state.status.error.message
export const selectErrorTitle = (state: RootState) => state.status.error.title
export const selectTransactionSuccessMessage = (state: RootState) => state.status.transaction.successMessage
export const selectTermsAccepted = (state: RootState) => state.status.termsAccepted
export const statusReducer = statusSlice.reducer
export const selectTransactionSuccessHash = (state: RootState) => state.status.transaction.txHash
export const selectTransactionExplorerUrl = (state: RootState) => state.status.transaction.explorerUrl
export const selectTruncatedTransactionSuccessHash = createSelector(selectTransactionSuccessHash, (txHash) =>
  txHash ? truncateTxHash(txHash) : null
)
