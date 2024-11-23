import { useCallback, useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { Address } from 'viem'

import { atomicQueueContractAddress, etherscanBaseUrl, seiExplorerBaseUrl } from '@/config/constants'
import { tokensConfig } from '@/config/tokens'
import { wagmiConfig } from '@/config/wagmi'
import { RootState } from '@/store'
import { useGetRateInQuoteSafeQuery } from '@/store/api/accountantApi'
import { useUpdateAtomicRequestMutation } from '@/store/api/atomicQueueApi'
import { useAllowanceQuery, useApproveMutation } from '@/store/api/erc20Api'
import { useBridgeMutation, useGetPreviewFeeQuery } from '@/store/api/tellerApi'
import { selectAddress } from '@/store/slices/account'
import { selectTokenBalance } from '@/store/slices/balance/selectors'
import { selectNetworkId } from '@/store/slices/chain'
import {
  selectContractAddressByName,
  selectDestinationChainId,
  selectIsBridgeRequired,
  selectNetworkAssetConfig,
  selectReceiveTokenKey,
  selectReceiveTokens,
  selectRedeemAmountAsBigInt,
  selectRedeemBridgeData,
  selectRedeemLayerZeroChainSelector,
  selectRedemptionDestinationChainKey,
  selectRedemptionSourceChainId,
  selectRedemptionSourceChainKey,
} from '@/store/slices/networkAssets'
import {
  DialogStep,
  RedeemStepType,
  restoreCompletedSteps,
  setDialogStep,
  setHeaderContent,
  setOpen,
  setStatus,
  setSteps,
  setTitle,
} from '@/store/slices/stepDialog/slice'
import { calculateRedeemDeadline } from '@/utils/time'
import { switchChain } from 'wagmi/actions'

const createSteps = (isBridgeRequired: boolean): DialogStep[] => {
  if (isBridgeRequired) {
    return [
      { id: 1, type: RedeemStepType.BRIDGE, description: 'Request Bridge', state: 'idle' },
      { id: 2, type: RedeemStepType.APPROVE, description: 'Approve', state: 'idle' },
      { id: 3, type: RedeemStepType.REQUEST, description: 'Request Withdraw', state: 'idle' },
    ]
  }
  return [
    { id: 1, type: RedeemStepType.APPROVE, description: 'Approve', state: 'idle' },
    { id: 2, type: RedeemStepType.REQUEST, description: 'Request Withdraw', state: 'idle' },
  ]
}

// Add new state type
type RedeemStatus = {
  currentStep: RedeemStepType | null
  isLoading: boolean
}

export const useRedeem = () => {
  const dispatch = useDispatch()
  const deadline = calculateRedeemDeadline() // default value in function is 3 days
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

  /**
   * Selectors for token balance on destination chain (always mainnet) and
   * the source chain. This is a safety guard to check if user has funds on mainnet
   * from a previous bridge but failure to redeem.
   */

  const destinationTokenBalance = useSelector((state: RootState) =>
    selectTokenBalance(state, destinationChainKey, wantTokenKey)
  )
  const sourceTokenBalance = useSelector((state: RootState) =>
    selectTokenBalance(state, redemptionSourceChainKey, wantTokenKey)
  )

  //
  const hasExcessDestinationBalance =
    destinationTokenBalance && sourceTokenBalance && BigInt(destinationTokenBalance) > redeemAmount

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

  console.log('redemptionSourceChainId', redemptionSourceChainId, 'destinationChainId', destinationChainId)
  // Bridge Data Selector, Only used for redeem with bridge
  const redeemBridgeData = useSelector(selectRedeemBridgeData)

  const sharesTokenAddress = networkAssetConfig?.token.addresses[redemptionSourceChainKey!]
  const sharesTokenKey = networkAssetConfig?.token.key

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

  /**
   ******************************************************************************
   * Watch effects
   ******************************************************************************
   */

  // Add local state to track the current step and loading state
  const [redeemStatus, setRedeemStatus] = useState<RedeemStatus>({
    currentStep: null,
    isLoading: false,
  })

  // Effect to update dialog when status changes
  useEffect(() => {
    if (redeemStatus.currentStep) {
      const stepId = getStepId(redeemStatus.currentStep)
      dispatch(
        setDialogStep({
          stepId,
          newState: redeemStatus.isLoading ? 'active' : 'completed',
        })
      )
    }
  }, [redeemStatus, getStepId, dispatch])

  /**
   ******************************************************************************
   * Handle redeem
   ******************************************************************************
   */
  const handleRedeem = async () => {
    dispatch(setTitle('Redeem Status'))
    dispatch(setSteps(createSteps(isBridgeRequired)))
    dispatch(setHeaderContent('redeemSummary'))
    dispatch(setOpen(true))

    // Before starting a new step, restore completed steps
    dispatch(restoreCompletedSteps())

    if (!destinationChainId || !redemptionSourceChainId) {
      console.error('Destination or source chain ID is not set')
      return
    }

    // Check if a bridge is required
    if (redemptionSourceChainKey !== destinationChainKey) {
      dispatch(restoreCompletedSteps())
      const bridgeStepId = getStepId(RedeemStepType.BRIDGE)
      if (!redeemBridgeData || !previewFeeAsBigInt || !layerZeroChainSelector) {
        console.error('Bridge data missing:', { redeemBridgeData, previewFeeAsBigInt, layerZeroChainSelector })
        dispatch(setHeaderContent('Error'))
        dispatch(
          setStatus({
            type: 'error',
            message: 'Missing bridge data',
          })
        )
        dispatch(setOpen(true))
        return
      }
      //////////////////////////////////////////////////////////////////////////
      // 1. Switch chains to redemption source chain if needed
      //     If the chain the wallet is connected to does not match the source
      //     chain that the user selected, switch it to the source chain.
      //////////////////////////////////////////////////////////////////////////
      if (isBridgeRequired) {
        console.log('Switching chain for bridge:', {
          from: networkId,
          to: redemptionSourceChainId,
        })
        await switchChain(wagmiConfig, { chainId: redemptionSourceChainId! })
      }

      if (!redeemBridgeData || !tellerContractAddress || !userAddress || !previewFeeAsBigInt) {
        console.error('Bridge requirements missing:', {
          redeemBridgeData,
          tellerContractAddress,
          userAddress,
          previewFeeAsBigInt,
        })
        dispatch(setHeaderContent('Error'))
        dispatch(
          setStatus({
            type: 'error',
            message: 'Missing bridge data',
          })
        )
        dispatch(setOpen(true))
        return
      }

      if (layerZeroChainSelector !== 0 && redeemBridgeData) {
        if (networkId !== redemptionSourceChainId) {
          console.log('Switching chain for bridge:', {
            from: networkId,
            to: redemptionSourceChainId,
          })
          try {
            await switchChain(wagmiConfig, { chainId: redemptionSourceChainId })
          } catch (switchError) {
            console.error('Chain switch failed:', switchError)
            throw new Error('Failed to switch to the correct network. Please switch manually and try again.')
          }
        }

        // Call Bridge function
        try {
          dispatch(setDialogStep({ stepId: bridgeStepId, newState: 'active' }))
          console.log('Bridge parameters:', {
            shareAmount: redeemAmount,
            bridgeData: redeemBridgeData,
            contractAddress: tellerContractAddress,
            chainId: redemptionSourceChainId,
            fee: previewFeeAsBigInt?.fee,
          })

          if (!previewFeeAsBigInt?.fee) {
            throw new Error('Bridge fee is undefined')
          }

          const txHash = await bridge({
            shareAmount: redeemAmount,
            bridgeData: redeemBridgeData,
            contractAddress: tellerContractAddress,
            chainId: redemptionSourceChainId,
            fee: previewFeeAsBigInt.fee,
          }).unwrap()

          if (!txHash) {
            throw new Error('Bridge transaction failed - no transaction hash returned')
          }

          dispatch(
            setDialogStep({
              stepId: bridgeStepId,
              newState: 'completed',
              link: `${seiExplorerBaseUrl}tx/${txHash}`,
            })
          )
        } catch (error) {
          console.error('Bridge transaction failed:', error)
          dispatch(setDialogStep({ stepId: bridgeStepId, newState: 'error' }))
          dispatch(
            setStatus({
              type: 'error',
              message: 'Bridge transaction failed',
              fullMessage: error instanceof Error ? error.message : 'Unknown error occurred',
            })
          )
          return
        }
      }
    }

    //////////////////////////////////////////////////////////////////////////
    // 2. Prepare atomic request data
    // 2.1. Apply 0.2% fee to the rateInQuoteSafe
    // 2.2. Create userRequest object with Fee applied
    // @params userRequest:
    //   deadline: BigInt(deadline)
    //   atomicPrice: tokenRateInQuote?.rateInQuoteSafe!
    //   offerAmount: redeemAmount
    //   inSolve: false
    // 2.3. Create atomicRequestArgs object
    // @params atomicRequestArgs:
    //   offer: sharesTokenAddress
    //   want: wantTokenAddress
    //   userRequest: userRequest
    // 2.4. Create atomicRequestOptions object
    // @params atomicRequestOptions:
    //   atomicQueueContractAddress: atomicQueueContractAddress
    //   chainId: destinationChainId!
    //////////////////////////////////////////////////////////////////////////
    const rateInQuoteWithFee = (tokenRateInQuote?.rateInQuoteSafe! * BigInt(9980)) / BigInt(10000)
    console.log('rateInQuoteWithFee', rateInQuoteWithFee)
    const userRequest = {
      deadline: BigInt(deadline),
      atomicPrice: rateInQuoteWithFee,
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
      chainId: destinationChainId!,
    }

    let approveTokenTxHash: `0x${string}` | undefined

    //////////////////////////////////////////////////////////////////////////
    // 3. Approve shares token for withdrawal if needed
    //////////////////////////////////////////////////////////////////////////
    dispatch(restoreCompletedSteps())
    if (!allowance || allowance < redeemAmount) {
      const approveStepId = getStepId(RedeemStepType.APPROVE)
      try {
        // Switch chain if needed - fixing the chain switching logic
        if (networkId !== destinationChainId) {
          console.log('Switching chain for approval:', {
            from: networkId,
            to: destinationChainId,
          })
          try {
            await switchChain(wagmiConfig, { chainId: destinationChainId })
          } catch (switchError) {
            console.error('Chain switch failed:', switchError)
            throw new Error('Failed to switch to the correct network. Please switch manually and try again.')
          }
        }

        // Handle approval
        dispatch(setDialogStep({ stepId: approveStepId, newState: 'active' }))
        approveTokenTxHash = await approveErc20({
          tokenAddress: sharesTokenAddress as `0x${string}`,
          spenderAddress: atomicQueueContractAddress,
          amount: redeemAmount,
          chainId: destinationChainId,
        }).unwrap()
        if (approveTokenTxHash) {
          dispatch(
            setDialogStep({
              stepId: approveStepId,
              newState: 'completed',
              link: `${etherscanBaseUrl}tx/${approveTokenTxHash}`,
            })
          )
        }
      } catch (error) {
        console.error('Approval failed:', error)
        dispatch(setDialogStep({ stepId: approveStepId, newState: 'error' }))
        dispatch(
          setStatus({
            type: 'error',
            message: 'Approval failed',
            fullMessage: error instanceof Error ? error.message : 'Unknown error occurred',
          })
        )
        return
      }
    } else {
      const approveStepId = getStepId(RedeemStepType.APPROVE)
      dispatch(setDialogStep({ stepId: approveStepId, newState: 'completed' }))
    }

    //////////////////////////////////////////////////////////////////////////
    // 4. Update atomic request
    //////////////////////////////////////////////////////////////////////////
    dispatch(restoreCompletedSteps())
    if ((!allowance || allowance < redeemAmount) && !approveTokenTxHash) {
      console.error('Insufficient allowance:', { allowance, redeemAmount, approveTokenTxHash })
      dispatch(setHeaderContent('Error'))
      dispatch(
        setStatus({
          type: 'error',
          message: 'Insufficient allowance',
        })
      )
      return
    }
    const requestStepId = getStepId(RedeemStepType.REQUEST)
    try {
      if (networkId !== destinationChainId) {
        await switchChain(wagmiConfig, { chainId: destinationChainId! })
      }
      dispatch(restoreCompletedSteps())
      dispatch(setDialogStep({ stepId: requestStepId, newState: 'active' }))

      const updateAtomicRequestTxHash = await updateAtomicRequest({
        atomicRequestArg: atomicRequestArgs,
        atomicRequestOptions: atomicRequestOptions,
      }).unwrap()
      // Mock updateAtomicRequest with delay
      // const updateAtomicRequestTxHash = await new Promise<string>((resolve) => {
      //   setTimeout(() => {
      //     resolve('0x123...')
      //   }, 2000) // 2 second delay
      // })

      if (updateAtomicRequestTxHash) {
        dispatch(
          setDialogStep({
            stepId: requestStepId,
            newState: 'completed',
            link: `${etherscanBaseUrl}tx/${updateAtomicRequestTxHash}`,
          })
        )
        dispatch(
          setStatus({
            type: 'success',
          })
        )
        dispatch(setHeaderContent('redeemSummary'))
      }
    } catch (error) {
      console.error('Atomic request failed:', error)
      dispatch(setDialogStep({ stepId: requestStepId, newState: 'error' }))
      dispatch(
        setStatus({
          type: 'error',
          message: 'Request failed',
          fullMessage: error instanceof Error ? error.message : 'Unknown error occurred',
        })
      )
      return
    }
  }

  return {
    handleRedeem,
    isValid,
    redeemAmount,
    isLoading: redeemStatus.isLoading || isApproveErc20Loading || isUpdateAtomicRequestLoading || isBridgeLoading,
  }
}
