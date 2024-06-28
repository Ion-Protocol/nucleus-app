import { BridgeKey, bridgesConfig } from '@/config/bridges'
import { setAddress } from '@/store/slices/account'
import { useEffect } from 'react'
import { useAccount } from 'wagmi'
import { useAppDispatch, useAppSelector } from '../hooks'
import { useGetAssetApysQuery } from '../slices/assetApys/api'
import { fetchAllTokenBalances } from '../slices/balance'
import { fetchBridgeApy, fetchBridgeRate, fetchBridgeTvl } from '../slices/bridges/thunks'
import { selectChain } from '../slices/chain'
import { fetchLiquidityForAllMarkets } from '../slices/ionLens'
import { fetchCurrentBorrowRateForAllMarkets, fetchTotalSupplyForAllMarkets } from '../slices/ionPool'
import { selectNetApyEndTime } from '../slices/netApy'
import { useGetNetApyQuery } from '../slices/netApy/api'
import { useGetPositionsQuery } from '../slices/positions/api'
import { fetchEthPrice } from '../slices/price'
import { selectBridgeKey } from '../slices/router'
import { deferExecution } from '@/utils/misc'

export function useStoreInitializer() {
  const dispatch = useAppDispatch()
  const chainKey = useAppSelector(selectChain)
  const { address } = useAccount()
  const endTime = useAppSelector(selectNetApyEndTime)

  const bridgeKey = useAppSelector(selectBridgeKey) as BridgeKey
  const vaultAddress = bridgesConfig[bridgeKey].contracts.boringVault

  // Loads all data
  // Although the backend api supports filtering by timeRange we will do it in the frontend
  // This will save on loading time and cache storage in the frontend
  useGetNetApyQuery({ address: vaultAddress, startTime: 1000, endTime })
  useGetPositionsQuery({ address: vaultAddress })
  useGetAssetApysQuery({})

  useEffect(() => {
    if (address) dispatch(setAddress(address))
  }, [address, dispatch])

  useEffect(() => {
    // This is necessary to defer execution of the callback until the next event loop tick,
    // ensuring that the correct chainId is set by wagmi after SSR has initialized it to 1.
    deferExecution(() => {
      dispatch(fetchEthPrice())
      dispatch(fetchLiquidityForAllMarkets())
      dispatch(fetchTotalSupplyForAllMarkets())
      dispatch(fetchCurrentBorrowRateForAllMarkets())
      dispatch(fetchAllTokenBalances())

      const bridgeKeys = Object.keys(bridgesConfig).filter(
        (bridgeKey) => !bridgesConfig[bridgeKey as BridgeKey].comingSoon
      ) as BridgeKey[]
      bridgeKeys.forEach((key) => {
        dispatch(fetchBridgeTvl(key))
        dispatch(fetchBridgeApy(key))
        dispatch(fetchBridgeRate(key))
      })
    })
  }, [chainKey, dispatch])
}
