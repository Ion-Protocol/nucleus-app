import { BridgeKey } from '@/config/chains'
import { ActionReducerMapBuilder, PayloadAction } from '@reduxjs/toolkit'
import { BridgesState } from './initialState'
import {
  FetchBridgeApyResult,
  FetchBridgeRateResult,
  FetchBridgeTvlResult,
  fetchBridgeApy,
  fetchBridgeRate,
  fetchBridgeTvl,
  performDeposit,
  setBridgeFrom,
  setBridgeFromMax,
} from './thunks'

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
      state.overallLoading = true
    })
    .addCase(fetchBridgeTvl.fulfilled, (state, action: PayloadAction<FetchBridgeTvlResult>) => {
      const bridge = state.data[action.payload.bridgeKey as BridgeKey]
      bridge.tvl.loading = false
      bridge.tvl.value = action.payload.tvl
      state.overallLoading = Object.values(state.data).some((b) => b.tvl.loading || b.apy.loading)
    })
    .addCase(fetchBridgeTvl.rejected, (state: BridgesState, action) => {
      state.overallLoading = Object.values(state.data).some((b) => b.tvl.loading || b.apy.loading)
    })

    ///////////////////////////////
    // APY
    ///////////////////////////////
    .addCase(fetchBridgeApy.pending, (state, action) => {
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
      state.overallLoading = Object.values(state.data).some((b) => b.tvl.loading || b.apy.loading)
    })

    ///////////////////////////////
    // Rate
    ///////////////////////////////
    .addCase(fetchBridgeRate.pending, (state, action) => {
      state.overallLoading = true
    })
    .addCase(
      fetchBridgeRate.fulfilled,
      (state, action: PayloadAction<{ bridgeKey: BridgeKey; result: FetchBridgeRateResult }>) => {
        const bridge = state.data[action.payload.bridgeKey]
        bridge.rate.value = action.payload.result.rate
        state.overallLoading = Object.values(state.data).some((b) => b.tvl.loading || b.apy.loading || b.rate.loading)
      }
    )
    .addCase(fetchBridgeRate.rejected, (state, action) => {
      state.overallLoading = Object.values(state.data).some((b) => b.tvl.loading || b.apy.loading || b.rate.loading)
    })

    ///////////////////////////////
    // Deposit
    ///////////////////////////////
    .addCase(performDeposit.pending, (state, action) => {
      state.deposit.pending = true
    })
    .addCase(performDeposit.fulfilled, (state) => {
      state.deposit.pending = false
    })
    .addCase(performDeposit.rejected, (state, action) => {
      state.deposit.pending = false
      const bridge = state.data[action.meta.arg as BridgeKey]
      bridge.rate.loading = false
      bridge.error = action.error.message || 'Failed to deposit'
    })

    ///////////////////////////////
    // Bridge From Input
    ///////////////////////////////
    .addCase(setBridgeFrom.fulfilled, (state, action) => {
      const { bridgeKey, from } = action.payload
      if (state.data[bridgeKey as BridgeKey]) {
        state.data[bridgeKey as BridgeKey].from = from
      }
    })

    ///////////////////////////////
    // Bridge From Max Input
    ///////////////////////////////
    .addCase(setBridgeFromMax.fulfilled, (state, action) => {
      const { bridgeKey, from } = action.payload
      if (state.data[bridgeKey as BridgeKey]) {
        state.data[bridgeKey as BridgeKey].from = from
      }
    })
}
