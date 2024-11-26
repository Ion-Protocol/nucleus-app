import { setAddress } from '@/store/slices/account'
import { deferExecution } from '@/utils/misc'
import { useEffect } from 'react'
import { useAccount } from 'wagmi'
import { useAppDispatch, useAppSelector } from '../hooks'
import { selectNetworkKey } from '../slices/chain'
import { selectAvailableNetworkAssetKeys, selectSourceTokenKey } from '../slices/networkAssets'
import {
  fetchClaimedAmountsOfAssets,
  fetchNetworkAssetTvl,
  fetchPaused,
  fetchTokenRateInQuote,
} from '../slices/networkAssets/thunks'
import { fetchUsdPerBtcRate, fetchUsdPerEthRate } from '../slices/price'
import { selectNetworkAssetFromRoute } from '../slices/router'
import { userProofApi } from '../slices/userProofSlice/apiSlice'
import { selectTotalClaimables } from '../slices/userProofSlice/selectors'

export function useStoreInitializer() {
  const { address } = useAccount()
  const dispatch = useAppDispatch()

  const networkAsset = useAppSelector(selectNetworkAssetFromRoute)
  const networkKey = useAppSelector(selectNetworkKey)
  const networkAssetKeys = useAppSelector(selectAvailableNetworkAssetKeys)
  const sourceTokenKey = useAppSelector(selectSourceTokenKey)
  const claimables = useAppSelector(selectTotalClaimables)

  useEffect(() => {
    if (!sourceTokenKey || !networkAsset) return
    dispatch(fetchTokenRateInQuote(sourceTokenKey))
  }, [sourceTokenKey, dispatch, networkAsset])

  useEffect(() => {
    if (address) {
      dispatch(setAddress(address))

      // Load the user merkle proof data for claiming rewards
      dispatch(userProofApi.endpoints.getUserProofByWallet.initiate({ walletAddress: address, chainId: 1329 }))
    }
  }, [address, dispatch])

  useEffect(() => {
    if (address && claimables) {
      dispatch(fetchClaimedAmountsOfAssets())
    }
  }, [claimables, address, dispatch])

  useEffect(() => {
    deferExecution(() => {
      dispatch(fetchUsdPerEthRate())
      dispatch(fetchUsdPerBtcRate())
      dispatch(fetchPaused())
      networkAssetKeys.forEach((key) => {
        dispatch(fetchNetworkAssetTvl(key))
      })
    })
    // Reason for disabling the eslint rule: eslint is detecting that `state` is not in the dependency array but is used in the useEffect.
    // We don't need this useEffect to trigger when state changes. This would cause the useEffect to trigger constantly since state is an object.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [networkKey, dispatch])
}
