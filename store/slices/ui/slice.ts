import { RootState } from '@/store'
import { createSlice, PayloadAction } from '@reduxjs/toolkit'

// ==================
// 1. STATE INTERFACE
// ==================
export interface UIState {
  isNetworkAssetNavOpen: boolean
  isTermsModalOpen: boolean
  isDeprecationModalOpen: boolean
}

// ==================
// 2. INITIAL STATE
// ==================
const initialState: UIState = {
  isNetworkAssetNavOpen: false,
  isTermsModalOpen: false,
  isDeprecationModalOpen: false,
}

// ==================
// 3. SLICE
// ==================
const uiSlice = createSlice({
  name: 'ui',
  initialState,
  reducers: {
    toggleNetworkAssetNav(state) {
      state.isNetworkAssetNavOpen = !state.isNetworkAssetNavOpen
    },
    setNetworkAssetNavOpen(state, action: PayloadAction<boolean>) {
      state.isNetworkAssetNavOpen = action.payload
    },
    openTermsModal(state) {
      state.isTermsModalOpen = true
    },
    closeTermsModal(state) {
      state.isTermsModalOpen = false
    },
    openDeprecationModal(state) {
      state.isDeprecationModalOpen = true
    },
    closeDeprecationModal(state) {
      state.isDeprecationModalOpen = false
    },
  },
})

export const {
  toggleNetworkAssetNav,
  setNetworkAssetNavOpen,
  openTermsModal,
  closeTermsModal,
  openDeprecationModal,
  closeDeprecationModal,
} = uiSlice.actions

export const selectNetworkAssetNavOpen = (state: RootState) => state.ui.isNetworkAssetNavOpen
export const selectTermsModalOpen = (state: RootState) => state.ui.isTermsModalOpen
export const selectDeprecationModalOpen = (state: RootState) => state.ui.isDeprecationModalOpen

export const UIReducer = uiSlice.reducer
