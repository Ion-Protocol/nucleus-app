import { useEffect } from 'react'
import { useAccount } from 'wagmi'
import { useAppDispatch } from '../store/hooks'
import { clearAddress } from '../store/slices/account'
import { clearBalances } from '../store/slices/balance'

export function useDisconnectEffect() {
  const { isConnected } = useAccount()
  const dispatch = useAppDispatch()

  useEffect(() => {
    if (!isConnected) {
      dispatch(clearAddress())
      dispatch(clearBalances())
    }
  }, [dispatch, isConnected])
}
