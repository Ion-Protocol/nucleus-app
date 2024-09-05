import { AppDispatch } from '@/store'
import { selectTokenBalance, selectTokenBalanceAsNumber } from '@/store/slices/balance'
import {
  clearInputError,
  clearInputValue,
  clearPreviewFee,
  clearSelectedFromToken,
  resetSourceChain,
  selectSourceTokenKey,
  selectSourceChainKey,
  setInputError,
  setInputValue,
  setSourceChain,
} from '@/store/slices/bridges'
import { setNetworkId } from '@/store/slices/chain'
import { selectChainKeyFromRoute, setQuery } from '@/store/slices/router'
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
    if (setNetworkId.match(action)) {
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
      const chainKeyFromChainSelector = selectSourceChainKey(state)
      const chainKeyFromRoute = selectChainKeyFromRoute(state)
      const selectedTokenKey = selectSourceTokenKey(state)
      const tokenBalanceAsNumber = selectTokenBalanceAsNumber(chainKeyFromChainSelector, selectedTokenKey)(state)
      const shouldCheckForInsufficientBalance = chainKeyFromChainSelector === chainKeyFromRoute

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
