import { AppDispatch } from '@/store'
import { selectChainConfig, selectDepositDisabled, setInputValueDebounceComplete } from '@/store/slices/bridges'
import { fetchPreviewFee } from '@/store/slices/bridges/thunks'
import { Middleware } from '@reduxjs/toolkit'

/**
 * Middleware function that handles preview fee actions.
 * Fetches the preview fee when the bridge "from" (deposit) value is set after a debounce.
 */
export const previewFeeMiddleware: Middleware =
  ({ dispatch, getState }: { dispatch: AppDispatch; getState: () => any }) =>
  (next) =>
  (action) => {
    if (setInputValueDebounceComplete.match(action)) {
      const state = getState()
      const disabled = selectDepositDisabled(state)
      const chainConfig = selectChainConfig(state)
      const layerZeroChainSelector = chainConfig?.layerZeroChainSelector
      if (!disabled && layerZeroChainSelector) {
        dispatch(fetchPreviewFee())
      }
    }
    return next(action)
  }
