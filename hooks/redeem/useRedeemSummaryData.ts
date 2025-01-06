import { tokensConfig } from '@/config/tokens'
import { useGetTokenPriceQuery } from '@/store/slices/coinGecko'
import {
  selectIsBridgeRequired,
  selectNativeAsset,
  selectNetworkAssetConfig,
  selectReceiveTokenKey,
  selectReceiveTokens,
  selectRedeemAmount,
  selectRedeemAmountAsBigInt,
  selectRedemptionDestinationChainKey,
  selectRedemptionSourceChainKey,
  selectWithdrawalFee,
} from '@/store/slices/networkAssets'
import { WAD, bigIntToNumberAsString } from '@/utils/bigint'
import { useSelector } from 'react-redux'
import { formatUnits } from 'viem'
import { useRedeemData } from './useRedeemData'
import { useAppSelector } from '@/store/hooks'

export const useRedeemSummaryData = () => {
  const { useGetTokenRateInQuote, usePreviewFee, rateInQuoteWithFee } = useRedeemData()
  const { data: previewFee } = usePreviewFee
  const nativeAsset = useSelector(selectNativeAsset)
  const { data: tokenPrice } = useGetTokenPriceQuery(nativeAsset?.coinGeckoId!, {
    skip: !nativeAsset?.coinGeckoId,
  })

  const withdrawalDestinationChainKey = useSelector(selectRedemptionDestinationChainKey)
  const redemptionSourceChainKey = useSelector(selectRedemptionSourceChainKey)

  const withdrawalFee = useSelector(selectWithdrawalFee)

  const networkAssetConfig = useSelector(selectNetworkAssetConfig)
  const isBridgeRequired = useSelector(selectIsBridgeRequired)
  const tokenKeys = useSelector(selectReceiveTokens)
  const receiveTokenKey = useAppSelector(selectReceiveTokenKey)
  const receiveToken = tokensConfig[receiveTokenKey as keyof typeof tokensConfig]
  const sharesTokenKey = networkAssetConfig?.token.name

  const redeemAmount = useSelector(selectRedeemAmount)
  const redeemAmountAsBigInt = useSelector(selectRedeemAmountAsBigInt)

  // Calculate redeem amount using rate
  const receiveAmountAsBigInt =
    rateInQuoteWithFee > 0 ? (redeemAmountAsBigInt * rateInQuoteWithFee) / WAD.bigint : redeemAmountAsBigInt

  // Format the amount for display
  const formattedTokenRateWithFee = bigIntToNumberAsString(rateInQuoteWithFee, { maximumFractionDigits: 4 })
  const formattedTokenRateWithFeeFull = bigIntToNumberAsString(rateInQuoteWithFee, { maximumFractionDigits: 18 })
  const formattedPreviewFee = previewFee?.feeAsString && tokenPrice ? Number(previewFee.feeAsString) * tokenPrice : 0

  const decimalAmountForPrecisionCheck = parseFloat(formatUnits(receiveAmountAsBigInt, 18))
  const redeemAmountTruncated = bigIntToNumberAsString(redeemAmountAsBigInt, {
    minimumFractionDigits: 0,
    maximumFractionDigits: 4,
  })
  const receiveAmountTruncated = bigIntToNumberAsString(receiveAmountAsBigInt, {
    minimumFractionDigits: 0,
    maximumFractionDigits: 4,
  })
  const receiveAmountFormattedFull = bigIntToNumberAsString(receiveAmountAsBigInt, {
    minimumFractionDigits: 0,
    maximumFractionDigits: decimalAmountForPrecisionCheck < 1 ? 18 : 8,
  })

  return {
    useGetTokenRateInQuote,
    usePreviewFee,
    rateInQuoteWithFee,
    withdrawalDestinationChainKey,
    redemptionSourceChainKey,
    withdrawalFee,
    isBridgeRequired,
    tokenKeys,
    receiveToken,
    sharesTokenKey,
    nativeAsset,
    redeemAmount,
    redeemAmountAsBigInt,
    receiveAmountAsBigInt,
    formattedTokenRateWithFee,
    formattedTokenRateWithFeeFull,
    formattedPreviewFee,
    redeemAmountTruncated,
    receiveAmountTruncated,
    receiveAmountFormattedFull,
  }
}
