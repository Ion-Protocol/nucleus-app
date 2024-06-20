import { createSlice, PayloadAction } from '@reduxjs/toolkit'
import { fetchLiquidityForAllMarkets, FetchIonLensResult } from './thunks'
import { MarketKey } from '@/types/Market'

// ==================
// 1. STATE INTERFACE
// ==================
export interface IonLensState {
  liquidities: Record<MarketKey, string>
  loading: boolean
  error: string | null
}

// ==================
// 2. INITIAL STATE
// ==================
const initialState: IonLensState = {
  liquidities: {
    [MarketKey.WEETH_WSTETH]: '0',
    [MarketKey.RSETH_WSTETH]: '0',
    [MarketKey.RSWETH_WSTETH]: '0',
    [MarketKey.EZETH_WETH]: '0',
  },
  loading: true,
  error: null,
}

// ==================
// 3. SLICE
// ==================
const ionLensSlice = createSlice({
  name: 'ionLens',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      // Liquidity
      .addCase(fetchLiquidityForAllMarkets.pending, (state) => {
        state.loading = true
      })
      .addCase(fetchLiquidityForAllMarkets.fulfilled, (state, action: PayloadAction<FetchIonLensResult>) => {
        state.loading = false
        state.liquidities = action.payload
      })
      .addCase(fetchLiquidityForAllMarkets.rejected, (state, action: PayloadAction<string | undefined>) => {
        state.loading = false
        state.error = action.payload || 'Failed to fetch liquidity data from IonLens'
      })
  },
})

export const ionLensReducer = ionLensSlice.reducer
