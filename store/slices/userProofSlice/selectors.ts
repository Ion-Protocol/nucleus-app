import { RootState } from '@/store'
import { createSelector } from '@reduxjs/toolkit'
import { selectAddress } from '../account'
import { getUserProofByWallet } from './apiSlice'
import { tokensConfig } from '@/config/tokens'
import { ChainKey } from '@/types/ChainKey'

export const selectUserProofData = (state: RootState) => {
  const walletAddress = selectAddress(state)
  const chainId = 1329
  return getUserProofByWallet.select({ walletAddress, chainId })(state)?.data
}

export const selectUserProofLoading = (state: RootState) => {
  const walletAddress = selectAddress(state)
  const chainId = 1329
  return getUserProofByWallet.select({ walletAddress, chainId })(state)?.isLoading
}

// Memoized selector for user proof because it returns a new array
export const selectUserProof = createSelector([selectUserProofData], (userProofData) => {
  return userProofData?.proof || []
})

// Memoized selector for user claims
export const selectTotalClaimables = createSelector(
  selectUserProofData,
  (data) => data?.incentiveClaims.tokenAmounts || []
)

// Memoized because it's returning a new array
export const selectClaimableTokenAddresses = createSelector([selectUserProofData], (data) => {
  return (
    data?.incentiveClaims.tokenAmounts.map((tokenAmount) => {
      return tokensConfig[tokenAmount.tokenKey].addresses[ChainKey.ETHEREUM] as `0x${string}`
    }) || []
  )
})
