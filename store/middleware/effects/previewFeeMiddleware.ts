import { AppDispatch } from '@/store'
import { selectShouldTriggerPreviewFee, setInputValueDebounceComplete } from '@/store/slices/bridges'
import { fetchPreviewFee, setBridgeInputMax } from '@/store/slices/bridges/thunks'
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
      const shouldTriggerPreviewFee = selectShouldTriggerPreviewFee(state)
      if (shouldTriggerPreviewFee) {
        dispatch(fetchPreviewFee())
      }
    }
    return next(action)
  }
