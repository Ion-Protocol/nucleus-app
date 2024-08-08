import { setAddress } from '@/store/slices/account'
import { ChainKey } from '@/types/ChainKey'
import { deferExecution } from '@/utils/misc'
import { useEffect } from 'react'
import { useAccount } from 'wagmi'
import { useAppDispatch, useAppSelector } from '../hooks'
import { fetchAllTokenBalances } from '../slices/balance'
import { selectAvailableBridgeKeys } from '../slices/bridges'
import { fetchBridgeRate, fetchBridgeTvl } from '../slices/bridges/thunks'
import { selectChainKey } from '../slices/chain'
import { fetchEthPrice } from '../slices/price'

export function useStoreInitializer() {
  const { address } = useAccount()
  const dispatch = useAppDispatch()

  const chainKey = useAppSelector(selectChainKey)
  const bridgeKeys = useAppSelector(selectAvailableBridgeKeys)

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
          dispatch(fetchBridgeRate(key))
        })
      }
    })
    // Reason for disabling the eslint rule: eslint is detecting that `state` is not in the dependency array but is used in the useEffect.
    // We don't need this useEffect to trigger when state changes. This would cause the useEffect to trigger constantly since state is an object.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [chainKey, dispatch])
}
