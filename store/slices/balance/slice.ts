import { tokensConfig } from '@/config/token'
import { TokenKey } from '@/types/TokenKey'
import { PayloadAction, createSlice } from '@reduxjs/toolkit'
import { fetchAllTokenBalances, fetchAllTokenBalancesResult } from './thunks'
import { ChainKey } from '@/types/ChainKey'

// ==================
// 1. STATE INTERFACE
// ==================
export interface BalancesState {
  data: Record<TokenKey, Record<ChainKey, string | null>>
  loading: boolean
  error: string | null
}

// ==================
// 2. INITIAL STATE
// ==================
const initialState: BalancesState = {
  data: Object.keys(tokensConfig).reduce(
    (acc, tokenKey) => {
      acc[tokenKey as TokenKey] = acc[tokenKey as TokenKey] || {}
      acc[tokenKey as TokenKey][ChainKey.ETHEREUM] = null
      return acc
    },
    {} as Record<TokenKey, Record<ChainKey, string | null>>
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
  reducers: {
    clearBalances: (state) => {
      state.data = initialState.data
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchAllTokenBalances.pending, (state, action) => {
        if (!action.meta.arg?.ignoreLoading) {
          state.loading = true
        }
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

export const { clearBalances } = balancesSlice.actions
export const balancesReducer = balancesSlice.reducer
