import { setAddress } from '@/store/slices/account'
import { deferExecution } from '@/utils/misc'
import { useEffect } from 'react'
import { useAccount, useChainId } from 'wagmi'
import { useAppDispatch, useAppSelector } from '../hooks'
import { useGetAssetApysQuery } from '../slices/assetApys/api'
import { fetchAllTokenBalances } from '../slices/balance'
import { selectBridgeConfig, selectBridgeKeys } from '../slices/bridges'
import { fetchBridgeApy, fetchBridgeRate, fetchBridgeTvl } from '../slices/bridges/thunks'
import { selectChain } from '../slices/chain'
import { fetchLiquidityForAllMarkets } from '../slices/ionLens'
import { fetchCurrentBorrowRateForAllMarkets, fetchTotalSupplyForAllMarkets } from '../slices/ionPool'
import { selectNetApyEndTime } from '../slices/netApy'
import { useGetNetApyQuery } from '../slices/netApy/api'
import { useGetPositionsQuery } from '../slices/positions/api'
import { fetchEthPrice } from '../slices/price'

export function useStoreInitializer() {
  const { address } = useAccount()
  const dispatch = useAppDispatch()
  const chainId = useChainId()

  const chainKey = useAppSelector(selectChain)
  const endTime = useAppSelector(selectNetApyEndTime)
  const bridgeKeys = useAppSelector(selectBridgeKeys)
  const bridgeConfig = useAppSelector(selectBridgeConfig)

  const vaultAddress = bridgeConfig.contracts.boringVault

  // Loads all data
  // Although the backend api supports filtering by timeRange we will do it in the frontend
  // This will save on loading time and cache storage in the frontend
  useGetNetApyQuery({ address: vaultAddress, startTime: 1000, endTime })
  useGetPositionsQuery({ address: vaultAddress, chainId })
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

      bridgeKeys.forEach((key) => {
        dispatch(fetchBridgeTvl(key))
        dispatch(fetchBridgeApy(key))
        dispatch(fetchBridgeRate(key))
      })
    })
    // Reason for disabling the eslint rule: eslint is detecting that `state` is not in the dependency array but is used in the useEffect.
    // We don't need this useEffect to trigger when state changes. This would cause the useEffect to trigger constantly since state is an object.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [chainKey, dispatch])
}
