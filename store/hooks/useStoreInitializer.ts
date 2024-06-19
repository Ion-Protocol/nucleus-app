import { BridgeKey, bridgesConfig } from '@/config/bridges'
import { setAddress } from '@/store/slices/account'
import { fetchBridgeApy, fetchBridgeRate, fetchBridgeTvl } from '@/store/slices/bridges/thunks'
import { fetchEthPrice } from '@/store/slices/price'
import { useEffect } from 'react'
import { useAccount } from 'wagmi'
import { useAppDispatch, useAppSelector } from '../hooks'
import { selectNetApyEndTime, selectNetApyStartTime, selectNetApyTimeRange } from '../slices/netApy'
import { useGetNetApyQuery } from '../slices/netApy/api'
import { selectBridgeKey } from '../slices/router'

export function useStoreInitializer() {
  const dispatch = useAppDispatch()
  const { address } = useAccount()
  const timeRange = useAppSelector(selectNetApyTimeRange)
  const startTime = useAppSelector(selectNetApyStartTime)
  const endTime = useAppSelector(selectNetApyEndTime)

  const bridgeKey = useAppSelector(selectBridgeKey)
  const vaultAddress = bridgesConfig[bridgeKey].contracts.boringVault

  useGetNetApyQuery({ address: vaultAddress, startTime, endTime, timeRange })

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
