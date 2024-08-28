import { AppDispatch } from '@/store'
import { selectTokenBalance, selectTokenBalanceAsNumber } from '@/store/slices/balance'
import {
  clearInputError,
  clearInputValue,
  clearPreviewFee,
  clearSelectedFromToken,
  resetSourceChain,
  selectFromTokenKey,
  selectSourceBridge,
  setInputError,
  setInputValue,
  setSourceChain,
} from '@/store/slices/bridges'
import { setChainId } from '@/store/slices/chain'
import { selectBridgeKeyFromRoute, setQuery } from '@/store/slices/router'
import { Middleware } from '@reduxjs/toolkit'

/**
 * Side effect middleware that clears certain state values when the chain changes.
 */
export const bridgeSideEffectMiddleware: Middleware =
  ({ dispatch, getState }: { dispatch: AppDispatch; getState: () => any }) =>
  (next) =>
  (action) => {
    const state = getState()

    // Side effects for chain change. This triggers when the wallet connects to a different chain/network
    if (setChainId.match(action)) {
      dispatch(clearPreviewFee())
      dispatch(clearInputValue())
      dispatch(clearSelectedFromToken())
      dispatch(clearInputError())
      dispatch(resetSourceChain())
    }

    // Side effects for a bridge page change. This triggers when the user navigates to a different bridge page.
    if (setQuery.match(action)) {
      dispatch(clearPreviewFee())
      dispatch(clearInputValue())
      dispatch(clearSelectedFromToken())
      dispatch(clearInputError())
      dispatch(resetSourceChain())
    }

    // Side effects for source chain change. This triggers when the user changes the source chain
    // in the chain selector menu.
    if (setSourceChain.match(action)) {
      dispatch(clearPreviewFee())
      dispatch(clearInputValue())
      dispatch(clearSelectedFromToken())
      dispatch(clearInputError())
    }

    // Side effects for input value changes
    // Processes input errors
    if (setInputValue.match(action)) {
      const inputValue = action.payload
      const bridgeKeyFromChainSelector = selectSourceBridge(state)
      const bridgeKeyFromRoute = selectBridgeKeyFromRoute(state)
      const selectedTokenKey = selectFromTokenKey(state)
      const tokenBalanceAsNumber = selectTokenBalanceAsNumber(bridgeKeyFromChainSelector, selectedTokenKey)(state)
      const shouldCheckForInsufficientBalance = bridgeKeyFromChainSelector === bridgeKeyFromRoute

      if (shouldCheckForInsufficientBalance && tokenBalanceAsNumber !== null) {
        if (parseFloat(inputValue) > tokenBalanceAsNumber) {
          dispatch(setInputError('Insufficient balance'))
        } else {
          dispatch(clearInputError())
        }
      } else {
        dispatch(clearInputError())
      }
    }

    return next(action)
  }
