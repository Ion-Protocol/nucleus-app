import { atomicQueueContractAddress } from '@/config/constants'
import { RootState } from '@/store'
import { useGetRateInQuoteSafeQuery } from '@/store/slices/accountantApi'
import { useAllowanceQuery } from '@/store/slices/erc20Api'
import {
  selectContractAddressByName,
  selectRedeemBridgeData,
  selectRedeemLayerZeroChainSelector,
  selectWithdrawalFee,
} from '@/store/slices/networkAssets/selectors'
import { useGetPreviewFeeQuery } from '@/store/slices/tellerApi'
import { RedeemConfig } from '@/types/Redeem'
import { applyWithdrawalFeeReduction } from '@/utils/withdrawal'
import { useSelector } from 'react-redux'
import { Address } from 'viem'

export const useRedeemData = (config: RedeemConfig) => {
  const accountantAddress = useSelector((state: RootState) => selectContractAddressByName(state, 'accountant'))
  const tellerContractAddress = useSelector((state: RootState) => selectContractAddressByName(state, 'teller'))
  const layerZeroChainSelector = useSelector((state: RootState) => selectRedeemLayerZeroChainSelector(state))

  const {
    userAddress,
    sharesTokenAddress,
    wantTokenAddress,
    destinationChainId,
    redemptionSourceChainId,
    redeemAmount,
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

  const withdrawalFee = useSelector(selectWithdrawalFee)
  const rateInQuoteWithFee = tokenRateInQuote?.rateInQuoteSafe
    ? applyWithdrawalFeeReduction(BigInt(tokenRateInQuote?.rateInQuoteSafe), withdrawalFee)
    : BigInt(0)

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

  return {
    allowance,
    tokenRateInQuote,
    rateInQuoteWithFee,
    withdrawalFee,
    previewFee,
  }
}
