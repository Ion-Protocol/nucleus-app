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

export function useRedeem() {
  // ? Confirm value with Jun
  const DEADLINE = 3
  const threeDaysInSeconds = 3 * 24 * 60 * 60
  const deadline = calculateDeadline()
  const dispatch = useDispatch()

  // Selectors
  const userAddress = useSelector(selectAddress)
  const chainId = useSelector(selectNetworkId)
  const networkAssetConfig = useSelector(selectNetworkAssetConfig)
  const destinationChainKey = useSelector(selectSourceChainKey)
  const redeemAmount = useSelector(selectRedeemAmountAsBigInt)
  const accountantAddress = useSelector((state: RootState) => selectContractAddressByName(state, 'accountant'))
  const tokenKeys = useSelector(selectReceiveTokens)
  const wantTokenKey = useSelector(selectReceiveTokenKey)

  // Derive token configuration from selectors
  const sharesTokenAddress = networkAssetConfig?.token.addresses[destinationChainKey]
  const effectiveWantTokenKey = wantTokenKey || tokenKeys[0] || null
  const wantTokenAddress = effectiveWantTokenKey
    ? tokensConfig[effectiveWantTokenKey as keyof typeof tokensConfig].addresses[destinationChainKey]
    : null

  // Query hooks
  const { data: allowance, isLoading: allowanceLoading } = useAllowanceQuery(
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
  const [approve, { data: txHash, isLoading: approveLoading }] = useApproveMutation()
  const [updateAtomicRequest, { data: atomicRequestResponse, isLoading: updateAtomicRequestLoading }] =
    useUpdateAtomicRequestMutation()

  const { data: txReceipt, isLoading: txReceiptLoading } = useWaitForTransactionReceiptQuery(
    { hash: atomicRequestResponse?.response! },
    { skip: !atomicRequestResponse }
  )

  // Handle transaction states
  useEffect(() => {
    const updateStepState = (stepId: string, state: StepState) => {
      dispatch(setDialogStep({ stepId, newState: state }))
    }

    if (approveLoading) updateStepState('1', 'active')
    if (txHash) updateStepState('1', 'completed')
    if (updateAtomicRequestLoading) updateStepState('2', 'active')
    if (atomicRequestResponse) updateStepState('2', 'completed')
    if (txReceiptLoading) updateStepState('3', 'active')
    if (txReceipt) updateStepState('3', 'completed')
  }, [approveLoading, txHash, updateAtomicRequestLoading, atomicRequestResponse, txReceiptLoading, txReceipt, dispatch])

  // Submit atomic request after approval
  useEffect(() => {
    if (!txHash || atomicRequestResponse) return

    const userRequest = {
      deadline: BigInt(DEADLINE),
      atomicPrice: tokenRateInQuote?.rateInQuoteSafe!,
      offerAmount: redeemAmount,
      inSolve: false,
    }

    updateAtomicRequest({
      atomicRequestArg: {
        offer: sharesTokenAddress! as Address,
        want: wantTokenAddress! as Address,
        userRequest,
      },
      atomicRequestOptions: {
        atomicQueueContractAddress: atomicQueueContractAddress as Address,
        chainId: chainId!,
      },
    })
  }, [txHash, atomicRequestResponse, sharesTokenAddress, wantTokenAddress, redeemAmount, tokenRateInQuote, chainId])

  const handleRedeem = useCallback(
    ({ summaryData }: { summaryData: RedeemSummaryCardProps }) => {
      dispatch(setTitle('Order Status'))
      dispatch(
        setSteps([
          { id: '1', description: 'Approve', state: 'active' },
          { id: '2', description: 'Request Withdraw', state: 'idle' },
          { id: '3', description: 'Receive ETH', state: 'idle' },
        ])
      )
      dispatch(setExtraContent('test mint'))
      dispatch(setOpen(true))

      if (!allowance || allowance < redeemAmount) {
        approve({
          tokenAddress: sharesTokenAddress as `0x${string}`,
          spenderAddress: atomicQueueContractAddress,
          amount: redeemAmount,
          chainId: chainId!,
        })
      }
    },
    [dispatch, allowance, redeemAmount, sharesTokenAddress, chainId]
  )

  // Memoize return values for consistent reference
  const returnValues = useMemo(
    () => ({
      handleRedeem,
      isLoading: allowanceLoading || approveLoading || updateAtomicRequestLoading || txReceiptLoading,
      isApproved: allowance && allowance >= redeemAmount,
      txHash,
      txReceipt,
    }),
    [
      handleRedeem,
      allowanceLoading,
      approveLoading,
      updateAtomicRequestLoading,
      txReceiptLoading,
      allowance,
      redeemAmount,
      txHash,
      txReceipt,
    ]
  )

  return returnValues
}
