import { ChainKey } from '@/types/ChainKey'
import { ActionReducerMapBuilder, PayloadAction } from '@reduxjs/toolkit'
import { NetworkAssetsState } from './initialState'
import {
  FetchChainRateResult,
  FetchClaimedAmountsOfAssetsResult,
  FetchNetworkAssetTvlResult,
  FetchPausedResult,
  FetchPreviewFeeResult,
  claimRewards,
  fetchClaimedAmountsOfAssets,
  fetchNetworkAssetTvl,
  fetchPaused,
  fetchPreviewFee,
  fetchTokenRateInQuote,
  performDeposit,
} from './thunks'
import { RootState } from '@/store'

/**
 * Defines the extra reducers for the bridges slice.
 * These reducers handle the state updates for fetching bridge TVL.
 *
 * @param builder - The ActionReducerMapBuilder for the BridgesState.
 */
export function extraReducers(builder: ActionReducerMapBuilder<NetworkAssetsState>) {
  builder

    ///////////////////////////////
    // Paused
    ///////////////////////////////
    .addCase(fetchPaused.pending, (state, action) => {
      state.automaticallyPaused.loading = true
    })
    .addCase(fetchPaused.fulfilled, (state, action: PayloadAction<FetchPausedResult>) => {
      state.automaticallyPaused.loading = false
      state.automaticallyPaused.data = action.payload
    })
    .addCase(fetchPaused.rejected, (state: NetworkAssetsState, action) => {
      state.automaticallyPaused.loading = false
    })

    ///////////////////////////////
    // Incentive Claims
    ///////////////////////////////
    .addCase(fetchClaimedAmountsOfAssets.pending, (state: NetworkAssetsState) => {
      state.claimed.loading = true
    })
    .addCase(
      fetchClaimedAmountsOfAssets.fulfilled,
      (state: NetworkAssetsState, action: PayloadAction<FetchClaimedAmountsOfAssetsResult>) => {
        state.claimed.loading = false
        state.claimed.data = action.payload.claimed
      }
    )
    .addCase(fetchClaimedAmountsOfAssets.rejected, (state: NetworkAssetsState) => {
      state.claimed.loading = false
    })

    .addCase(claimRewards.pending, (state: NetworkAssetsState) => {
      state.claim.pending = true
    })
    .addCase(claimRewards.fulfilled, (state: NetworkAssetsState) => {
      state.claim.pending = false
    })
    .addCase(claimRewards.rejected, (state: NetworkAssetsState) => {
      state.claim.pending = false
    })

    ///////////////////////////////
    // TVL
    ///////////////////////////////
    .addCase(fetchNetworkAssetTvl.pending, (state: NetworkAssetsState) => {
      state.tvl.loading = true
    })
    .addCase(
      fetchNetworkAssetTvl.fulfilled,
      (state: NetworkAssetsState, action: PayloadAction<FetchNetworkAssetTvlResult>) => {
        state.tvl.loading = false
        const tokenKey = action.payload.tokenKey
        state.tvl.data[tokenKey] = action.payload.tvl
      }
    )
    .addCase(fetchNetworkAssetTvl.rejected, (state: NetworkAssetsState) => {
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
