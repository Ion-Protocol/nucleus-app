import { setAddress } from '@/store/slices/account'
import { deferExecution } from '@/utils/misc'
import { useEffect } from 'react'
import { useAccount } from 'wagmi'
import { useAppDispatch, useAppSelector } from '../hooks'
import { selectNetworkKey } from '../slices/chain'
import { selectAvailableNetworkAssetKeys } from '../slices/networkAssets'
import { fetchNetworkAssetTvl } from '../slices/networkAssets/thunks'
import { fetchUsdPerBtcRate, fetchUsdPerEthRate } from '../slices/price'
import { userProofApiSlice } from '../slices/userProofSlice/apiSlice'

export function useStoreInitializer() {
  const { address } = useAccount()
  const dispatch = useAppDispatch()

  const networkKey = useAppSelector(selectNetworkKey)
  const networkAssetKeys = useAppSelector(selectAvailableNetworkAssetKeys)

  useEffect(() => {
    if (address) {
      dispatch(setAddress(address))

      // Load the user merkle proof data for claiming rewards
      dispatch(userProofApiSlice.endpoints.getUserProofByWallet.initiate({ walletAddress: address, chainId: 1 }))
    }
  }, [address, dispatch])

  useEffect(() => {
    deferExecution(() => {
      dispatch(fetchUsdPerEthRate())
      dispatch(fetchUsdPerBtcRate())

      networkAssetKeys.forEach((key) => {
        dispatch(fetchNetworkAssetTvl(key))
      })
    })
    // Reason for disabling the eslint rule: eslint is detecting that `state` is not in the dependency array but is used in the useEffect.
    // We don't need this useEffect to trigger when state changes. This would cause the useEffect to trigger constantly since state is an object.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [networkKey, dispatch])
}
