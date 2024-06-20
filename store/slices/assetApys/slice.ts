import { AssetApys } from '@/types/AssetApys'
import { createSlice } from '@reduxjs/toolkit'
import { assetApysApi } from './api'

// ==================
// 1. STATE INTERFACE
// ==================
export interface AssetApysState {
  data: AssetApys
  loading: boolean
  error: string | null
}

// ==================
// 2. INITIAL STATE
// ==================
const initialState: AssetApysState = {
  data: {
    ezETH: 0,
    rsETH: 0,
    rswETH: 0,
    weETH: 0,
    wstETH: 0,
  },
  loading: true,
  error: null,
}

// ==================
// 3. SLICE
// ==================
const assetApysSlice = createSlice({
  name: 'assetApys',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addMatcher(assetApysApi.endpoints.getAssetApys.matchPending, (state) => {
        state.loading = true
        state.error = null
      })
      .addMatcher(assetApysApi.endpoints.getAssetApys.matchFulfilled, (state, { payload }) => {
        state.loading = false
        state.data = payload
      })
      .addMatcher(assetApysApi.endpoints.getAssetApys.matchRejected, (state, { error }) => {
        state.loading = false
        state.error = error.message || 'Failed to fetch assetApys'
      })
  },
})

export const assetApysReducer = assetApysSlice.reducer
