import { BridgeKey } from '@/config/bridges'
import { setAddress } from '@/store/slices/account'
import { fetchBridgeApy, fetchBridgeRate, fetchBridgeTvl } from '@/store/slices/bridges/thunks'
import { fetchEthPrice } from '@/store/slices/price'
import { useEffect } from 'react'
import { useAccount } from 'wagmi'
import { useAppDispatch, useAppSelector } from '../hooks'
import { selectNetApyEndTime, selectNetApyStartTime, selectNetApyTimeRange } from '../slices/netApy'
import { useGetNetApyQuery } from '../slices/netApy/api'

export function useStoreInitializer() {
  const dispatch = useAppDispatch()
  const { address } = useAccount()
  const timeRange = useAppSelector(selectNetApyTimeRange)
  const startTime = useAppSelector(selectNetApyStartTime)
  const endTime = useAppSelector(selectNetApyEndTime)

  useGetNetApyQuery(
    { address: address || '0x0', startTime, endTime, timeRange },
    {
      skip: !address,
    }
  )

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
