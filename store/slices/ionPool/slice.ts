import { MarketKey } from '@/types/Market'
import { createSlice, PayloadAction } from '@reduxjs/toolkit'
import { fetchTotalSupplyForAllMarkets, FetchIonPoolResult, fetchCurrentBorrowRateForAllMarkets } from './thunks'

export interface IonPoolData {
  totalSupply: string
}

// ==================
// 1. STATE INTERFACE
// ==================
export interface IonPoolState {
  totalSupplies: Record<MarketKey, string>
  currentBorrowRates: Record<MarketKey, string>
  loading: boolean
  error: string | null
}

// ==================
// 2. INITIAL STATE
// ==================
const initialState: IonPoolState = {
  totalSupplies: {
    [MarketKey.WEETH_WSTETH]: '0',
    [MarketKey.RSETH_WSTETH]: '0',
    [MarketKey.RSWETH_WSTETH]: '0',
    [MarketKey.EZETH_WETH]: '0',
  },
  currentBorrowRates: {
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
const ionPoolSlice = createSlice({
  name: 'ionPool',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      // Total Supply
      .addCase(fetchTotalSupplyForAllMarkets.pending, (state) => {
        state.loading = true
      })
      .addCase(fetchTotalSupplyForAllMarkets.fulfilled, (state, action: PayloadAction<FetchIonPoolResult>) => {
        state.loading = false
        state.totalSupplies = action.payload
      })
      .addCase(fetchTotalSupplyForAllMarkets.rejected, (state, action: PayloadAction<string | undefined>) => {
        state.loading = false
        state.error = action.payload || 'Failed to fetch totalSupply data from IonPool'
      })

      // Current Borrow Rate
      .addCase(fetchCurrentBorrowRateForAllMarkets.pending, (state) => {
        state.loading = true
      })
      .addCase(fetchCurrentBorrowRateForAllMarkets.fulfilled, (state, action: PayloadAction<FetchIonPoolResult>) => {
        state.loading = false
        state.currentBorrowRates = action.payload
      })
      .addCase(fetchCurrentBorrowRateForAllMarkets.rejected, (state, action: PayloadAction<string | undefined>) => {
        state.loading = false
        state.error = action.payload || 'Failed to fetch currentBorrowRate data from IonPool'
      })
  },
})

export const ionPoolReducer = ionPoolSlice.reducer
