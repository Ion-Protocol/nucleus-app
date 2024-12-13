import { ConnectedProps, connect } from 'react-redux'

import { tokensConfig } from '@/config/tokens'
import { RootState } from '@/store'

import {
  selectContractAddressByName,
  selectDestinationChainId,
  selectIsBridgeRequired,
  selectNetworkAssetConfig,
  selectReceiveTokenKey,
  selectReceiveTokens,
  selectRedeemLayerZeroChainSelector,
  selectRedemptionSourceChainId,
  selectTokenRateInQuoteLoading,
  selectWantAssetAddress,
} from '@/store/slices/networkAssets'
import { selectNetworkAssetFromRoute } from '@/store/slices/router'

const mapState = (state: RootState, ownProps: RedeemSummaryOwnProps) => {
  const networkAssetConfig = selectNetworkAssetConfig(state)
  const nativeTokenForBridgeFee = networkAssetConfig?.chain
  const networkAssetFromRoute = selectNetworkAssetFromRoute(state)
  const tokenKeys = selectReceiveTokens(state)
  const receiveTokenKey = selectReceiveTokenKey(state) || tokenKeys[0] || null
  console.log('receiveTokenKey', receiveTokenKey)
  const receiveToken = tokensConfig[receiveTokenKey as keyof typeof tokensConfig]
  console.log('receiveToken', receiveToken)

  // used for useGetRateInQuoteSafeQuery hook
  const redeemLayerZeroChainSelector = selectRedeemLayerZeroChainSelector(state)
  const accountantAddress = selectContractAddressByName(state, 'accountant')
  const tellerAddress = selectContractAddressByName(state, 'teller')
  const wantAssetAddress = selectWantAssetAddress(state)
  console.log('receiveAssetAddress in connector:', wantAssetAddress)
  const chainId = selectDestinationChainId(state)
  const bridgeFromChainId = selectRedemptionSourceChainId(state)
  const isBridgeRequired = selectIsBridgeRequired(state)

  const networkAssetName = networkAssetFromRoute
    ? tokensConfig[networkAssetFromRoute as keyof typeof tokensConfig].name
    : ''

  return {
    accountantAddress,
    tellerAddress,
    wantAssetAddress,
    chainId,
    bridgeFromChainId,
    nativeTokenForBridgeFee,
    receiveToken: receiveToken?.name,
    exchangeRateLoading: selectTokenRateInQuoteLoading(state),
    networkAssetName,
    isBridgeRequired,
    layerZeroChainSelector: redeemLayerZeroChainSelector,
  }
}

const mapDispatch = {}

const connector = connect(mapState, mapDispatch)

export type PropsFromRedux = ConnectedProps<typeof connector>

interface RedeemSummaryOwnProps {}

interface RedeemSummaryProps extends RedeemSummaryOwnProps, PropsFromRedux {}

export namespace RedeemSummaryConnector {
  export const Connector = connector
  export type Props = RedeemSummaryProps
}
