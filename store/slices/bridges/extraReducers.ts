import { ChainKey } from '@/types/ChainKey'
import { ActionReducerMapBuilder, PayloadAction } from '@reduxjs/toolkit'
import { BridgesState } from './initialState'
import {
  FetchChainRateResult,
  FetchChainTvlResult,
  FetchPreviewFeeResult,
  fetchChainTvl,
  fetchPreviewFee,
  fetchTokenRateInQuote,
  performDeposit,
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
    .addCase(fetchTokenRateInQuote.pending, (state) => {
      state.tokenRateInQuoteLoading = true
    })
    .addCase(fetchTokenRateInQuote.fulfilled, (state, action: PayloadAction<{ result: FetchChainRateResult }>) => {
      state.tokenRateInQuote = action.payload.result.rate
      state.tokenRateInQuoteLoading = false
    })
    .addCase(fetchTokenRateInQuote.rejected, (state) => {
      state.tokenRateInQuoteLoading = false
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
