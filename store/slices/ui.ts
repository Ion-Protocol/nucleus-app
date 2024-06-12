import { createSlice, PayloadAction } from '@reduxjs/toolkit'
import { RootState } from '@/store'

// ==================
// 1. STATE INTERFACE
// ==================
export interface UIState {
  isBridgeNavOpen: boolean
}

// ==================
// 2. INITIAL STATE
// ==================
const initialState: UIState = {
  isBridgeNavOpen: false,
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
  },
})

export const { toggleBridgeNav, setBridgeNavOpen } = uiSlice.actions

export const selectBridgeNavOpen = (state: RootState) => state.ui.isBridgeNavOpen
export const UIReducer = uiSlice.reducer
