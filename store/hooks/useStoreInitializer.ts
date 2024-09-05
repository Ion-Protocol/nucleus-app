import { setAddress } from '@/store/slices/account'
import { deferExecution } from '@/utils/misc'
import { useEffect } from 'react'
import { useAccount } from 'wagmi'
import { useAppDispatch, useAppSelector } from '../hooks'
import { selectAvailableChainKeys } from '../slices/bridges'
import { fetchChainRate, fetchChainTvl } from '../slices/bridges/thunks'
import { selectNetworkKey } from '../slices/chain'
import { fetchUsdPerBtcRate, fetchUsdPerEthRate } from '../slices/price'

export function useStoreInitializer() {
  const { address } = useAccount()
  const dispatch = useAppDispatch()

  const chainKey = useAppSelector(selectNetworkKey)
  const chainKeys = useAppSelector(selectAvailableChainKeys)

  useEffect(() => {
    if (address) dispatch(setAddress(address))
  }, [address, dispatch])

  useEffect(() => {
    deferExecution(() => {
      dispatch(fetchUsdPerEthRate())
      dispatch(fetchUsdPerBtcRate())

      chainKeys.forEach((key) => {
        dispatch(fetchChainTvl(key))
        dispatch(fetchChainRate(key))
      })
    })
    // Reason for disabling the eslint rule: eslint is detecting that `state` is not in the dependency array but is used in the useEffect.
    // We don't need this useEffect to trigger when state changes. This would cause the useEffect to trigger constantly since state is an object.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [chainKey, dispatch])
}
