import { setAddress } from '@/store/slices/account'
import { ChainKey } from '@/types/ChainKey'
import { deferExecution } from '@/utils/misc'
import { useEffect } from 'react'
import { useAccount } from 'wagmi'
import { useAppDispatch, useAppSelector } from '../hooks'
import { useGetAssetApysQuery } from '../slices/assetApys/api'
import { fetchAllTokenBalances } from '../slices/balance'
import { selectAvailableBridgeKeys, selectBridgeConfig } from '../slices/bridges'
import { fetchBridgeApy, fetchBridgeRate, fetchBridgeTvl } from '../slices/bridges/thunks'
import { selectChainId, selectChainKey } from '../slices/chain'
import { fetchLiquidityForAllMarkets } from '../slices/ionLens'
import { selectNetApyEndTime } from '../slices/netApy'
import { useGetNetApyQuery } from '../slices/netApy/api'
import { fetchEthPrice } from '../slices/price'

export function useStoreInitializer() {
  const { address } = useAccount()
  const dispatch = useAppDispatch()

  const chainId = useAppSelector(selectChainId)
  const chainKey = useAppSelector(selectChainKey)
  const endTime = useAppSelector(selectNetApyEndTime)
  const bridgeKeys = useAppSelector(selectAvailableBridgeKeys)
  const bridgeConfig = useAppSelector(selectBridgeConfig)

  const vaultAddress = bridgeConfig?.contracts?.boringVault || null

  // Loads all data
  // Although the backend api supports filtering by timeRange we will do it in the frontend
  // This will save on loading time and cache storage in the frontend
  useGetNetApyQuery(
    { address: vaultAddress || '0x0', startTime: 1000, endTime, chainId: chainId ?? 0 },
    { skip: chainId === null || vaultAddress === null }
  )
  useGetAssetApysQuery({ chainId: chainId ?? 0 }, { skip: chainId === null })

  useEffect(() => {
    if (address) dispatch(setAddress(address))
  }, [address, dispatch])

  useEffect(() => {
    deferExecution(() => {
      dispatch(fetchEthPrice())
      dispatch(fetchAllTokenBalances())

      const shouldSkipContracts = chainKey === ChainKey.SEPOLIA || chainKey === null
      if (!shouldSkipContracts) {
        bridgeKeys.forEach((key) => {
          dispatch(fetchBridgeTvl(key))
          dispatch(fetchBridgeApy(key))
          dispatch(fetchBridgeRate(key))
        })
      }
    })
    // Reason for disabling the eslint rule: eslint is detecting that `state` is not in the dependency array but is used in the useEffect.
    // We don't need this useEffect to trigger when state changes. This would cause the useEffect to trigger constantly since state is an object.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [chainKey, dispatch])
}
