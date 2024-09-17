import { AppDispatch } from '@/store'
import { selectShouldTriggerPreviewFee, setDepositAmountDebounceComplete } from '@/store/slices/networkAssets'
import { fetchPreviewFee, setDepositAmountMax } from '@/store/slices/networkAssets/thunks'
import { Middleware } from '@reduxjs/toolkit'

/**
 * Middleware function that handles preview fee actions.
 * Fetches the preview fee when the deposit amount is set after a debounce.
 */
export const previewFeeMiddleware: Middleware =
  ({ dispatch, getState }: { dispatch: AppDispatch; getState: () => any }) =>
  (next) =>
  (action) => {
    if (setDepositAmountDebounceComplete.match(action)) {
      const state = getState()
      const shouldTriggerPreviewFee = selectShouldTriggerPreviewFee(state)
      if (shouldTriggerPreviewFee) {
        dispatch(fetchPreviewFee())
      }
    }
    return next(action)
  }
