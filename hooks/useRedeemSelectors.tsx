import { tokensConfig } from '@/config/tokens'
import { RootState } from '@/store'
import { useGetRateInQuoteSafeQuery } from '@/store/api/accountantApi'
import { useGetPreviewFeeQuery } from '@/store/api/tellerApi'
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
  selectRedeemAmount,
  selectRedeemAmountAsBigInt,
  selectRedeemBridgeData,
  selectRedeemLayerZeroChainSelector,
  selectRedemptionDestinationChainKey,
  selectRedemptionSourceChainId,
  selectRedemptionSourceChainKey,
} from '@/store/slices/networkAssets'
import { bigIntToNumberAsString, WAD } from '@/utils/bigint'
import { calculateRedeemDeadline } from '@/utils/time'
import { useSelector } from 'react-redux'
import { Address, formatUnits } from 'viem'

export const useRedeemSelectors = () => {
  const deadline = calculateRedeemDeadline() // default value in function is 3 days
  const fee = 0
  const userAddress = useSelector(selectAddress)
  const networkAssetConfig = useSelector(selectNetworkAssetConfig)

  // Chain IDs and Keys
  const networkId = useSelector(selectNetworkId)
  const redemptionSourceChainId = useSelector(selectRedemptionSourceChainId)
  const destinationChainId = useSelector(selectDestinationChainId)
  const redemptionSourceChainKey = useSelector(selectRedemptionSourceChainKey)
  const destinationChainKey = useSelector(selectRedemptionDestinationChainKey)

  // Explorer URLs
  const redemptionSourceExplorerBaseUrl =
    networkAssetConfig?.redeem.redemptionSourceChains[redemptionSourceChainKey!]?.explorerBaseUrl
  const redemptionDestinationExplorerBaseUrl =
    networkAssetConfig?.redeem.redemptionDestinationChains[destinationChainKey!]?.explorerBaseUrl

  // Bridge and Contract Related
  const isBridgeRequired = useSelector(selectIsBridgeRequired)
  const accountantAddress = useSelector((state: RootState) => selectContractAddressByName(state, 'accountant'))
  const tellerContractAddress = useSelector((state: RootState) => selectContractAddressByName(state, 'teller'))
  const layerZeroChainSelector = useSelector(selectRedeemLayerZeroChainSelector)

  // Token Related
  const redeemAmount = useSelector(selectRedeemAmount)
  const redeemAmountAsBigInt = useSelector(selectRedeemAmountAsBigInt)
  const tokenKeys = useSelector(selectReceiveTokens)
  const wantTokenKey = useSelector(selectReceiveTokenKey)

  // Token Balances
  const destinationTokenBalance = useSelector((state: RootState) =>
    selectTokenBalance(state, destinationChainKey, wantTokenKey)
  )
  const sourceTokenBalance = useSelector((state: RootState) =>
    selectTokenBalance(state, redemptionSourceChainKey, wantTokenKey)
  )

  // Bridge Data
  const redeemBridgeData = useSelector(selectRedeemBridgeData)

  // Derived Values
  const hasExcessDestinationBalance =
    destinationTokenBalance && sourceTokenBalance && BigInt(destinationTokenBalance) > redeemAmountAsBigInt

  const sharesTokenAddress = networkAssetConfig?.token.addresses[redemptionSourceChainKey!]
  const sharesTokenKey = networkAssetConfig?.token.key

  const effectiveWantTokenKey = wantTokenKey || tokenKeys[0] || null

  const wantTokenAddress = effectiveWantTokenKey
    ? tokensConfig[effectiveWantTokenKey as keyof typeof tokensConfig].addresses[destinationChainKey!]
    : null

  const isValid = Boolean(
    redeemAmountAsBigInt > BigInt(0) &&
      networkAssetConfig &&
      networkId &&
      redemptionSourceChainId &&
      destinationChainId &&
      redemptionSourceChainKey &&
      destinationChainKey &&
      accountantAddress &&
      tellerContractAddress
  )

  const tokenRateInQuoteSafeQuery = useGetRateInQuoteSafeQuery(
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
    data: previewFee,
    isLoading: isPreviewFeeLoading,
    isFetching: isPreviewFeeFetching,
    isError: isPreviewFeeError,
    error: previewFeeError,
  } = useGetPreviewFeeQuery(
    {
      shareAmount: redeemAmountAsBigInt,
      bridgeData: redeemBridgeData!,
      contractAddress: tellerContractAddress!,
      chainId: redemptionSourceChainId!,
    },
    {
      skip:
        !redeemBridgeData ||
        !tellerContractAddress ||
        !redemptionSourceChainId ||
        !redeemAmountAsBigInt ||
        layerZeroChainSelector === 0,
    }
  )

  // Calculate rate with 0.02% fee
  const rateInQuoteWithFee = tokenRateInQuoteSafeQuery.data?.rateInQuoteSafe
    ? (tokenRateInQuoteSafeQuery.data.rateInQuoteSafe * BigInt(9980)) / BigInt(10000)
    : BigInt(0)

  const formattedTokenRateWithFee = bigIntToNumberAsString(rateInQuoteWithFee, { maximumFractionDigits: 4 })
  const formattedTokenRateWithFeeFull = bigIntToNumberAsString(rateInQuoteWithFee, { maximumFractionDigits: 18 })

  // Calculate redeem amount using rate
  const receiveAmountAsBigInt =
    rateInQuoteWithFee > 0 ? (redeemAmountAsBigInt * rateInQuoteWithFee) / WAD.bigint : redeemAmountAsBigInt

  // Format the amount for display
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
    previewFee,
    userAddress,
    networkAssetConfig,
    networkId,
    redemptionSourceChainId,
    destinationChainId,
    redemptionSourceChainKey,
    destinationChainKey,
    redemptionSourceExplorerBaseUrl,
    redemptionDestinationExplorerBaseUrl,
    isBridgeRequired,
    accountantAddress,
    tellerContractAddress,
    layerZeroChainSelector,
    redeemAmount,
    redeemAmountAsBigInt,
    receiveAmountAsBigInt,
    redeemAmountTruncated,
    receiveAmountTruncated,
    receiveAmountFormattedFull,
    formattedTokenRateWithFee,
    formattedTokenRateWithFeeFull,
    tokenKeys,
    wantTokenKey,
    destinationTokenBalance,
    sourceTokenBalance,
    hasExcessDestinationBalance,
    redeemBridgeData,
    sharesTokenAddress,
    sharesTokenKey,
    effectiveWantTokenKey,
    wantTokenAddress,
    isValid,
  }
}
