import { AppDispatch } from '@/store'
import { clearPreviewFee } from '@/store/slices/bridges'
import { setChainId } from '@/store/slices/chain'
import { Middleware } from '@reduxjs/toolkit'

/**
 * Side effect middleware that clears certain state values when the chain changes.
 */
export const chainChangeMiddleware: Middleware =
  ({ dispatch, getState }: { dispatch: AppDispatch; getState: () => any }) =>
  (next) =>
  (action) => {
    if (setChainId.match(action)) {
      dispatch(clearPreviewFee())
    }
    return next(action)
  }
