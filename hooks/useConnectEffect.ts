import { useEffect } from 'react'
import { useAccount } from 'wagmi'
import { useAppDispatch } from '../store/hooks'
import { clearAddress, setAddress } from '../store/slices/account'
import { clearBalances, fetchAllTokenBalances } from '../store/slices/balance'

export function useConnectEffect() {
  const { isConnected, address } = useAccount()
  const dispatch = useAppDispatch()

  useEffect(() => {
    if (!isConnected) {
      dispatch(clearAddress())
      dispatch(clearBalances())
    }
    if (isConnected && address) {
      dispatch(setAddress(address))
      dispatch(fetchAllTokenBalances())
    }
  }, [dispatch, isConnected, address])
}
