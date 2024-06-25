import { RootState } from '@/store'
import { createSelector, createSlice, PayloadAction } from '@reduxjs/toolkit'
import { selectPriceLoading } from '../price'
import { selectBridgesLoading } from '../bridges'
import { selectNetApyLoading } from '../netApy'
import { selectBalancesLoading } from '../balance'

interface StatusState {
  error: {
    title: string | null
    message: string | null
  }
  success: string | null
  termsModalOpen: boolean
}

const initialState: StatusState = {
  error: {
    title: null,
    message: null,
  },
  success: null,
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
  [selectBalancesLoading, selectPriceLoading, selectBridgesLoading],
  (balancesLoading, priceLoading, bridgesLoading) => balancesLoading || priceLoading || bridgesLoading
)

export const { setErrorMessage, setErrorTitle, clearError, setSuccess, clearSuccess, openTermsModal, closeTermsModal } =
  statusSlice.actions
export const selectError = (state: RootState) => state.status.error
export const selectErrorMessage = (state: RootState) => state.status.error.message
export const selectErrorTitle = (state: RootState) => state.status.error.title
export const selectSuccessMessage = (state: RootState) => state.status.success
export const selectTermsModalOpen = (state: RootState) => state.status.termsModalOpen
export const statusReducer = statusSlice.reducer