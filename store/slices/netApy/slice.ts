import { NetApyItem } from '@/types/NetApyItem'
import { TimeRange } from '@/types/TimeRange'
import { createSlice, PayloadAction } from '@reduxjs/toolkit'
import { netApyApi } from './api'

// ==================
// 1. STATE INTERFACE
// ==================
export interface NetApyState {
  history: NetApyItem[]
  loading: boolean
  error: string | null
  timeRange: TimeRange
}

// ==================
// 2. INITIAL STATE
// ==================
const initialState: NetApyState = {
  history: [],
  loading: true,
  error: null,
  timeRange: TimeRange.All,
}

// ==================
// 3. SLICE
// ==================
const netApySlice = createSlice({
  name: 'netApy',
  initialState,
  reducers: {
    setTimeRange: (state, action: PayloadAction<TimeRange>) => {
      state.timeRange = action.payload
    },
  },
  extraReducers: (builder) => {
    builder
      .addMatcher(netApyApi.endpoints.getNetApy.matchPending, (state) => {
        state.loading = true
        state.error = null
      })
      .addMatcher(netApyApi.endpoints.getNetApy.matchFulfilled, (state, { payload }) => {
        state.loading = false
        state.history = payload
      })
      .addMatcher(netApyApi.endpoints.getNetApy.matchRejected, (state, { error }) => {
        state.loading = false
        state.error = error.message || 'Failed to fetch net apy history'
      })
  },
})

export const { setTimeRange } = netApySlice.actions
export const netApyReducer = netApySlice.reducer
