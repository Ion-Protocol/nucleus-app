import { useAccount } from 'wagmi'
import { useAppDispatch } from '../hooks'
import { setAddress } from '@/store/slices/account'
import { useEffect } from 'react'
import { fetchWeETHBalance } from '@/store/slices/balance'
import { fetchPrice } from '../slices/price'

export function useStoreInitializer() {
  const dispatch = useAppDispatch()
  const { address } = useAccount()

  useEffect(() => {
    if (address) dispatch(setAddress(address))
    dispatch(fetchWeETHBalance())
    dispatch(fetchPrice())
  }, [address, dispatch])
}
