import { TokenKey, tokensConfig } from '@/config/token'
import { PayloadAction, createSlice } from '@reduxjs/toolkit'
import { fetchAllTokenBalances, fetchAllTokenBalancesResult } from './thunks'

// ==================
// 1. STATE INTERFACE
// ==================
export interface BalancesState {
  data: Record<TokenKey, string>
  loading: boolean
  error: string | null
}

// ==================
// 2. INITIAL STATE
// ==================
const initialState: BalancesState = {
  data: Object.keys(tokensConfig).reduce(
    (acc, tokenKey) => {
      acc[tokenKey as TokenKey] = '0'
      return acc
    },
    {} as Record<TokenKey, string>
  ),
  loading: false,
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
      // Liquidity
      .addCase(fetchAllTokenBalances.pending, (state) => {
        state.loading = true
      })
      .addCase(fetchAllTokenBalances.fulfilled, (state, action: PayloadAction<fetchAllTokenBalancesResult>) => {
        state.loading = false
        state.data = action.payload.balances
      })
      .addCase(fetchAllTokenBalances.rejected, (state, action: PayloadAction<string | undefined>) => {
        state.loading = false
        state.error = action.payload || 'Failed to fetch token balances'
      })
  },
})

export const balancesReducer = balancesSlice.reducer
