import { BridgeKey } from '@/config/bridges'
import { setAddress } from '@/store/slices/account'
import { useEffect } from 'react'
import { useAccount } from 'wagmi'
import { useAppDispatch, useAppSelector } from '../hooks'
import { init } from '../init'
import { useGetAssetApysQuery } from '../slices/assetApys/api'
import { selectNetApyEndTime } from '../slices/netApy'
import { useGetNetApyQuery } from '../slices/netApy/api'
import { useGetPositionsQuery } from '../slices/positions/api'
import { selectBridgeKey } from '../slices/router'

export function useStoreInitializer() {
  const dispatch = useAppDispatch()
  const { address } = useAccount()
  const startTime = 10_000 // 10 seconds after the epoch
  const endTime = useAppSelector(selectNetApyEndTime)

  const bridgeKey = useAppSelector(selectBridgeKey) as BridgeKey
  // const vaultAddress = bridgesConfig[bridgeKey].contracts.boringVault
  const vaultAddress = '0x5e6d7C88f4Be6387f0a9006562d10f8d1C89e84E'

  // Loads all data
  // Although the backend api supports filtering by timeRange we will do it in the frontend
  // This will save on loading time and cache storage in the frontend
  useGetNetApyQuery({ address: vaultAddress, startTime, endTime })
  useGetPositionsQuery({ address: vaultAddress })
  useGetAssetApysQuery({})

  useEffect(() => {
    if (address) dispatch(setAddress(address))
  }, [address, dispatch])

  useEffect(() => {
    init(dispatch)
  }, [dispatch])
}
