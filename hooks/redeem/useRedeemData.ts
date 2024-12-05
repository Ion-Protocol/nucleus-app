import { atomicQueueContractAddress } from '@/config/constants'
import { RootState } from '@/store'
import { useGetRateInQuoteSafeQuery } from '@/store/slices/accountantApi'
import { useAllowanceQuery } from '@/store/slices/erc20Api'
import {
  selectContractAddressByName,
  selectRedeemBridgeData,
  selectRedeemLayerZeroChainSelector,
} from '@/store/slices/networkAssets/selectors'
import { useGetPreviewFeeQuery } from '@/store/slices/tellerApi'
import { RedeemConfig } from '@/types/Redeem'
import { useSelector } from 'react-redux'
import { Address } from 'viem'
import { useAccount } from 'wagmi'

export const useRedeemData = (config: RedeemConfig) => {
  const { address: userAddress } = useAccount()

  const accountantAddress = useSelector((state: RootState) => selectContractAddressByName(state, 'accountant'))
  const tellerContractAddress = useSelector((state: RootState) => selectContractAddressByName(state, 'teller'))
  const layerZeroChainSelector = useSelector((state: RootState) => selectRedeemLayerZeroChainSelector(state))

  const {
    sharesTokenAddress,
    wantTokenAddress,
    destinationChainId,
    redemptionSourceChainId,
    redeemAmount,
    bridgeData,
  } = config

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

  const redeemBridgeData = useSelector(selectRedeemBridgeData)

  const {
    data: previewFee,
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
  //   WAGMI Hooks as fallback for refactoring
  // Allowance check
  //     const { data: allowance } = useReadContract({
  //       address: sharesTokenAddress,
  //       abi: erc20Abi,
  //       functionName: 'allowance',
  //       args: [userAddress!, atomicQueueContractAddress as `0x${string}`],
  //       chainId: destinationChainId,
  //     },
  //   )

  //     // Rate in quote
  //     const { data: tokenRateInQuote } = useReadContract({
  //       address: accountantAddress as `0x${string}`,
  //       abi: AccountantWithRateProvidersAbi,
  //       functionName: 'getRateInQuoteSafe',
  //       args: [wantTokenAddress],
  //       chainId: destinationChainId,
  //     })

  //     // Preview fee
  //     const { data: previewFee } = useReadContract({
  //       address: tellerContractAddress as `0x${string}`,
  //       abi: tellerABI,
  //       functionName: 'previewFee',
  //       args: [redeemAmount, bridgeData],
  //       chainId: redemptionSourceChainId,
  //       enabled: Boolean(bridgeData && tellerContractAddress),
  //     })

  return {
    allowance,
    tokenRateInQuote,
    previewFee,
  }
}
