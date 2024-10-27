import { ConnectedProps, connect } from 'react-redux'

import { RootState } from '@/store'
import { tokensConfig } from '@/config/tokens'

import { bigIntToNumberAsString } from '@/utils/bigint'
import {
  selectFormattedPreviewFee,
  selectTokenRateInQuote,
  selectTokenRateInQuoteLoading,
  selectNetworkAssetConfig,
  selectPreviewFeeLoading,
  selectSourceChainKey,
  selectSourceTokenKey,
  selectSourceTokens,
} from '@/store/slices/networkAssets'
import { selectNetworkAssetFromRoute } from '@/store/slices/router'

const mapState = (state: RootState, ownProps: RedeemSummaryOwnProps) => {
  let selectedChainKey = selectSourceChainKey(state)
  const networkAssetConfig = selectNetworkAssetConfig(state)
  const tokenRateInQuote = selectTokenRateInQuote(state)
  const networkAssetFromRoute = selectNetworkAssetFromRoute(state)
  const tokenKeys = selectSourceTokens(state)
  const wantTokenKey = selectSourceTokenKey(state) || tokenKeys[0] || null
  const wantToken = tokensConfig[wantTokenKey as keyof typeof tokensConfig]

  const networkAssetName = networkAssetFromRoute
    ? tokensConfig[networkAssetFromRoute as keyof typeof tokensConfig].name
    : ''
  const exchangeRate = tokenRateInQuote
    ? bigIntToNumberAsString(BigInt(tokenRateInQuote), { maximumFractionDigits: 18 })
    : '0.00'
  const truncatedExchangeRate = tokenRateInQuote
    ? bigIntToNumberAsString(BigInt(tokenRateInQuote), { maximumFractionDigits: 4 })
    : '0.00'
  const receiveOn = networkAssetConfig?.receiveOn
  const isSameChain = selectedChainKey === receiveOn

  return {
    bridgeFee: selectFormattedPreviewFee(state),
    bridgeFeeLoading: selectPreviewFeeLoading(state),
    wantToken: 'ETH',
    exchangeRate,
    truncatedExchangeRate,
    exchangeRateLoading: selectTokenRateInQuoteLoading(state),
    networkAssetName,
    isSameChain,
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
