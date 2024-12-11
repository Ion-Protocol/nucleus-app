import { AppDispatch } from '@/store'
import { setAddress } from '@/store/slices/account'
import { fetchAllTokenBalances } from '@/store/slices/balance'
import {
  clearDepositAmount,
  clearPreviewFee,
  clearRedeemAmount,
  clearRedeemSourceChain,
  clearSelectedSourceToken,
  resetRedeemDestinationChain,
  selectNetworkAssetConfig,
  selectSolanaAddressError,
  setSelectedSourceToken,
  setSolanaAddress,
  setSourceChain,
} from '@/store/slices/networkAssets'
import { fetchPreviewFee } from '@/store/slices/networkAssets/thunks'
import { setQuery } from '@/store/slices/router'
import { ChainKey } from '@/types/ChainKey'
import { TokenKey } from '@/types/TokenKey'
import { Middleware } from '@reduxjs/toolkit'

/**
 * Side effect middleware that clears certain state values when the chain changes.
 */
export const sideEffectMiddleware: Middleware =
  ({ dispatch, getState }: { dispatch: AppDispatch; getState: () => any }) =>
  (next) =>
  (action) => {
    const state = getState()

    // Side effects for wallet connection or change
    if (setAddress.match(action)) {
      // When the user first opens the app, their wallet will not be connected.
      // The user will likely input values into the deposit input field, then they will click "Connect wallet".
      // At this point we need to trigger fetching the preview fee, otherwise the "Mint" button will remain disabled.
      dispatch(fetchPreviewFee())
    }

    // Side effects for a network asset page change. This triggers when the user navigates to a different network asset page.
    if (setQuery.match(action)) {
      dispatch(clearPreviewFee())
      dispatch(clearDepositAmount())
      dispatch(clearSelectedSourceToken())
      // dispatch(resetSourceChain())

      // Clear redeem-related state
      dispatch(clearRedeemAmount())
      dispatch(clearRedeemSourceChain())
      dispatch(resetRedeemDestinationChain())
    }

    // Side effects for source chain change. This triggers when the user changes the source chain
    // in the chain selector menu.
    if (setSourceChain.match(action)) {
      dispatch(clearPreviewFee())
      dispatch(clearDepositAmount())

      // Set the selected token to the first source token found in the network
      // config based on source chain
      const sourceChainKey = action.payload as ChainKey
      const chainConfig = selectNetworkAssetConfig(state)
      const sourceTokens = chainConfig?.sourceTokens[sourceChainKey]
      if (!sourceTokens) return
      const firstToken = sourceTokens[0]
      if (firstToken) {
        dispatch(setSelectedSourceToken({ tokenKey: firstToken as TokenKey }))
      }
    }

    // Side effects for solana address change. Updates all token balances when
    // the user changes their solana address in the solana address input field
    // for tETH.
    if (setSolanaAddress.match(action)) {
      const solanaAddress = action.payload
      const solanaAddressError = selectSolanaAddressError(state)
      const isEmpty = solanaAddress.trim() === ''
      const shouldFetchBalance = !solanaAddressError && !isEmpty
      if (shouldFetchBalance) {
        dispatch(fetchAllTokenBalances({ solanaAddressFromAction: solanaAddress, ignoreLoading: true }))
      }
    }

    return next(action)
  }
