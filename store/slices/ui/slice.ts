import { createSlice, PayloadAction } from '@reduxjs/toolkit'
import { RootState } from '@/store'

// ==================
// 1. STATE INTERFACE
// ==================
export interface UIState {
  isBridgeNavOpen: boolean
  isTermsModalOpen: boolean
}

// ==================
// 2. INITIAL STATE
// ==================
const initialState: UIState = {
  isBridgeNavOpen: false,
  isTermsModalOpen: false,
}

// ==================
// 3. SLICE
// ==================
const uiSlice = createSlice({
  name: 'ui',
  initialState,
  reducers: {
    toggleBridgeNav(state) {
      state.isBridgeNavOpen = !state.isBridgeNavOpen
    },
    setBridgeNavOpen(state, action: PayloadAction<boolean>) {
      state.isBridgeNavOpen = action.payload
    },
    openTermsModal(state) {
      state.isTermsModalOpen = true
    },
    closeTermsModal(state) {
      state.isTermsModalOpen = false
    },
  },
})

export const { toggleBridgeNav, setBridgeNavOpen, openTermsModal, closeTermsModal } = uiSlice.actions

export const selectBridgeNavOpen = (state: RootState) => state.ui.isBridgeNavOpen
export const selectTermsModalOpen = (state: RootState) => state.ui.isTermsModalOpen

export const UIReducer = uiSlice.reducer
