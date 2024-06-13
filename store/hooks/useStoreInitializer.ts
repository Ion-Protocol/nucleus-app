import { useAccount } from 'wagmi'
import { useAppDispatch } from '../hooks'
import { setAddress } from '@/store/slices/account'
import { useEffect } from 'react'
import { fetchWeETHBalance } from '@/store/slices/balance'
import { fetchPrice } from '../slices/price'
import { fetchBridgeApy, fetchBridgeTvl } from '../slices/bridges/thunks'
import { BridgeKey } from '@/config/bridges'

export function useStoreInitializer() {
  const dispatch = useAppDispatch()
  const { address } = useAccount()

  useEffect(() => {
    if (address) dispatch(setAddress(address))
  }, [address, dispatch])

  useEffect(() => {
    dispatch(fetchWeETHBalance())
    dispatch(fetchPrice())
    Object.values(BridgeKey).forEach((key) => {
      dispatch(fetchBridgeTvl(key))
      dispatch(fetchBridgeApy(key))
    })
  }, [dispatch])
}
