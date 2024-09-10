import { AppDispatch } from '@/store'
import { setAddress } from '@/store/slices/account'
import {
  clearInputValue,
  clearPreviewFee,
  clearSelectedFromToken,
  resetSourceChain,
  setSourceChain,
} from '@/store/slices/bridges'
import { fetchPreviewFee } from '@/store/slices/bridges/thunks'
import { setNetworkId } from '@/store/slices/chain'
import { setQuery } from '@/store/slices/router'
import { Middleware } from '@reduxjs/toolkit'

/**
 * Side effect middleware that clears certain state values when the chain changes.
 */
export const bridgeSideEffectMiddleware: Middleware =
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

    // Side effects for chain change. This triggers when the wallet connects to a different chain/network
    if (setNetworkId.match(action)) {
      dispatch(clearPreviewFee())
      dispatch(clearInputValue())
      dispatch(clearSelectedFromToken())
      dispatch(resetSourceChain())
    }

    // Side effects for a bridge page change. This triggers when the user navigates to a different bridge page.
    if (setQuery.match(action)) {
      dispatch(clearPreviewFee())
      dispatch(clearInputValue())
      dispatch(clearSelectedFromToken())
      dispatch(resetSourceChain())
    }

    // Side effects for source chain change. This triggers when the user changes the source chain
    // in the chain selector menu.
    if (setSourceChain.match(action)) {
      dispatch(clearPreviewFee())
      dispatch(clearInputValue())
      dispatch(clearSelectedFromToken())
    }

    return next(action)
  }
