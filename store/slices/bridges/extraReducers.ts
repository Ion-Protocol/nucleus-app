import { BridgeKey } from '@/config/bridges'
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
  setBridgeToken,
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
      const bridge = state.data[action.meta.arg]
      bridge.tvl.loading = true
      state.overallLoading = true
    })
    .addCase(fetchBridgeTvl.fulfilled, (state, action: PayloadAction<FetchBridgeTvlResult>) => {
      const bridge = state.data[action.payload.bridgeKey]
      bridge.tvl.loading = false
      bridge.tvl.value = action.payload.tvl
      state.overallLoading = Object.values(state.data).some((b) => b.tvl.loading || b.apy.loading)
    })
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
    // Rate
    ///////////////////////////////
    .addCase(fetchBridgeRate.pending, (state, action) => {
      const bridge = state.data[action.meta.arg]
      bridge.rate.loading = true
      state.overallLoading = true
    })
    .addCase(
      fetchBridgeRate.fulfilled,
      (state, action: PayloadAction<{ bridgeKey: BridgeKey; result: FetchBridgeRateResult }>) => {
        const bridge = state.data[action.payload.bridgeKey]
        bridge.rate.loading = false
        bridge.rate.value = action.payload.result.rate
        state.overallLoading = Object.values(state.data).some((b) => b.tvl.loading || b.apy.loading || b.rate.loading)
      }
    )
    .addCase(fetchBridgeRate.rejected, (state, action) => {
      const bridge = state.data[action.meta.arg]
      bridge.rate.loading = false
      bridge.error = action.error.message || 'Failed to fetch rate'
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
      const bridge = state.data[action.meta.arg]
      bridge.rate.loading = false
      bridge.error = action.error.message || 'Failed to deposit'
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
