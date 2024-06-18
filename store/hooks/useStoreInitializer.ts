import { useAccount } from 'wagmi'
import { useAppDispatch } from '../hooks'
import { setAddress } from '@/store/slices/account'
import { useEffect } from 'react'
import { fetchEthPrice } from '@/store/slices/price'
import { fetchBridgeApy, fetchBridgeRate, fetchBridgeTvl } from '@/store/slices/bridges/thunks'
import { BridgeKey } from '@/config/bridges'

export function useStoreInitializer() {
  const dispatch = useAppDispatch()
  const { address } = useAccount()

  useEffect(() => {
    if (address) dispatch(setAddress(address))
  }, [address, dispatch])

  useEffect(() => {
    dispatch(fetchEthPrice())
    Object.values(BridgeKey).forEach((key) => {
      dispatch(fetchBridgeTvl(key))
      dispatch(fetchBridgeApy(key))
      dispatch(fetchBridgeRate(key))
    })
  }, [dispatch])
}
