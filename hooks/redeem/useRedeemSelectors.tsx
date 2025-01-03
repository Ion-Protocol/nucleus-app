// ! I believe this should be deleted. I don't see it used anywhere
// import { RootState } from '@/store'
// import { selectAddress } from '@/store/slices/account'
// import { useGetRateInQuoteSafeQuery } from '@/store/slices/accountantApi'
// import { selectNetworkId } from '@/store/slices/chain'
// import {
//   selectContractAddressByName,
//   selectDestinationChainId,
//   selectIsBridgeRequired,
//   selectNetworkAssetConfig,
//   selectReceiveTokenKey,
//   selectReceiveTokens,
//   selectRedeemAmount,
//   selectRedeemAmountAsBigInt,
//   selectRedeemBridgeData,
//   selectRedeemLayerZeroChainSelector,
//   selectRedemptionSourceChainId,
//   selectRedemptionSourceChainKey,
//   selectWantAssetAddress,
//   selectWithdrawalDestinationExplorerBaseUrl,
//   selectWithdrawalSourceExplorerBaseUrl,
// } from '@/store/slices/networkAssets'
// import { useGetPreviewFeeQuery } from '@/store/slices/tellerApi'
// import { bigIntToNumberAsString, WAD } from '@/utils/bigint'
// import { applyWithdrawalFeeReduction } from '@/utils/withdrawal'
// import { useSelector } from 'react-redux'
// import { Address, formatUnits } from 'viem'

// export const useRedeemSelectors = () => {
//   const userAddress = useSelector(selectAddress)
//   const networkAssetConfig = useSelector(selectNetworkAssetConfig)

//   // Chain IDs and Keys
//   const networkId = useSelector(selectNetworkId)
//   const redemptionSourceChainId = useSelector(selectRedemptionSourceChainId)
//   const destinationChainId = useSelector(selectDestinationChainId)
//   const redemptionSourceChainKey = useSelector(selectRedemptionSourceChainKey)

//   // Explorer URLs

//   const redemptionSourceExplorerBaseUrl = useSelector(selectWithdrawalSourceExplorerBaseUrl)
//   console.log('redemptionSourceExplorerBaseUrl', redemptionSourceExplorerBaseUrl)

//   const redemptionDestinationExplorerBaseUrl = useSelector(selectWithdrawalDestinationExplorerBaseUrl)
//   console.log('redemptionDestinationExplorerBaseUrl', redemptionDestinationExplorerBaseUrl)

//   // Bridge and Contract Related
//   const isBridgeRequired = useSelector(selectIsBridgeRequired)
//   const accountantAddress = useSelector((state: RootState) => selectContractAddressByName(state, 'accountant'))
//   const tellerContractAddress = useSelector((state: RootState) => selectContractAddressByName(state, 'teller'))
//   const layerZeroChainSelector = useSelector(selectRedeemLayerZeroChainSelector)

//   // Token Related
//   const redeemAmount = useSelector(selectRedeemAmount)
//   const redeemAmountAsBigInt = useSelector(selectRedeemAmountAsBigInt)
//   const tokenKeys = useSelector(selectReceiveTokens)
//   const wantTokenKey = useSelector(selectReceiveTokenKey)

//   // Bridge Data
//   const redeemBridgeData = useSelector(selectRedeemBridgeData)

//   // Derived Values

//   const sharesTokenAddress = useSelector((state: RootState) => selectContractAddressByName(state, 'boringVault'))
//   const sharesTokenKey = networkAssetConfig?.token.key

//   const effectiveWantTokenKey = wantTokenKey || tokenKeys[0] || null

//   const wantTokenAddress = useSelector(selectWantAssetAddress)

//   const isValid = Boolean(
//     redeemAmountAsBigInt > BigInt(0) &&
//       networkAssetConfig &&
//       networkId &&
//       redemptionSourceChainId &&
//       destinationChainId &&
//       redemptionSourceChainKey &&
//       accountantAddress &&
//       tellerContractAddress
//   )

//   const tokenRateInQuoteSafeQuery = useGetRateInQuoteSafeQuery(
//     {
//       quote: wantTokenAddress as Address,
//       contractAddress: accountantAddress!,
//       chainId: destinationChainId!,
//     },
//     {
//       skip: !accountantAddress || !destinationChainId,
//     }
//   )

//   const {
//     data: previewFee,
//     isLoading: isPreviewFeeLoading,
//     isFetching: isPreviewFeeFetching,
//     isError: isPreviewFeeError,
//     error: previewFeeError,
//   } = useGetPreviewFeeQuery(
//     {
//       shareAmount: redeemAmountAsBigInt,
//       bridgeData: redeemBridgeData!,
//       contractAddress: tellerContractAddress!,
//       chainId: redemptionSourceChainId!,
//     },
//     {
//       skip:
//         !redeemBridgeData ||
//         !tellerContractAddress ||
//         !redemptionSourceChainId ||
//         !redeemAmountAsBigInt ||
//         !isBridgeRequired,
//     }
//   )

//   // Calculate rate with the chain fee fee
//   const rateInQuoteWithFee = tokenRateInQuoteSafeQuery.data?.rateInQuoteSafe
//     ? applyWithdrawalFeeReduction(BigInt(tokenRateInQuoteSafeQuery.data.rateInQuoteSafe), withdrawalFee)
//     : BigInt(0)

//   const formattedTokenRateWithFee = bigIntToNumberAsString(rateInQuoteWithFee, { maximumFractionDigits: 4 })
//   const formattedTokenRateWithFeeFull = bigIntToNumberAsString(rateInQuoteWithFee, { maximumFractionDigits: 18 })

//   // Calculate redeem amount using rate
//   const receiveAmountAsBigInt =
//     rateInQuoteWithFee > 0 ? (redeemAmountAsBigInt * rateInQuoteWithFee) / WAD.bigint : redeemAmountAsBigInt

//   // Format the amount for display
//   const decimalAmountForPrecisionCheck = parseFloat(formatUnits(receiveAmountAsBigInt, 18))
//   const redeemAmountTruncated = bigIntToNumberAsString(redeemAmountAsBigInt, {
//     minimumFractionDigits: 0,
//     maximumFractionDigits: 4,
//   })
//   const receiveAmountTruncated = bigIntToNumberAsString(receiveAmountAsBigInt, {
//     minimumFractionDigits: 0,
//     maximumFractionDigits: 4,
//   })
//   const receiveAmountFormattedFull = bigIntToNumberAsString(receiveAmountAsBigInt, {
//     minimumFractionDigits: 0,
//     maximumFractionDigits: decimalAmountForPrecisionCheck < 1 ? 18 : 8,
//   })

//   return {
//     tokenRateInQuoteSafeQuery,
//     previewFee,
//     userAddress,
//     networkAssetConfig,
//     networkId,
//     redemptionSourceChainId,
//     destinationChainId,
//     redemptionSourceChainKey,
//     redemptionSourceExplorerBaseUrl,
//     redemptionDestinationExplorerBaseUrl,
//     isBridgeRequired,
//     accountantAddress,
//     tellerContractAddress,
//     layerZeroChainSelector,
//     redeemAmount,
//     redeemAmountAsBigInt,
//     receiveAmountAsBigInt,
//     redeemAmountTruncated,
//     receiveAmountTruncated,
//     receiveAmountFormattedFull,
//     formattedTokenRateWithFee,
//     formattedTokenRateWithFeeFull,
//     tokenKeys,
//     wantTokenKey,
//     redeemBridgeData,
//     sharesTokenAddress,
//     sharesTokenKey,
//     effectiveWantTokenKey,
//     wantTokenAddress,
//     isValid,
//   }
// }
