import { useCallback, useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { Address } from 'viem'

import { tokensConfig } from '@/config/tokens'
import { RootState } from '@/store'
import {
  setOpen,
  setSteps,
  setTitle,
  setDialogStep,
  setHeaderContent,
  DialogStep,
  RedeemStepType,
} from '@/store/slices/stepDialog/slice'
import {
  selectNetworkAssetConfig,
  selectReceiveTokens,
  selectReceiveTokenKey,
  selectRedeemAmountAsBigInt,
  selectContractAddressByName,
  selectRedemptionSourceChainId,
  selectRedemptionSourceChainKey,
  selectRedeemBridgeData,
  selectRedeemLayerZeroChainSelector,
  selectRedemptionDestinationChainKey,
  selectDestinationChainId,
  selectIsBridgeRequired,
} from '@/store/slices/networkAssets'
import { selectTokenBalance } from '@/store/slices/balance/selectors'
import { selectAddress } from '@/store/slices/account'
import { selectNetworkId } from '@/store/slices/chain'
import { useAllowanceQuery, useApproveMutation } from '@/store/api/erc20Api'
import { useUpdateAtomicRequestMutation } from '@/store/api/atomicQueueApi'
import { useWaitForTransactionReceiptQuery } from '@/store/api/transactionReceiptApt'
import { useGetRateInQuoteSafeQuery } from '@/store/api/accountantApi'
import { useBridgeMutation, useGetPreviewFeeQuery } from '@/store/api/tellerApi'
import { atomicQueueContractAddress } from '@/config/constants'
import { calculateDeadline } from '@/utils/time'
import { wagmiConfig } from '@/config/wagmi'
import { switchChain } from 'wagmi/actions'

const createSteps = (isBridgeRequired: boolean): DialogStep[] => {
  if (isBridgeRequired) {
    return [
      { id: 1, type: RedeemStepType.BRIDGE, description: 'Request Bridge', state: 'idle' },
      { id: 2, type: RedeemStepType.APPROVE, description: 'Approve', state: 'idle' },
      { id: 3, type: RedeemStepType.REQUEST, description: 'Request Withdraw', state: 'idle' },
      { id: 4, type: RedeemStepType.CONFIRM, description: 'Confirming Transaction', state: 'idle' },
    ]
  }
  return [
    { id: 1, type: RedeemStepType.APPROVE, description: 'Approve', state: 'idle' },
    { id: 2, type: RedeemStepType.REQUEST, description: 'Request Withdraw', state: 'idle' },
    { id: 3, type: RedeemStepType.CONFIRM, description: 'Confirming Transaction', state: 'idle' },
  ]
}

export const useRedeem = () => {
  const dispatch = useDispatch()
  const deadline = calculateDeadline() // default value in function is 3 days
  /**
   ******************************************************************************
   * Selectors
   * Note maybe should happen outside of this hook.
   * Data can be checked and transformed also allowing for disable of button
   * and transformation of data to be displayed in the modal.
   ******************************************************************************
   */
  const userAddress = useSelector(selectAddress)
  const networkAssetConfig = useSelector(selectNetworkAssetConfig)
  /**
   * Ids for tracking the Id of the chain the user is connected to,
   * the source chain of the redemption, and the destination chain where the withdrawal will take place
   */
  const networkId = useSelector(selectNetworkId) // Id of chain user is connected to
  const redemptionSourceChainId = useSelector(selectRedemptionSourceChainId) // Id of chain where redemption starts
  const destinationChainId = useSelector(selectDestinationChainId) // Id of chain where withdrawal will take place

  const redemptionSourceChainKey = useSelector(selectRedemptionSourceChainKey)
  const destinationChainKey = useSelector(selectRedemptionDestinationChainKey)
  const isBridgeRequired = useSelector(selectIsBridgeRequired)

  const getStepId = useCallback(
    (stepType: RedeemStepType): number => {
      const steps = createSteps(isBridgeRequired)
      const step = steps.find((s) => s.type === stepType)
      return step?.id || 0
    },
    [isBridgeRequired]
  )

  /**
   * Selectors for the accountant address, the teller contract address,
   * and the layer zero chain selector
   */
  const accountantAddress = useSelector((state: RootState) => selectContractAddressByName(state, 'accountant'))
  const tellerContractAddress = useSelector((state: RootState) => selectContractAddressByName(state, 'teller'))
  const layerZeroChainSelector = useSelector((state: RootState) => selectRedeemLayerZeroChainSelector(state))

  /**
   * Selectors for the redeem amount, the accountant address, the teller contract address,
   * the layer zero chain selector, and the token keys
   */
  const redeemAmount = useSelector(selectRedeemAmountAsBigInt)
  const tokenKeys = useSelector(selectReceiveTokens)
  const wantTokenKey = useSelector(selectReceiveTokenKey)

  const isValid = Boolean(
    redeemAmount > BigInt(0) &&
      networkAssetConfig &&
      networkId &&
      redemptionSourceChainId &&
      destinationChainId &&
      redemptionSourceChainKey &&
      destinationChainKey &&
      accountantAddress &&
      tellerContractAddress
  )
  // Bridge Data Selector, Only used for redeem with bridge
  const redeemBridgeData = useSelector(selectRedeemBridgeData)

  const sharesTokenAddress = networkAssetConfig?.token.addresses[redemptionSourceChainKey!]
  const sharesTokenKey = networkAssetConfig?.token.key

  // TODO: We will use these to handle the edge case where a user bridged but didn't redeem
  // Balance of shares token on the source chain
  const sourceSharesTokenBalance = useSelector((state: RootState) =>
    selectTokenBalance(state, redemptionSourceChainKey, sharesTokenKey!)
  )
  // Balance of shares token on the destination chain
  const destinationSharesTokenBalance = useSelector((state: RootState) =>
    selectTokenBalance(state, destinationChainKey, sharesTokenKey!)
  )
  const effectiveWantTokenKey = wantTokenKey || tokenKeys[0] || null

  const wantTokenAddress = effectiveWantTokenKey
    ? tokensConfig[effectiveWantTokenKey as keyof typeof tokensConfig].addresses[destinationChainKey!]
    : null

  /*
   ******************************************************************************
   Query hooks
   ******************************************************************************
   */

  const { data: allowance } = useAllowanceQuery(
    {
      tokenAddress: sharesTokenAddress as `0x${string}`,
      spenderAddress: atomicQueueContractAddress,
      userAddress: userAddress!,
      chainId: destinationChainId!,
    },
    {
      skip: !userAddress || !sharesTokenAddress,
    }
  )

  const {
    data: tokenRateInQuote,
    isLoading: isTokenRateInQuoteLoading,
    isError: isTokenRateInQuoteError,
    error: tokenRateInQuoteError,
  } = useGetRateInQuoteSafeQuery(
    {
      quote: wantTokenAddress as Address,
      contractAddress: accountantAddress!,
      chainId: destinationChainId!,
    },
    {
      skip: !accountantAddress || !destinationChainId,
    }
  )
  console.log('tokenRateInQuote', tokenRateInQuote, 'tokenRateInQuoteError', tokenRateInQuoteError)

  const {
    data: previewFeeAsBigInt,
    isLoading: isPreviewFeeLoading,
    isFetching: isPreviewFeeFetching,
    isError: isPreviewFeeError,
    error: previewFeeError,
  } = useGetPreviewFeeQuery(
    {
      shareAmount: redeemAmount,
      bridgeData: redeemBridgeData!,
      contractAddress: tellerContractAddress!,
      chainId: redemptionSourceChainId!,
    },
    {
      skip:
        !redeemBridgeData ||
        !tellerContractAddress ||
        !redemptionSourceChainId ||
        !redeemAmount ||
        layerZeroChainSelector === 0,
    }
  )
  console.log(
    'Preview Fee results',
    previewFeeAsBigInt,
    'isPreviewFeeLoading',
    isPreviewFeeLoading,
    'isPreviewFeeFetching',
    isPreviewFeeFetching,
    'isPreviewFeeError',
    isPreviewFeeError,
    'previewFeeError',
    previewFeeError
  )

  /**
   ******************************************************************************
   * Mutation hooks
   ******************************************************************************
   */

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

  console.log(
    'atomicRequestResponse',
    atomicRequestResponse,
    'isUpdateAtomicRequestSuccess',
    isUpdateAtomicRequestSuccess,
    'isUpdateAtomicRequestLoading',
    isUpdateAtomicRequestLoading,
    'isUpdateAtomicRequestError',
    isUpdateAtomicRequestError,
    'atomicRequestError',
    atomicRequestError
  )

  // Wait for Transaction Receipt for Atomic Request
  const {
    data: txReceipt,
    isLoading: txReceiptLoading,
    isSuccess: isTxReceiptSuccess,
    isError: isTxReceiptError,
  } = useWaitForTransactionReceiptQuery({ hash: atomicRequestResponse?.response! }, { skip: !atomicRequestResponse })

  const [
    bridge,
    {
      data: bridgeTxHash,
      error: bridgeError,
      isSuccess: isBridgeSuccess,
      isLoading: isBridgeLoading,
      isError: isBridgeError,
    },
  ] = useBridgeMutation()
  // console.log(
  //   'bridgeTxHash',
  //   bridgeTxHash,
  //   'bridgeError',
  //   bridgeError,
  //   'isBridgeSuccess',
  //   isBridgeSuccess,
  //   'isBridgeLoading',
  //   isBridgeLoading,
  //   'isBridgeError',
  //   isBridgeError
  // )

  // Wait for Transaction Receipt for Bridge
  const {
    data: bridgeTxReceipt,
    error: bridgeTxReceiptError,
    isLoading: bridgeTxReceiptLoading,
    isSuccess: isBridgeTxReceiptSuccess,
    isError: isBridgeTxReceiptError,
  } = useWaitForTransactionReceiptQuery({ hash: bridgeTxHash! }, { skip: !bridgeTxHash })
  console.log(
    'bridgeTxReceipt',
    bridgeTxReceipt,
    'bridgeTxReceiptLoading',
    bridgeTxReceiptLoading,
    'isBridgeTxReceiptSuccess',
    isBridgeTxReceiptSuccess,
    'isBridgeTxReceiptError',
    isBridgeTxReceiptError
  )

  /**
   ******************************************************************************
   * Watch effects
   ******************************************************************************
   */

  // Watch bridge status
  useEffect(() => {
    const bridgeStepId = getStepId(RedeemStepType.BRIDGE)
    if (isBridgeLoading) dispatch(setDialogStep({ stepId: bridgeStepId, newState: 'active' }))
    if (isBridgeError) {
      dispatch(setDialogStep({ stepId: bridgeStepId, newState: 'error' }))
      dispatch(setHeaderContent(`Bridge Error: ${bridgeError}`))
    }
  }, [isBridgeLoading, isBridgeSuccess, isBridgeError, dispatch, bridgeError, getStepId])

  // Watch bridge transaction receipt status
  useEffect(() => {
    const bridgeStepId = getStepId(RedeemStepType.BRIDGE)
    if (isBridgeTxReceiptSuccess) dispatch(setDialogStep({ stepId: bridgeStepId, newState: 'completed' }))
    if (isBridgeTxReceiptError) {
      dispatch(setDialogStep({ stepId: bridgeStepId, newState: 'error' }))
      dispatch(setHeaderContent(`Bridge Transaction Receipt Error: ${bridgeTxReceiptError}`))
    }
  }, [isBridgeTxReceiptSuccess, isBridgeTxReceiptError, dispatch, bridgeTxReceiptError, getStepId])

  // Watch approval status
  useEffect(() => {
    const approveStepId = getStepId(RedeemStepType.APPROVE)

    if (isApproveErc20Loading) {
      dispatch(setDialogStep({ stepId: approveStepId, newState: 'active' }))
    }
    if (isApproveErc20Success) {
      dispatch(
        setDialogStep({ stepId: approveStepId, newState: 'completed', link: approveErc20TxHash.transactionHash })
      )
    }
    if (isApproveErc20Error) {
      dispatch(setDialogStep({ stepId: approveStepId, newState: 'error' }))
      dispatch(setHeaderContent(`Approval Error: ${approveErc20Error}`))
    }
  }, [
    isApproveErc20Loading,
    isApproveErc20Success,
    isApproveErc20Error,
    dispatch,
    approveErc20Error,
    getStepId,
    approveErc20TxHash,
  ])

  // Separate effect for allowance check
  useEffect(() => {
    if (allowance && allowance >= redeemAmount) {
      const approveStepId = getStepId(RedeemStepType.APPROVE)
      dispatch(setDialogStep({ stepId: approveStepId, newState: 'completed' }))
    }
  }, [allowance, redeemAmount, dispatch, getStepId])

  // Watch atomic request status
  useEffect(() => {
    const requestStepId = getStepId(RedeemStepType.REQUEST)
    if (isUpdateAtomicRequestLoading) {
      dispatch(setDialogStep({ stepId: requestStepId, newState: 'active' }))
    }
    if (isUpdateAtomicRequestSuccess) {
      dispatch(setDialogStep({ stepId: requestStepId, newState: 'completed' }))
    }
    if (isUpdateAtomicRequestError) {
      dispatch(setDialogStep({ stepId: requestStepId, newState: 'error' }))
      dispatch(setHeaderContent(`Request Error: ${atomicRequestError}`))
    }
  }, [
    isUpdateAtomicRequestLoading,
    isUpdateAtomicRequestSuccess,
    isUpdateAtomicRequestError,
    dispatch,
    atomicRequestError,
    getStepId,
  ])

  // Watch transaction receipt status
  useEffect(() => {
    const requestStepId = getStepId(RedeemStepType.REQUEST)
    if (txReceiptLoading) dispatch(setDialogStep({ stepId: 3, newState: 'active' }))
    if (isUpdateAtomicRequestSuccess) dispatch(setDialogStep({ stepId: requestStepId, newState: 'completed' }))
    if (isTxReceiptError) dispatch(setDialogStep({ stepId: 3, newState: 'error' }))
  }, [txReceiptLoading, isTxReceiptSuccess, isTxReceiptError, dispatch, getStepId, isUpdateAtomicRequestSuccess])

  /**
   ******************************************************************************
   * Handle redeem
   ******************************************************************************
   */
  const handleRedeem = async () => {
    console.log('redemptionSourceChainId', redemptionSourceChainId)
    // Check if a bridge is required
    if (redemptionSourceChainKey !== destinationChainKey) {
      if (!redeemBridgeData || !previewFeeAsBigInt || !layerZeroChainSelector) {
        console.log('Missing redeem bridge data', redeemBridgeData, previewFeeAsBigInt, layerZeroChainSelector)
        dispatch(setHeaderContent('Error'))
        dispatch(setOpen(true))
        return
      }
      //////////////////////////////////////////////////////////////////////////
      // 1. Switch chains to redemption source chain if needed
      //     If the chain the wallet is connected to does not match the source
      //     chain that the user selected, switch it to the source chain.
      //////////////////////////////////////////////////////////////////////////
      if (networkId !== redemptionSourceChainId) {
        await switchChain(wagmiConfig, { chainId: redemptionSourceChainId! })
      }
      dispatch(setTitle('Redeem Status'))
      dispatch(setSteps(createSteps(isBridgeRequired)))
      dispatch(setHeaderContent('redeemSummary'))
      dispatch(setOpen(true))

      if (!redeemBridgeData || !tellerContractAddress || !userAddress || !previewFeeAsBigInt) {
        console.log(
          'Missing redeem bridge data',
          redeemBridgeData,
          tellerContractAddress,
          userAddress,
          previewFeeAsBigInt
        )
        dispatch(setHeaderContent('Error'))
        dispatch(setOpen(true))
        return
      }
      console.log('redeemBridgeData', redeemBridgeData)
      if (layerZeroChainSelector !== 0 && redeemBridgeData) {
        console.log('previewFeeAsBigInt', previewFeeAsBigInt)
        // Call Bridge function
        try {
          await bridge({
            shareAmount: redeemAmount,
            bridgeData: redeemBridgeData,
            contractAddress: tellerContractAddress,
            chainId: redemptionSourceChainId!,
            fee: previewFeeAsBigInt.fee,
          })
        } catch (error) {
          console.error('Error bridging:', error)
        }
      }
    }

    //////////////////////////////////////////////////////////////////////////
    // 2. Create atomic request
    // Required Parameters:
    //   deadline: BigInt(deadline)
    //   atomicPrice: tokenRateInQuote?.rateInQuoteSafe!
    //   offerAmount: redeemAmount
    //   inSolve: false
    //////////////////////////////////////////////////////////////////////////
    const userRequest = {
      deadline: BigInt(deadline),
      atomicPrice: tokenRateInQuote?.rateInQuoteSafe!,
      offerAmount: redeemAmount,
      inSolve: false,
    }
    console.log('userRequest', userRequest)

    const atomicRequestArgs = {
      offer: sharesTokenAddress! as Address,
      want: wantTokenAddress! as Address,
      userRequest: userRequest,
    }
    console.log('atomicRequestArgs', atomicRequestArgs)
    const atomicRequestOptions = {
      atomicQueueContractAddress: atomicQueueContractAddress as Address,
      chainId: destinationChainId!,
    }
    console.log('atomicRequestOptions', atomicRequestOptions)
    if (destinationChainKey === redemptionSourceChainKey) {
      // In not bridge is required we still need to dispatch the modal
      dispatch(setTitle('Redeem Status'))
      dispatch(setSteps(createSteps(isBridgeRequired)))
      dispatch(setHeaderContent('redeemSummary'))
      dispatch(setOpen(true))
    }

    //////////////////////////////////////////////////////////////////////////
    // 3. Approve shares token for withdrawal
    //////////////////////////////////////////////////////////////////////////
    if (!allowance || allowance < redeemAmount || bridgeTxReceipt) {
      if (networkId !== destinationChainId) {
        await switchChain(wagmiConfig, { chainId: destinationChainId! })
      }
      try {
        await approveErc20({
          tokenAddress: sharesTokenAddress as `0x${string}`,
          spenderAddress: atomicQueueContractAddress,
          amount: redeemAmount,
          chainId: destinationChainId!,
        })
      } catch (error) {
        console.error('Error approving ERC20 token:', error)
      }
    }

    //////////////////////////////////////////////////////////////////////////
    // 4. Update atomic request
    //////////////////////////////////////////////////////////////////////////
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

  return {
    handleRedeem,
    isValid,
    isLoading: bridgeTxReceiptLoading || isTokenRateInQuoteLoading || isApproveErc20Loading || txReceiptLoading,
  }
}
