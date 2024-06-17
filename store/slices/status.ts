import { RootState } from '@/store'
import { createSelector, createSlice, PayloadAction } from '@reduxjs/toolkit'
import { selectWeEthBalanceLoading } from './balance'
import { selectPriceLoading } from './price'
import { selectBridgesLoading } from './bridges'

interface StatusState {
  error: string | null
  success: string | null
  termsModalOpen: boolean
}

const initialState: StatusState = {
  error: null,
  success: null,
  termsModalOpen: false,
}

const statusSlice = createSlice({
  name: 'status',
  initialState,
  reducers: {
    setError(state, action: PayloadAction<string | null>) {
      state.error = action.payload
    },
    clearError(state) {
      state.error = null
    },
    setSuccess(state, action: PayloadAction<string | null>) {
      state.success = action.payload
    },
    clearSuccess(state) {
      state.success = null
    },
    openTermsModal(state) {
      state.termsModalOpen = true
    },
    closeTermsModal(state) {
      state.termsModalOpen = false
    },
  },
})

// A selector to get global loading state
export const selectLoading = createSelector(
  [selectWeEthBalanceLoading, selectPriceLoading, selectBridgesLoading],
  (balancesLoading, priceLoading, bridgesLoading) => balancesLoading || priceLoading || bridgesLoading
)

export const { setError, clearError, setSuccess, clearSuccess, openTermsModal, closeTermsModal } = statusSlice.actions
export const selectErrorMessage = (state: RootState) => state.status.error
export const selectSuccessMessage = (state: RootState) => state.status.success
export const selectTermsModalOpen = (state: RootState) => state.status.termsModalOpen
export const statusReducer = statusSlice.reducer
