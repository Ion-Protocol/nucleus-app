import { AppDispatch } from '@/store'
import { acceptTerms } from '@/store/slices/status'
import { Middleware } from '@reduxjs/toolkit'

export const termsAcceptedMiddleware: Middleware =
  ({ dispatch, getState }: { dispatch: AppDispatch; getState: () => any }) =>
  (next) =>
  (action) => {
    if (acceptTerms.match(action)) {
      localStorage.setItem('termsAccepted', 'true')
    }

    return next(action)
  }
