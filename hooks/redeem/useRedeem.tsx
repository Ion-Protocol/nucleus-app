import { useCallback, useEffect, useRef, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { Address } from 'viem'
import { useAccount } from 'wagmi'

import { atomicQueueContractAddress, etherscanBaseUrl, seiExplorerBaseUrl } from '@/config/constants'
import { useUpdateAtomicRequestMutation } from '@/store/slices/atomicQueueApi'
import { selectNetworkId } from '@/store/slices/chain'
import { useApproveMutation } from '@/store/slices/erc20Api'
import { selectIsBridgeRequired } from '@/store/slices/networkAssets'
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
import { BridgeData, useBridgeMutation } from '@/store/slices/tellerApi'
import { useLazyWaitForTransactionReceiptQuery } from '@/store/slices/transactionReceiptApt'
import { AtomicRequestArgs, AtomicRequestOptions } from '@/utils/atomicRequest'
import { useChainManagement } from '../useChainManagement'

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

type BaseRedeemData = {
  isBridgeRequired: boolean
  userAddress: Address
  redeemAmount: bigint
  allowance?: bigint
  sharesTokenAddress: Address
  wantTokenAddress: Address
  redemptionSourceChainId: number
  destinationChainId: number
  atomicRequestData: {
    atomicRequestArgs: AtomicRequestArgs
    atomicRequestOptions: AtomicRequestOptions
  }
}

type StandardRedeemData = BaseRedeemData & {
  isBridgeRequired: false
  redeemBridgeData?: never
}

type RedeemWithBridgeData = BaseRedeemData & {
  isBridgeRequired: true
  redeemWithBridgeData: {
    tellerContractAddress: Address
    previewFeeAsBigInt: bigint
    layerZeroChainSelector: number
    bridgeData: BridgeData
  }
}

type HandleRedeem = StandardRedeemData | RedeemWithBridgeData

export const useRedeem = () => {
  const txHashRef = useRef<string | null>(null)
  const isProcessingRef = useRef(false)

  // Add state for debugging
  const [debugState, setDebugState] = useState({
    lastTxHash: null as string | null,
    mutationState: '',
  })
  const dispatch = useDispatch()
  const { switchToChain } = useChainManagement()
  const { chainId } = useAccount()

  const networkId = useSelector(selectNetworkId) // Id of chain user is connected to
  const isBridgeRequired = useSelector(selectIsBridgeRequired)

  const renderCount = useRef(0)

  useEffect(() => {
    renderCount.current += 1
    console.log(`useRedeem hook rendered ${renderCount.current} times`)
  })

  const getStepId = useCallback(
    (stepType: RedeemStepType): number => {
      const steps = createSteps(isBridgeRequired)
      const step = steps.find((s) => s.type === stepType)
      return step?.id || 0
    },
    [isBridgeRequired]
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
    queryErc20TxReceipt,
    {
      data: approveErc20Receipt,
      error: approveErc20ReceiptError,
      isLoading: isApproveErc20TxReceiptLoading,
      isSuccess: isApproveErc20TxReceiptSuccess,
      isError: isApproveErc20ReceiptError,
      status: approveErc20Status,
    },
  ] = useLazyWaitForTransactionReceiptQuery()

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
    queryAtomicRequestReceipt,
    {
      data: atomicRequestReceipt,
      error: atomicRequestReceiptError,
      isLoading: isAtomicRequestReceiptLoading,
      isSuccess: isAtomicRequestReceiptSuccess,
      isError: isAtomicRequestReceiptError,
      status: atomicRequestStatus,
    },
  ] = useLazyWaitForTransactionReceiptQuery()

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
  const [
    queryBridgeReceipt,
    {
      data: bridgetReceipt,
      error: bridgeReceiptError,
      isLoading: isBridgeReceiptLoading,
      isSuccess: isBridgeReceiptSuccess,
      isError: isBridgeReceiptError,
      status: bridgeStatus,
    },
  ] = useLazyWaitForTransactionReceiptQuery()

  /**
   ******************************************************************************
   * Watch effects
   ******************************************************************************
   */

  // Add effect to track mutation state
  useEffect(() => {
    if (isUpdateAtomicRequestSuccess) {
      console.log('Mutation succeeded:', {
        atomicRequestResponse,
        storedHash: txHashRef.current,
      })
    }
  }, [isUpdateAtomicRequestSuccess, atomicRequestResponse])

  useEffect(() => {
    console.log('Chain changed:', networkId)
  }, [networkId])

  // Add local state to track the current step and loading state
  const [redeemStatus, setRedeemStatus] = useState<RedeemStatus>({
    currentStep: null,
    isLoading: false,
  })

  /**
   ******************************************************************************
   * Handle redeem
   ******************************************************************************
   */

  const MAINNET_CHAINSTACK_URL = process.env.NEXT_PUBLIC_MAINNET_CHAINSTACK_URL || ''

  const handleRedeem = async (data: HandleRedeem) => {
    const {
      isBridgeRequired,
      redemptionSourceChainId,
      destinationChainId,
      redeemAmount,
      allowance,
      atomicRequestData,
      sharesTokenAddress,
    } = data

    console.log('Environment info:', {
      nodeEnv: process.env.NODE_ENV,
      chainId: networkId,
      rpcUrl: MAINNET_CHAINSTACK_URL, // or however you configure this
    })

    console.log('Starting atomic request in', process.env.NODE_ENV, 'environment')

    dispatch(setTitle('Redeem Status'))
    dispatch(setSteps(createSteps(isBridgeRequired)))
    dispatch(setHeaderContent('redeemSummary'))
    dispatch(setOpen(true))
    // Before starting a new step, restore completed steps
    dispatch(restoreCompletedSteps())

    // Check if a bridge is required
    if (isBridgeRequired) {
      const redeemWithBridgeData = data.redeemWithBridgeData
      dispatch(restoreCompletedSteps())
      const bridgeStepId = getStepId(RedeemStepType.BRIDGE)
      if (!redeemWithBridgeData) {
        console.error('Bridge data missing:', { redeemWithBridgeData })
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
        await switchToChain(redemptionSourceChainId!)
      }

      // Call Bridge function
      try {
        dispatch(setDialogStep({ stepId: bridgeStepId, newState: 'active' }))
        const { previewFeeAsBigInt, layerZeroChainSelector, bridgeData, tellerContractAddress } = redeemWithBridgeData
        console.log('Bridge parameters:', {
          shareAmount: redeemAmount,
          bridgeData: bridgeData,
          contractAddress: tellerContractAddress,
          chainId: redemptionSourceChainId,
          fee: previewFeeAsBigInt,
        })

        if (!previewFeeAsBigInt) {
          throw new Error('Bridge fee is undefined')
        }

        // const txHash = await bridge({
        //   shareAmount: redeemAmount,
        //   bridgeData: bridgeData,
        //   contractAddress: tellerContractAddress,
        //   chainId: redemptionSourceChainId,
        //   fee: previewFeeAsBigInt,
        // }).unwrap()
        // Mock updateAtomicRequest with delay
        const updateAtomicRequestTxHash = await new Promise<string>((resolve) => {
          setTimeout(() => {
            resolve('0x123...')
          }, 2000) // 2 second delay
        })

        // if (!txHash) {
        //   throw new Error('Bridge transaction failed - no transaction hash returned')
        // }

        // const bridgeReceipt = await queryBridgeReceipt({ hash: txHash })
        const bridgeReceipt = await new Promise<{
          data?: {
            transactionHash: string
          }
          isError: boolean
          error: null | string
        }>((resolve) => {
          setTimeout(() => {
            resolve({
              data: {
                transactionHash: '0x123...',
                // Add other receipt fields as needed
              },
              isError: false,
              error: null,
            })
          }, 2000) // 2 second delay
        })

        if (bridgeReceipt.isError) {
          throw new Error(`Bridge Receipt Error: ${bridgeReceipt.error}`)
        }

        dispatch(
          setDialogStep({
            stepId: bridgeStepId,
            newState: 'completed',
            link: `${seiExplorerBaseUrl}tx/${bridgeReceipt.data?.transactionHash}`,
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

    console.log('chainId', networkId)
    console.log('destinationChainId', destinationChainId)
    //////////////////////////////////////////////////////////////////////////
    // 2. Approve shares token for withdrawal if needed
    //////////////////////////////////////////////////////////////////////////
    // if (networkId !== destinationChainId) {
    //   console.log('Switching to destination chain for approval:', {
    //     from: networkId,
    //     to: destinationChainId,
    //   })
    //   await switchToChain(destinationChainId)

    //   // Verify chain switch was successful
    //   if (networkId !== destinationChainId) {
    //     throw new Error(`Failed to switch to destination chain ${destinationChainId}`)
    //   }
    // }
    await switchToChain(destinationChainId)
    // Then wait a short moment for the chain switch to take effect
    await new Promise((resolve) => setTimeout(resolve, 500))

    let approveTokenTxHash: `0x${string}` | undefined
    //////////////////////////////////////////////////////////////////////////
    // 3.1 Approve shares token for withdrawal if needed
    //////////////////////////////////////////////////////////////////////////
    const approveStepId = getStepId(RedeemStepType.APPROVE)
    dispatch(setDialogStep({ stepId: approveStepId, newState: 'active' }))
    if (!allowance || allowance < redeemAmount) {
      try {
        // Handle approval
        approveTokenTxHash = await approveErc20({
          tokenAddress: sharesTokenAddress,
          spenderAddress: atomicQueueContractAddress,
          amount: redeemAmount,
          chainId: destinationChainId,
        }).unwrap()

        const approvalReceipt = await queryErc20TxReceipt({ hash: approveTokenTxHash })

        if (approvalReceipt.isError) {
          throw new Error(`Approval Error: ${approvalReceipt.error}`)
        }

        if (approveTokenTxHash) {
          dispatch(
            setDialogStep({
              stepId: approveStepId,
              newState: 'completed',
              link: `${etherscanBaseUrl}tx/${approvalReceipt.data?.transactionHash}`,
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
    // 3.2 Update atomic request
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
      const { atomicRequestArgs, atomicRequestOptions } = atomicRequestData
      dispatch(restoreCompletedSteps())
      dispatch(setDialogStep({ stepId: requestStepId, newState: 'active' }))
      // Then wait a short moment before calling updateAtomicRequest
      await new Promise((resolve) => setTimeout(resolve, 500))
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

      console.log('Transaction response:', {
        hash: updateAtomicRequestTxHash,
        env: process.env.NODE_ENV,
        timestamp: new Date().toISOString(),
      })

      txHashRef.current = updateAtomicRequestTxHash
      setDebugState((prev) => ({
        ...prev,
        lastTxHash: updateAtomicRequestTxHash,
        mutationState: 'received_hash',
      }))

      console.log('Received tx hash:', {
        hash: updateAtomicRequestTxHash,
        refHash: txHashRef.current,
      })
      console.log('updateAtomicRequestTxHash in hook:', updateAtomicRequestTxHash)

      const atomicRequestReceipt = await queryAtomicRequestReceipt({ hash: updateAtomicRequestTxHash })

      if (atomicRequestReceipt.isError) {
        throw new Error(`Atomic Request Error: ${atomicRequestReceipt.error}`)
      }

      if (updateAtomicRequestTxHash) {
        dispatch(
          setDialogStep({
            stepId: requestStepId,
            newState: 'completed',
            link: `${etherscanBaseUrl}tx/${atomicRequestReceipt.data?.transactionHash}`,
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
      console.error('Transaction failed in', process.env.NODE_ENV, 'environment:', {
        error,
        networkId,
        timestamp: new Date().toISOString(),
      })
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
    isLoading:
      redeemStatus.isLoading ||
      isApproveErc20Loading ||
      isApproveErc20TxReceiptLoading ||
      isUpdateAtomicRequestLoading ||
      isAtomicRequestReceiptLoading ||
      isBridgeLoading ||
      isBridgeReceiptLoading,
  }
}
