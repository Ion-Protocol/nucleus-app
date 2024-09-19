import { createSlice, PayloadAction } from '@reduxjs/toolkit'
import { RootState } from '@/store'

// ==================
// 1. STATE INTERFACE
// ==================
export interface UIState {
  isNetworkAssetNavOpen: boolean
  isTermsModalOpen: boolean
}

// ==================
// 2. INITIAL STATE
// ==================
const initialState: UIState = {
  isNetworkAssetNavOpen: false,
  isTermsModalOpen: false,
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
  },
})

export const { toggleNetworkAssetNav, setNetworkAssetNavOpen, openTermsModal, closeTermsModal } = uiSlice.actions

export const selectNetworkAssetNavOpen = (state: RootState) => state.ui.isNetworkAssetNavOpen
export const selectTermsModalOpen = (state: RootState) => state.ui.isTermsModalOpen

export const UIReducer = uiSlice.reducer
