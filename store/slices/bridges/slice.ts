import { BridgeKey } from '@/types/Bridge'
import { createSlice, PayloadAction } from '@reduxjs/toolkit'
import { fetchBridgeApy, FetchBridgeApyResult, fetchBridgeTvl, FetchBridgeTvlResult } from './thunks'

// ==================
// 1. STATE INTERFACE
// ==================
export interface BridgeData {
  tvl: string
  apy: string
}

// export type BridgesState = {
//   data: { [bridgeKey in BridgeKey]: BridgeData }
//   loading: boolean
//   error: string | null
// }
export type BridgesState = {
  data: { [bridgeKey in BridgeKey]: BridgeData }
  loading: boolean
  error: string | null
}

// ==================
// 2. INITIAL STATE
// ==================
const initialState: BridgesState = {
  data: {
    [BridgeKey.ARBITRUM]: {
      tvl: BigInt(0).toString(),
      apy: BigInt(0).toString(),
    },
    [BridgeKey.EDGELESS]: {
      tvl: BigInt(0).toString(),
      apy: BigInt(0).toString(),
    },
    [BridgeKey.SWELL]: {
      tvl: BigInt(0).toString(),
      apy: BigInt(0).toString(),
    },
    [BridgeKey.OPTIMISM]: {
      tvl: BigInt(0).toString(),
      apy: BigInt(0).toString(),
    },
    [BridgeKey.BOBA_NETWORK]: {
      tvl: BigInt(0).toString(),
      apy: BigInt(0).toString(),
    },
  },
  loading: true,
  error: null,
}

// ==================
// 3. SLICE
// ==================
const BridgesSlice = createSlice({
  name: 'bridges',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchBridgeTvl.pending, (state) => {
        state.loading = true
      })
      .addCase(fetchBridgeApy.pending, (state) => {
        state.loading = true
      })
      .addCase(
        fetchBridgeTvl.fulfilled,
        (state, action: PayloadAction<{ bridgeKey: BridgeKey; result: FetchBridgeTvlResult }>) => {
          state.loading = false
          state.data[action.payload.bridgeKey].tvl = action.payload.result.tvl
        }
      )
      .addCase(
        fetchBridgeApy.fulfilled,
        (state, action: PayloadAction<{ bridgeKey: BridgeKey; result: FetchBridgeApyResult }>) => {
          state.loading = false
          state.data[action.payload.bridgeKey].apy = action.payload.result.apy
        }
      )
      .addCase(fetchBridgeTvl.rejected, (state, action: PayloadAction<string | undefined>) => {
        state.loading = false
        state.error = action.payload || 'Failed to fetch TVL'
      })
      .addCase(fetchBridgeApy.rejected, (state, action: PayloadAction<string | undefined>) => {
        state.loading = false
        state.error = action.payload || 'Failed to fetch APY'
      })
  },
})

// Export actions
export const {} = BridgesSlice.actions

// Export reducer
export const bridgesReducer = BridgesSlice.reducer
