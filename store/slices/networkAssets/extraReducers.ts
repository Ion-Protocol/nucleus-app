import { ChainKey } from '@/types/ChainKey'
import { ActionReducerMapBuilder, PayloadAction } from '@reduxjs/toolkit'
import { NetworkAssetsState } from './initialState'
import {
  FetchChainRateResult,
  FetchNetworkAssetTvlResult,
  FetchPreviewFeeResult,
  fetchNetworkAssetTvl,
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
export function extraReducers(builder: ActionReducerMapBuilder<NetworkAssetsState>) {
  builder

    ///////////////////////////////
    // TVL
    ///////////////////////////////
    .addCase(fetchNetworkAssetTvl.pending, (state, action) => {
      state.tvl.loading = true
    })
    .addCase(fetchNetworkAssetTvl.fulfilled, (state, action: PayloadAction<FetchNetworkAssetTvlResult>) => {
      state.tvl.loading = false
      const tokenKey = action.payload.tokenKey
      state.tvl.data[tokenKey] = action.payload.tvl
    })
    .addCase(fetchNetworkAssetTvl.rejected, (state: NetworkAssetsState, action) => {
      state.tvl.loading = false
    })

    ///////////////////////////////
    // Rate
    ///////////////////////////////
    .addCase(fetchTokenRateInQuote.pending, (state) => {
      state.tokenRate.loading = true
    })
    .addCase(fetchTokenRateInQuote.fulfilled, (state, action: PayloadAction<{ result: FetchChainRateResult }>) => {
      state.tokenRate.data = action.payload.result.rate
      state.tokenRate.loading = false
    })
    .addCase(fetchTokenRateInQuote.rejected, (state) => {
      state.tokenRate.loading = false
    })

    ///////////////////////////////
    // Preview Fee
    ///////////////////////////////
    .addCase(fetchPreviewFee.pending, (state) => {
      state.previewFee.loading = true
    })
    .addCase(fetchPreviewFee.fulfilled, (state, action: PayloadAction<FetchPreviewFeeResult>) => {
      state.previewFee.data = action.payload.fee
      state.previewFee.loading = false
    })
    .addCase(fetchPreviewFee.rejected, (state) => {
      state.previewFee.loading = false
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
