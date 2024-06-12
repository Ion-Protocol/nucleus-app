import { BridgeKey } from '@/types/Bridge'
import { createSlice, PayloadAction } from '@reduxjs/toolkit'

// ==================
// 1. STATE INTERFACE
// ==================
export interface BridgeData {
  tvl: string
  apy: string
}

export type BridgesState = {
  [bridgeKey in BridgeKey]?: BridgeData
}

// ==================
// 2. INITIAL STATE
// ==================
const initialState: BridgesState = {}

// ==================
// 3. SLICE
// ==================
const BridgesSlice = createSlice({
  name: 'bridges',
  initialState,
  reducers: {
    setBridgesData: (state, action: PayloadAction<BridgesState>) => {
      return action.payload
    },
    setBridgeData: (state, action: PayloadAction<{ key: BridgeKey; tvl: string; apy: string }>) => {
      const { key, tvl, apy } = action.payload
      state[key] = { tvl, apy }
    },
    updateBridgeTVL: (state, action: PayloadAction<{ key: BridgeKey; tvl: string }>) => {
      const { key, tvl } = action.payload
      if (state[key]) {
        state[key]!.tvl = tvl
      } else {
        state[key] = { tvl, apy: '0' }
      }
    },
    updateBridgeAPY: (state, action: PayloadAction<{ key: BridgeKey; apy: string }>) => {
      const { key, apy } = action.payload
      if (state[key]) {
        state[key]!.apy = apy
      } else {
        state[key] = { tvl: '0', apy }
      }
    },
  },
})

// Export actions
export const { setBridgesData, setBridgeData, updateBridgeTVL, updateBridgeAPY } = BridgesSlice.actions

// Export reducer
export const bridgesReducer = BridgesSlice.reducer
