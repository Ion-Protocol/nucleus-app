import { RootState } from '@/store'
import { createSlice, PayloadAction } from '@reduxjs/toolkit'
import { FetchWeETHBalanceResult } from './thunks'

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
})

export const balancesReducer = balancesSlice.reducer
