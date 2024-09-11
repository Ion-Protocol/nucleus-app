import { createSlice, PayloadAction } from '@reduxjs/toolkit'
import { fetchUsdPerEthRate, FetchRateResult, fetchUsdPerBtcRate } from './thunks'

// ==================
// 1. STATE INTERFACE
// ==================
export interface PricesState {
  usdPerEthRate: string
  usdPerBtcRate: string
  loading: boolean
  error: string | null
}

// ==================
// 2. INITIAL STATE
// ==================
const initialState: PricesState = {
  usdPerEthRate: BigInt(0).toString(),
  usdPerBtcRate: BigInt(0).toString(),
  loading: true,
  error: null,
}

// ==================
// 3. SLICE
// ==================
const pricesSlice = createSlice({
  name: 'prices',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      // USD per ETH exchange rate or ETH price
      .addCase(fetchUsdPerEthRate.pending, (state) => {
        state.loading = true
      })
      .addCase(fetchUsdPerEthRate.fulfilled, (state, action: PayloadAction<FetchRateResult>) => {
        state.loading = false
        state.usdPerEthRate = action.payload.rate
      })
      .addCase(fetchUsdPerEthRate.rejected, (state, action: PayloadAction<string | undefined>) => {
        state.loading = false
        state.error = action.payload || 'Failed to fetch ETH price'
      })

      // USD per BTC exchange rate
      .addCase(fetchUsdPerBtcRate.pending, (state) => {
        state.loading = true
      })
      .addCase(fetchUsdPerBtcRate.fulfilled, (state, action: PayloadAction<FetchRateResult>) => {
        state.loading = false
        state.usdPerBtcRate = action.payload.rate
      })
      .addCase(fetchUsdPerBtcRate.rejected, (state, action: PayloadAction<string | undefined>) => {
        state.loading = false
        state.error = action.payload || 'Failed to fetch BTC price'
      })
  },
})

export const priceReducer = pricesSlice.reducer
