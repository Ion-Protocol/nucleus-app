import { createSlice, PayloadAction } from '@reduxjs/toolkit'
import { fetchEthPrice, FetchPriceResult } from './thunks'

// ==================
// 1. STATE INTERFACE
// ==================
export interface PricesState {
  data: string
  loading: boolean
  error: string | null
}

// ==================
// 2. INITIAL STATE
// ==================
const initialState: PricesState = {
  data: BigInt(0).toString(),
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
      .addCase(fetchEthPrice.pending, (state) => {
        state.loading = true
      })
      .addCase(fetchEthPrice.fulfilled, (state, action: PayloadAction<FetchPriceResult>) => {
        state.loading = false
        state.data = action.payload.price
      })
      .addCase(fetchEthPrice.rejected, (state, action: PayloadAction<string | undefined>) => {
        state.loading = false
        state.error = action.payload || 'Failed to fetch WE-ETH price'
      })
  },
})

export const priceReducer = pricesSlice.reducer
