import { Middleware } from '@reduxjs/toolkit'
import { fetchPreviewFee } from '@/store/slices/bridges/thunks'
import { AppDispatch } from '@/store'
import { setBridgeFromDebounceComplete } from '@/store/slices/bridges'

/**
 * Middleware function that handles preview fee actions.
 * Fetches the preview fee when the bridge "from" (deposit) value is set after a debounce.
 */
export const previewFeeMiddleware: Middleware =
  ({ dispatch, getState }: { dispatch: AppDispatch; getState: () => any }) =>
  (next) =>
  (action) => {
    if (setBridgeFromDebounceComplete.match(action)) {
      const state = getState()
      const bridgeKey = state.bridges.bridgeKey
      dispatch(fetchPreviewFee(bridgeKey))
    }
    return next(action)
  }
