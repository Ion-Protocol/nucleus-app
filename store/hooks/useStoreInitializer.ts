import { setAddress } from '@/store/slices/account'
import { deferExecution } from '@/utils/misc'
import { useEffect } from 'react'
import { useAccount } from 'wagmi'
import { useAppDispatch, useAppSelector } from '../hooks'
import { selectNetworkKey } from '../slices/chain'
import { selectAvailableNetworkAssetKeys, selectSourceTokenKey } from '../slices/networkAssets'
import { fetchClaimedAmountsOfAssets, fetchNetworkAssetTvl, fetchPaused } from '../slices/networkAssets/thunks'
import { fetchUsdPerBtcRate, fetchUsdPerEthRate } from '../slices/price'
import { userProofApi } from '../slices/userProofSlice/apiSlice'
import { redstoneApi } from '../slices/redstoneSlice/apiSlice'
import { selectTotalClaimables } from '../slices/userProofSlice/selectors'
import { fetchTokenRateInQuote } from '../slices/networkAssets/thunks'

export function useStoreInitializer() {
  const { address } = useAccount()
  const dispatch = useAppDispatch()

  const networkKey = useAppSelector(selectNetworkKey)
  const networkAssetKeys = useAppSelector(selectAvailableNetworkAssetKeys)
  const sourceTokenKey = useAppSelector(selectSourceTokenKey)
  const claimables = useAppSelector(selectTotalClaimables)

  useEffect(() => {
    if (!sourceTokenKey) return
    dispatch(fetchTokenRateInQuote(sourceTokenKey))
  }, [sourceTokenKey, dispatch])

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
