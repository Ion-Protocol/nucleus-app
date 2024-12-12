import { atomicQueueContractAddress } from '@/config/constants'
import { RootState } from '@/store'
import { selectAddress } from '@/store/slices/account'
import { useGetRateInQuoteSafeQuery } from '@/store/slices/accountantApi'
import { useAllowanceQuery } from '@/store/slices/erc20Api'
import {
  selectContractAddressByName,
  selectDestinationChainId,
  selectIsBridgeRequired,
  selectRedeemAmountAsBigInt,
  selectRedeemBridgeData,
  selectRedemptionSourceChainId,
  selectWantAssetAddress,
  selectWithdrawalFee,
} from '@/store/slices/networkAssets/selectors'
import { useGetPreviewFeeQuery } from '@/store/slices/tellerApi'
import { applyWithdrawalFeeReduction } from '@/utils/withdrawal'
import { useSelector } from 'react-redux'
import { Address } from 'viem'

export const useRedeemData = () => {
  // Selectors that apply to multiple query hooks
  const userAddress = useSelector(selectAddress)

  // Token Allowance Query Selectors
  const sharesTokenAddress = useSelector((state: RootState) => selectContractAddressByName(state, 'boringVault'))
  const destinationChainId = useSelector(selectDestinationChainId) // Destination for want asset

  // Token Allowance Query Hook
  // TODO: Update to return whole query object to allow destructuring where needed. Will allow for better access to loading states and errors
  const { data: allowance } = useAllowanceQuery(
    {
      tokenAddress: sharesTokenAddress!,
      spenderAddress: atomicQueueContractAddress,
      userAddress: userAddress!,
      chainId: destinationChainId!,
    },
    {
      skip: !userAddress || !sharesTokenAddress,
    }
  )

  // Token Rate in Quote Selectors
  const accountantAddress = useSelector((state: RootState) => selectContractAddressByName(state, 'accountant'))
  const wantTokenAddress = useSelector(selectWantAssetAddress)

  // Token Rate in Quote Query Hook
  // TODO: Update to return whole query object to allow destructuring where needed. Will allow for better access to loading states and errors
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

  // Apply Fee to Token Rate in Quote
  const withdrawalFee = useSelector(selectWithdrawalFee)
  const rateInQuoteWithFee = tokenRateInQuote?.rateInQuoteSafe
    ? applyWithdrawalFeeReduction(BigInt(tokenRateInQuote?.rateInQuoteSafe), withdrawalFee)
    : BigInt(0)

  // Bridge Preview Fee Selectors. Note: Only applies to withdrawal with Bridge
  const redeemAmount = useSelector(selectRedeemAmountAsBigInt)
  const tellerContractAddress = useSelector((state: RootState) => selectContractAddressByName(state, 'teller'))
  const redemptionSourceChainId = useSelector(selectRedemptionSourceChainId) // Id of chain where redemption starts
  const redeemBridgeData = useSelector(selectRedeemBridgeData)
  const isBridgeRequired = useSelector(selectIsBridgeRequired)

  // Preview Fee Query Hook. Note: Only applies to withdrawal with Bridge
  // TODO: Update to return whole query object to allow destructuring where needed. Will allow for better access to loading states and errors
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
        !redeemBridgeData || !tellerContractAddress || !redemptionSourceChainId || !redeemAmount || !isBridgeRequired,
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