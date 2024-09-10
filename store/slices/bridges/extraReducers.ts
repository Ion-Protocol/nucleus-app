import { ChainKey } from '@/types/ChainKey'
import { ActionReducerMapBuilder, PayloadAction } from '@reduxjs/toolkit'
import { BridgesState } from './initialState'
import {
  fetchChainRateResult,
  FetchChainTvlResult,
  FetchPreviewFeeResult,
  fetchChainRate,
  fetchChainTvl,
  fetchPreviewFee,
  performDeposit,
  setBridgeInputMax,
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
    .addCase(fetchChainTvl.pending, (state, action) => {
      state.tvlLoading = true
    })
    .addCase(fetchChainTvl.fulfilled, (state, action: PayloadAction<FetchChainTvlResult>) => {
      state.tvlLoading = false
      const chainData = state.data[action.payload.chainKey as ChainKey]
      chainData.tvl.value = action.payload.tvl
    })
    .addCase(fetchChainTvl.rejected, (state: BridgesState, action) => {
      state.tvlLoading = false
    })

    ///////////////////////////////
    // Rate
    ///////////////////////////////
    .addCase(fetchChainRate.pending, (state, action) => {
      state.overallLoading = true
    })
    .addCase(
      fetchChainRate.fulfilled,
      (state, action: PayloadAction<{ chainKey: ChainKey; result: fetchChainRateResult }>) => {
        const chainData = state.data[action.payload.chainKey]
        chainData.rate.value = action.payload.result.rate
        state.overallLoading = Object.values(state.data).some((b) => b.tvl.loading || b.rate.loading)
      }
    )
    .addCase(fetchChainRate.rejected, (state, action) => {
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
}
