import { useDispatch, useSelector } from 'react-redux'
import { Address } from 'viem'
import { useEffect, useCallback, useMemo } from 'react'
import { type RedeemSummaryCardProps } from '@/components/NetworkAsset/MintAndRedeem/Redeem/RedeemSummaryCard'
import { tokensConfig } from '@/config/tokens'
import { RootState } from '@/store'
import { setOpen, setSteps, setTitle, setExtraContent, setDialogStep, StepState } from '@/store/slices/stepDialog/slice'
import {
  selectNetworkAssetConfig,
  selectReceiveTokens,
  selectReceiveTokenKey,
  selectRedeemAmountAsBigInt,
  selectSourceChainKey,
  selectContractAddressByName,
} from '@/store/slices/networkAssets'
import { selectTokenBalance } from '@/store/slices/balance/selectors'
import { selectAddress } from '@/store/slices/account'
import { selectNetworkId } from '@/store/slices/chain'
import { useAllowanceQuery, useApproveMutation } from '@/store/api/erc20Api'
import { useUpdateAtomicRequestMutation } from '@/store/api/atomicQueueApi'
import { useWaitForTransactionReceiptQuery } from '@/store/api/transactionReceiptApt'
import { useGetRateInQuoteSafeQuery } from '@/store/api/accountantApi'
import { atomicQueueContractAddress } from '@/config/constants'
import { calculateDeadline } from '@/utils/time'

interface RedeemState {
  isApproving: boolean
  isRequesting: boolean
  isReceiving: boolean
  error: string | null
}

export const useRedeem = () => {
  const deadline = calculateDeadline() // default value in function is 3 days
  const dispatch = useDispatch()
  // Selectors
  const userAddress = useSelector(selectAddress)
  const chainId = useSelector(selectNetworkId)
  const networkAssetConfig = useSelector(selectNetworkAssetConfig)
  console.log('networkAssetConfig', networkAssetConfig)
  const destinationChainKey = useSelector(selectSourceChainKey)
  const redeemAmount = useSelector(selectRedeemAmountAsBigInt)
  const accountantAddress = useSelector((state: RootState) => selectContractAddressByName(state, 'accountant'))
  const tokenKeys = useSelector(selectReceiveTokens)
  const wantTokenKey = useSelector(selectReceiveTokenKey)

  // Derive token configuration from selectors
  const sharesTokenAddress = networkAssetConfig?.token.addresses[destinationChainKey]
  const sharesTokenKey = networkAssetConfig?.token.key
  const tokenBalance = useSelector((state: RootState) =>
    selectTokenBalance(state, destinationChainKey, sharesTokenKey!)
  )
  const effectiveWantTokenKey = wantTokenKey || tokenKeys[0] || null
  const wantTokenAddress = effectiveWantTokenKey
    ? tokensConfig[effectiveWantTokenKey as keyof typeof tokensConfig].addresses[destinationChainKey]
    : null

  // Query hooks
  const { data: allowance } = useAllowanceQuery(
    {
      tokenAddress: sharesTokenAddress as `0x${string}`,
      spenderAddress: atomicQueueContractAddress,
      userAddress: userAddress!,
    },
    {
      skip: !userAddress || !sharesTokenAddress,
    }
  )

  const { data: tokenRateInQuote } = useGetRateInQuoteSafeQuery({
    quote: wantTokenAddress as Address,
    contractAddress: accountantAddress!,
    chainId: chainId!,
  })

  // Mutation hooks
  const [
    approveErc20,
    {
      data: approveErc20TxHash,
      error: approveErc20Error,
      isSuccess: isApproveErc20Success,
      isLoading: isApproveErc20Loading,
      isError: isApproveErc20Error,
    },
  ] = useApproveMutation()
  const [
    updateAtomicRequest,
    {
      data: atomicRequestResponse,
      error: atomicRequestError,
      isSuccess: isUpdateAtomicRequestSuccess,
      isLoading: isUpdateAtomicRequestLoading,
      isError: isUpdateAtomicRequestError,
    },
  ] = useUpdateAtomicRequestMutation()

  const { data: txReceipt, isLoading: txReceiptLoading } = useWaitForTransactionReceiptQuery(
    { hash: atomicRequestResponse?.response! },
    { skip: !atomicRequestResponse }
  )

  const handleRedeem = async () => {
    // TODO: Check if redeem amount is greater than token balance and throw an error
    // if (redeemAmount > allow) {
    //   return
    // }
    const userRequest = {
      deadline: BigInt(deadline),
      atomicPrice: tokenRateInQuote?.rateInQuoteSafe!,
      offerAmount: redeemAmount,
      inSolve: false,
    }

    const atomicRequestArgs = {
      offer: sharesTokenAddress! as Address,
      want: wantTokenAddress! as Address,
      userRequest: userRequest,
    }

    const atomicRequestOptions = {
      atomicQueueContractAddress: atomicQueueContractAddress as Address,
      chainId: chainId!,
    }

    if (!allowance || allowance < redeemAmount) {
      try {
        await approveErc20({
          tokenAddress: sharesTokenAddress as `0x${string}`,
          spenderAddress: atomicQueueContractAddress,
          amount: redeemAmount,
          chainId: chainId!,
        })
        await updateAtomicRequest({
          atomicRequestArg: atomicRequestArgs,
          atomicRequestOptions: atomicRequestOptions,
        })
      } catch (error) {
        console.error('Error approving ERC20 token:', error)
      }
    }

    if (approveErc20TxHash || (allowance && allowance >= redeemAmount)) {
      try {
        await updateAtomicRequest({
          atomicRequestArg: atomicRequestArgs,
          atomicRequestOptions: atomicRequestOptions,
        })
      } catch (error) {
        console.error('Error updating atomic request:', error)
      }
    }
  }

  return handleRedeem
}
