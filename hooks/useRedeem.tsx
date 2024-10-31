import { useDispatch, useSelector } from 'react-redux'
import { setOpen, setSteps, setTitle, setExtraContent, setDialogStep, StepState } from '@/store/slices/stepDialog/slice'
import { ChainKey } from '@/types/ChainKey'

import RedeemSummaryCard, {
  type RedeemSummaryCardProps,
} from '@/components/NetworkAsset/MintAndRedeem/Redeem/RedeemSummaryCard'
import {
  selectNetworkAssetConfig,
  selectRedeemAmount,
  selectRedeemAmountAsBigInt,
  selectSourceChainId,
  selectSourceChainKey,
} from '@/store/slices/networkAssets'
import { atomicQueueContractAddress } from '@/config/constants'
import { selectAddress } from '@/store/slices/account'
import { selectNetworkId } from '@/store/slices/chain'
import { switchChain } from 'wagmi/actions'
import { wagmiConfig } from '@/config/wagmi'
import { useAllowanceQuery, useApproveMutation } from '@/store/api/erc20Api'
import { chainsConfig } from '@/config/chains'
import { selectNetworkAssetFromRoute } from '@/store/slices/router'
import { tokensConfig } from '@/config/tokens'

export function useRedeem() {
  const dispatch = useDispatch()
  const userAddress = useSelector(selectAddress)
  const redeemAmount = useSelector(selectRedeemAmountAsBigInt)

  const chainId = useSelector(selectNetworkId)
  const destinationChainKey = useSelector(selectSourceChainKey)
  // const destinationChainId = chainsConfig[destinationChainKey as ChainKey]
  const networkAssetConfig = useSelector(selectNetworkAssetConfig)
  const tokenAddress = networkAssetConfig?.token.addresses[destinationChainKey]
  console.log('networkAssetConfig:', networkAssetConfig?.token)
  console.log('tokenAddress:', tokenAddress)

  const destinationChainId = useSelector(selectSourceChainId)

  const sourceChainKey = networkAssetConfig?.deployedOn
  const sourceChainId = chainsConfig[destinationChainKey as ChainKey].id
  const networkAssetFromRoute = useSelector(selectNetworkAssetFromRoute)
  console.log('Destination chain Key:', destinationChainKey)
  console.log('Destination chain ID:', destinationChainId)
  console.log('Source chain ID:', sourceChainId)
  console.log('sourceChainKey:', sourceChainKey)
  console.log('networkAssetFromRoute:', networkAssetFromRoute)

  // if (chainId !== sourceChainId) {
  //   switchChain(wagmiConfig, { chainId: sourceChainId })
  // }

  console.log('Chain ID:', chainId)
  console.log('Source chain key:', sourceChainKey)
  console.log('Destination chain:', destinationChainKey)
  // 1. Check for bridge

  // 2. Check for allowance
  const {
    data: allowance,
    isLoading: allowanceLoading,
    isError: allowanceError,
  } = useAllowanceQuery(
    {
      tokenAddress: tokenAddress as `0x${string}`,
      spenderAddress: atomicQueueContractAddress,
      userAddress: userAddress!,
    },
    {
      skip: !userAddress || !tokenAddress,
    }
  )
  console.log('allowance:', allowance)
  console.log('allowanceLoading:', allowanceLoading)
  console.log('allowanceError:', allowanceError)
  console.log('redeemAmount:', redeemAmount)

  // 3. if no allowance or allowance < redeem amount Approve ERC20 spend
  const [approve, results { isLoading: approveLoading, isError: approveError }] = useApproveMutation()

  // 4. Request withdraw

  // 5. Receive ETH

  // 6. Set the steps for the redeem process

  const handleRedeem = async (summaryData: RedeemSummaryCardProps) => {
    // Set the dialog title
    dispatch(setTitle('Order Status'))

    // Set the steps for the redeem process
    dispatch(
      setSteps([
        { id: '1', description: 'Approve', state: 'idle' },
        { id: '2', description: 'Request Withdraw', state: 'idle' },
        { id: '3', description: 'Receive ETH', state: 'idle' },
      ])
    )

    // Set the extra content with the summary card
    dispatch(setExtraContent('test mint'))
    dispatch(setOpen(true))

    // Handle the approval if needed
    if (!allowance || allowance < redeemAmount) {
      try {
        dispatch(
          setDialogStep({
            stepId: '1',
            newState: 'active',
          })
        )
        await approve({
          tokenAddress: tokenAddress as `0x${string}`,
          spenderAddress: atomicQueueContractAddress,
          amount: redeemAmount,
          chainId: 1,
        }).unwrap()
        dispatch(
          setDialogStep({
            stepId: '1',
            newState: 'completed',
          })
        )
        // Continue with next steps...
      } catch (error) {
        dispatch(
          setDialogStep({
            stepId: '1',
            newState: 'error',
          })
        )
      }
    }
  }

  return { handleRedeem }
}
