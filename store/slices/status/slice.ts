import { RootState } from '@/store'
import { createSelector, createSlice, PayloadAction } from '@reduxjs/toolkit'
import { selectBalancesLoading } from '../balance'
import { selectBridgesLoading } from '../bridges'
import { selectPriceLoading } from '../price'
import { truncateTxHash } from '@/utils/string'

interface StatusState {
  error: {
    title: string | null
    message: string | null
  }
  transaction: {
    successMessage: string | null
    txHash: string | null
  }
  termsModalOpen: boolean
}

const initialState: StatusState = {
  error: {
    title: null,
    message: null,
  },
  transaction: {
    successMessage: null,
    txHash: null,
  },
  termsModalOpen: false,
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
    clearTransactionSuccess(state) {
      state.transaction.successMessage = null
      state.transaction.txHash = null
    },
    openTermsModal(state) {
      state.termsModalOpen = true
    },
    closeTermsModal(state) {
      state.termsModalOpen = false
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
  openTermsModal,
  closeTermsModal,
} = statusSlice.actions
export const selectError = (state: RootState) => state.status.error
export const selectErrorMessage = (state: RootState) => state.status.error.message
export const selectErrorTitle = (state: RootState) => state.status.error.title
export const selectTransactionSuccessMessage = (state: RootState) => state.status.transaction.successMessage
export const selectTermsModalOpen = (state: RootState) => state.status.termsModalOpen
export const statusReducer = statusSlice.reducer
export const selectTransactionSuccessHash = (state: RootState) => state.status.transaction.txHash
export const selectTruncatedTransactionSuccessHash = createSelector(selectTransactionSuccessHash, (txHash) =>
  txHash ? truncateTxHash(txHash) : null
)
