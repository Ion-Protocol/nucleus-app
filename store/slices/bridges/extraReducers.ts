import { BridgeKey } from '@/config/bridges'
import { ActionReducerMapBuilder, PayloadAction } from '@reduxjs/toolkit'
import { BridgesState } from './initialState'
import {
  FetchBridgeApyResult,
  FetchBridgeTvlResult,
  fetchBridgeApy,
  fetchBridgeTvl,
  setBridgeFrom,
  setBridgeToken,
} from './thunks'
import { TokenKey } from '@/config/token'

/**
 * Defines the extra reducers for the bridges slice.
 * These reducers handle the state updates for fetching bridge TVL and APY.
 *
 * @param builder - The ActionReducerMapBuilder for the BridgesState.
 */
export function extraReducers(builder: ActionReducerMapBuilder<BridgesState>) {
  builder

    ///////////////////////////////
    // TVL
    ///////////////////////////////
    .addCase(fetchBridgeTvl.pending, (state, action) => {
      const bridge = state.data[action.meta.arg]
      bridge.tvl.loading = true
      state.overallLoading = true
    })
    .addCase(
      fetchBridgeTvl.fulfilled,
      (state, action: PayloadAction<{ bridgeKey: BridgeKey; result: FetchBridgeTvlResult }>) => {
        const bridge = state.data[action.payload.bridgeKey]
        bridge.tvl.loading = false
        bridge.tvl.value = action.payload.result.tvl
        state.overallLoading = Object.values(state.data).some((b) => b.tvl.loading || b.apy.loading)
      }
    )
    .addCase(fetchBridgeTvl.rejected, (state, action) => {
      const bridge = state.data[action.meta.arg]
      bridge.tvl.loading = false
      bridge.error = action.error.message || 'Failed to fetch TVL'
      state.overallLoading = Object.values(state.data).some((b) => b.tvl.loading || b.apy.loading)
    })

    ///////////////////////////////
    // APY
    ///////////////////////////////
    .addCase(fetchBridgeApy.pending, (state, action) => {
      const bridge = state.data[action.meta.arg]
      bridge.apy.loading = true
      state.overallLoading = true
    })
    .addCase(
      fetchBridgeApy.fulfilled,
      (state, action: PayloadAction<{ bridgeKey: BridgeKey; result: FetchBridgeApyResult }>) => {
        const bridge = state.data[action.payload.bridgeKey]
        bridge.apy.loading = false
        bridge.apy.value = action.payload.result.apy
        state.overallLoading = Object.values(state.data).some((b) => b.tvl.loading || b.apy.loading)
      }
    )
    .addCase(fetchBridgeApy.rejected, (state, action) => {
      const bridge = state.data[action.meta.arg]
      bridge.apy.loading = false
      bridge.error = action.error.message || 'Failed to fetch APY'
      state.overallLoading = Object.values(state.data).some((b) => b.tvl.loading || b.apy.loading)
    })

    ///////////////////////////////
    // Bridge From Input
    ///////////////////////////////
    .addCase(setBridgeFrom.fulfilled, (state, action) => {
      const { bridgeKey, from } = action.payload
      if (state.data[bridgeKey]) {
        state.data[bridgeKey].from = from
      }
    })

    ///////////////////////////////
    // Selected Token
    ///////////////////////////////
    .addCase(setBridgeToken.fulfilled, (state, action) => {
      const { bridgeKey, tokenKey } = action.payload
      if (state.data[bridgeKey]) {
        state.data[bridgeKey].selectedToken = tokenKey
      }
    })
}
