import { useDispatch, useSelector } from 'react-redux'
import { Address } from 'viem'
import { ChainKey } from '@/types/ChainKey'
import { tokensConfig } from '@/config/tokens'
import { setOpen, setSteps, setTitle, setExtraContent, setDialogStep, StepState } from '@/store/slices/stepDialog/slice'
import { useEffect } from 'react'

import RedeemSummaryCard, {
  type RedeemSummaryCardProps,
} from '@/components/NetworkAsset/MintAndRedeem/Redeem/RedeemSummaryCard'
import {
  selectNetworkAssetConfig,
  selectReceiveTokens,
  selectRedeemAmount,
  selectReceiveTokenKey,
  selectRedeemAmountAsBigInt,
  selectTokenAddressByTokenKey,
  selectSourceChainId,
  selectSourceChainKey,
  selectContractAddressByName,
} from '@/store/slices/networkAssets'
import { atomicQueueContractAddress } from '@/config/constants'
import { selectAddress } from '@/store/slices/account'
import { selectNetworkId } from '@/store/slices/chain'
import { useAllowanceQuery, useApproveMutation } from '@/store/api/erc20Api'
import { chainsConfig } from '@/config/chains'
import { selectNetworkAssetFromRoute } from '@/store/slices/router'
import { useUpdateAtomicRequestMutation } from '@/store/api/atomicQueueApi'
import { useWaitForTransactionReceiptQuery } from '@/store/api/transactionReceiptApt'
import { RootState } from '@/store'
import { useGetRateInQuoteSafeQuery } from '@/store/api/accountantApi'

export function useRedeem() {
  const deadline = 3
  const accountantAddress = useSelector((state: RootState) => selectContractAddressByName(state, 'accountant'))
  const dispatch = useDispatch()
  const userAddress = useSelector(selectAddress)
  const redeemAmount = useSelector(selectRedeemAmountAsBigInt)

  const chainId = useSelector(selectNetworkId)

  const destinationChainKey = useSelector(selectSourceChainKey)
  // const destinationChainId = chainsConfig[destinationChainKey as ChainKey]
  const networkAssetConfig = useSelector(selectNetworkAssetConfig)
  const sharesTokenAddress = networkAssetConfig?.token.addresses[destinationChainKey]
  const tokenKeys = useSelector(selectReceiveTokens)
  const wantTokenKey = useSelector(selectReceiveTokenKey) || tokenKeys[0] || null
  const wantTokenAddress = tokensConfig[wantTokenKey as keyof typeof tokensConfig].addresses[destinationChainKey]
  const networkAssetFromRoute = useSelector(selectNetworkAssetFromRoute)
  const networkAssetName = networkAssetFromRoute ? tokensConfig[networkAssetFromRoute].name : ''
  const receiveAssetAddress = useSelector((state: RootState) => selectTokenAddressByTokenKey(state, wantTokenKey))

  const { data: tokenRateInQuote } = useGetRateInQuoteSafeQuery({
    quote: receiveAssetAddress! as Address,
    contractAddress: accountantAddress!,
    chainId: chainId!,
  })

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

  console.log('atomicRequestArgs:', atomicRequestArgs)
  console.log('atomicRequestOptions:', atomicRequestOptions)
  const destinationChainId = useSelector(selectSourceChainId)

  const sourceChainKey = networkAssetConfig?.deployedOn
  const sourceChainId = chainsConfig[destinationChainKey as ChainKey].id

  // if (chainId !== sourceChainId) {
  //   switchChain(wagmiConfig, { chainId: sourceChainId })
  // }

  // 1. Check for bridge

  // 2. Check for allowance
  const {
    data: allowance,
    isLoading: allowanceLoading,
    isError: allowanceError,
  } = useAllowanceQuery(
    {
      tokenAddress: sharesTokenAddress as `0x${string}`,
      spenderAddress: atomicQueueContractAddress,
      userAddress: userAddress!,
    },
    {
      skip: !userAddress || !sharesTokenAddress,
    }
  )
  console.log('allowance:', allowance)
  console.log('allowanceLoading:', allowanceLoading)
  console.log('allowanceError:', allowanceError)
  console.log('redeemAmount:', redeemAmount)

  // 3. if no allowance or allowance < redeem amount Approve ERC20 spend
  const [approve, { data: txHash, isLoading: approveLoading, isError: approveError, isSuccess: approveSuccess }] =
    useApproveMutation()
  const [
    updateAtomicRequest,
    {
      data: atomicRequestResponse,
      isLoading: updateAtomicRequestLoading,
      isError: updateAtomicRequestError,
      isSuccess: updateAtomicRequestSuccess,
    },
  ] = useUpdateAtomicRequestMutation()

  console.log('atomicRequestResponse:', atomicRequestResponse)
  console.log('updateAtomicRequestLoading:', updateAtomicRequestLoading)
  console.log('updateAtomicRequestError:', updateAtomicRequestError)
  console.log('updateAtomicRequestSuccess:', updateAtomicRequestSuccess)

  const {
    data: txReceipt,
    isLoading: txReceiptLoading,
    isError: txReceiptError,
  } = useWaitForTransactionReceiptQuery({ hash: atomicRequestResponse?.response! }, { skip: !atomicRequestResponse })

  console.log('txReceipt:', txReceipt)
  console.log('txReceiptLoading:', txReceiptLoading)
  console.log('txReceiptError:', txReceiptError)

  if (approveLoading) {
    dispatch(
      setDialogStep({
        stepId: '1',
        newState: 'active',
      })
    )
  }
  if (approveSuccess) {
    dispatch(
      setDialogStep({
        stepId: '1',
        newState: 'completed',
      })
    )
  }
  console.log('txReceipt:', txReceipt)
  if (approveError) {
    dispatch(
      setDialogStep({
        stepId: '1',
        newState: 'error',
      })
    )
  }

  useEffect(() => {
    if (txHash && !atomicRequestResponse) {
      updateAtomicRequest({
        atomicRequestArg: atomicRequestArgs,
        atomicRequestOptions: atomicRequestOptions,
      })
    }
  }, [txHash, atomicRequestResponse])

  if (updateAtomicRequestLoading) {
    dispatch(
      setDialogStep({
        stepId: '2',
        newState: 'active',
      })
    )
  }
  if (updateAtomicRequestSuccess) {
    dispatch(
      setDialogStep({
        stepId: '2',
        newState: 'completed',
      })
    )
  }
  if (updateAtomicRequestError) {
    dispatch(
      setDialogStep({
        stepId: '2',
        newState: 'error',
      })
    )
  }
  // 4. Request withdraw

  // 5. Receive ETH

  // 6. Set the steps for the redeem process

  const handleRedeem = ({ summaryData }: { summaryData: RedeemSummaryCardProps }) => {
    // Set the dialog title
    dispatch(setTitle('Order Status'))

    // Set the steps for the redeem process
    dispatch(
      setSteps([
        { id: '1', description: 'Approve', state: 'active' },
        { id: '2', description: 'Request Withdraw', state: 'idle' },
        { id: '3', description: 'Receive ETH', state: 'idle' },
      ])
    )

    // Set the extra content with the summary card
    dispatch(setExtraContent('test mint'))
    dispatch(setOpen(true))

    // Handle the approval if needed
    if (!allowance || allowance < redeemAmount) {
      approve({
        tokenAddress: sharesTokenAddress as `0x${string}`,
        spenderAddress: atomicQueueContractAddress,
        amount: redeemAmount,
        chainId: chainId!,
      })
    }

    // if (txHash && !atomicRequestResponse) {
    //   updateAtomicRequest({
    //     atomicRequestArg: atomicRequestArgs,
    //     atomicRequestOptions: atomicRequestOptions,
    //   })
    // }
  }

  return { handleRedeem }
}
