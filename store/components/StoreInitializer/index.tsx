import React, { useEffect } from 'react'
import { useAppDispatch } from '@/store/hooks'
import { setAddress } from '@/store/slices/account'
import { useAccount } from 'wagmi'
import { Provider } from 'react-redux'
import { store } from '@/store'
import { fetchWeETHBalance } from '@/store/slices/balance/thunks'

/**
 * Initializes the store and dispatches actions.
 * The main purpose of this component is to take data that you usually get from hooks (like Wagmi hooks) and load them into the store.
 * @param children - The children components to render.
 * @returns The component that provides the Redux store to its children.
 */
export function StoreInitializer({ children }: { children: React.ReactNode }) {
  const dispatch = useAppDispatch()
  const { address } = useAccount()

  useEffect(
    function () {
      if (address) dispatch(setAddress(address))
      dispatch(fetchWeETHBalance())
    },
    [address, dispatch]
  )

  return <Provider store={store}>{children}</Provider>
}
