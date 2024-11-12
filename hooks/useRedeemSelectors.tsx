import { useSelector } from 'react-redux'
import { RootState } from '@/store'
import { tokensConfig } from '@/config/tokens'
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

export const useRedeemSelectors = () => {
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
  const redeemAmount = useSelector(selectRedeemAmountAsBigInt)
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
    destinationTokenBalance && sourceTokenBalance && BigInt(destinationTokenBalance) > redeemAmount

  const sharesTokenAddress = networkAssetConfig?.token.addresses[redemptionSourceChainKey!]
  const sharesTokenKey = networkAssetConfig?.token.key

  const effectiveWantTokenKey = wantTokenKey || tokenKeys[0] || null

  const wantTokenAddress = effectiveWantTokenKey
    ? tokensConfig[effectiveWantTokenKey as keyof typeof tokensConfig].addresses[destinationChainKey!]
    : null

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

  return {
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
