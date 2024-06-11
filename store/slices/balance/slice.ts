import { RootState } from '@/store'
import { createSlice, PayloadAction } from '@reduxjs/toolkit'
import { fetchWeETHBalance, FetchWeETHBalanceResult } from './thunks'

// ==================
// 1. STATE INTERFACE
// ==================
export interface BalancesState {
  data: string
  loading: boolean
  error: string | null
}

// ==================
// 2. INITIAL STATE
// ==================
const initialState: BalancesState = {
  data: BigInt(0).toString(),
  loading: true,
  error: null,
}

// ==================
// 3. SLICE
// ==================
const balancesSlice = createSlice({
  name: 'balances',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchWeETHBalance.pending, (state) => {
        state.loading = true
      })
      .addCase(fetchWeETHBalance.fulfilled, (state, action: PayloadAction<FetchWeETHBalanceResult>) => {
        state.loading = false
        state.data = action.payload.balance
      })
      .addCase(fetchWeETHBalance.rejected, (state, action: PayloadAction<string | undefined>) => {
        state.loading = false
        state.error = action.payload || 'Failed to fetch WE-ETH balance'
      })
  },
})

export const balancesReducer = balancesSlice.reducer
