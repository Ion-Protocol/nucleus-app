import { Position } from '@/types/Position'
import { createSlice } from '@reduxjs/toolkit'
import { positionsApi } from './api'

// ==================
// 1. STATE INTERFACE
// ==================
export interface PositionsState {
  data: Position[]
  loading: boolean
  error: string | null
}

// ==================
// 2. INITIAL STATE
// ==================
const initialState: PositionsState = {
  data: [],
  loading: true,
  error: null,
}

// ==================
// 3. SLICE
// ==================
const positionsSlice = createSlice({
  name: 'positions',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addMatcher(positionsApi.endpoints.getPositions.matchPending, (state) => {
        state.loading = true
        state.error = null
      })
      .addMatcher(positionsApi.endpoints.getPositions.matchFulfilled, (state, { payload }) => {
        state.loading = false
        state.data = payload
      })
      .addMatcher(positionsApi.endpoints.getPositions.matchRejected, (state, { error }) => {
        state.loading = false
        state.error = error.message || 'Failed to fetch positions'
      })
  },
})

export const positionsReducer = positionsSlice.reducer
