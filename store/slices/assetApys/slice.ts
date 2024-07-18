import { TokenKey } from '@/config/token'
import { createSlice } from '@reduxjs/toolkit'
import { assetApysApi } from './api'

type AssetApy = Partial<Record<TokenKey, number>>

// ==================
// 1. STATE INTERFACE
// ==================
export interface AssetApysState {
  data: AssetApy
  loading: boolean
  error: string | null
}

// ==================
// 2. INITIAL STATE
// ==================
const initialState: AssetApysState = {
  data: {
    [TokenKey.EZETH]: 0,
    [TokenKey.RSETH]: 0,
    [TokenKey.RSWETH]: 0,
    [TokenKey.WEETH]: 0,
    [TokenKey.WSTETH]: 0,
  },
  loading: false,
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
