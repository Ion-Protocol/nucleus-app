import { BridgeKey } from '@/config/chains'
import { ActionReducerMapBuilder, PayloadAction } from '@reduxjs/toolkit'
import { BridgesState } from './initialState'
import {
  FetchBridgeRateResult,
  FetchBridgeTvlResult,
  FetchPreviewFeeResult,
  fetchBridgeRate,
  fetchBridgeTvl,
  fetchPreviewFee,
  performDeposit,
  setBridgeFrom,
  setBridgeFromMax,
} from './thunks'

/**
 * Defines the extra reducers for the bridges slice.
 * These reducers handle the state updates for fetching bridge TVL.
 *
 * @param builder - The ActionReducerMapBuilder for the BridgesState.
 */
export function extraReducers(builder: ActionReducerMapBuilder<BridgesState>) {
  builder

    ///////////////////////////////
    // TVL
    ///////////////////////////////
    .addCase(fetchBridgeTvl.pending, (state, action) => {
      state.tvlLoading = true
    })
    .addCase(fetchBridgeTvl.fulfilled, (state, action: PayloadAction<FetchBridgeTvlResult>) => {
      state.tvlLoading = false
      const bridge = state.data[action.payload.bridgeKey as BridgeKey]
      bridge.tvl.value = action.payload.tvl
    })
    .addCase(fetchBridgeTvl.rejected, (state: BridgesState, action) => {
      state.tvlLoading = false
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
        state.overallLoading = Object.values(state.data).some((b) => b.tvl.loading || b.rate.loading)
      }
    )
    .addCase(fetchBridgeRate.rejected, (state, action) => {
      state.overallLoading = Object.values(state.data).some((b) => b.tvl.loading || b.rate.loading)
    })

    ///////////////////////////////
    // Preview Fee
    ///////////////////////////////
    .addCase(fetchPreviewFee.pending, (state) => {
      state.previewFeeLoading = true
    })
    .addCase(fetchPreviewFee.fulfilled, (state, action: PayloadAction<FetchPreviewFeeResult>) => {
      state.previewFee = action.payload.fee
      state.previewFeeLoading = false
    })
    .addCase(fetchPreviewFee.rejected, (state) => {
      state.previewFeeLoading = false
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
