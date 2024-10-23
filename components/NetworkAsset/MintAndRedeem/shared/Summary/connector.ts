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
} from '@/store/slices/networkAssets'
import { selectNetworkAssetFromRoute } from '@/store/slices/router'

const mapState = (state: RootState, ownProps: SummaryOwnProps) => {
  let selectedChainKey = selectSourceChainKey(state)
  const networkAssetConfig = selectNetworkAssetConfig(state)
  const tokenRateInQuote = selectTokenRateInQuote(state)
  const networkAssetFromRoute = selectNetworkAssetFromRoute(state)
  const networkAssetName = networkAssetFromRoute ? tokensConfig[networkAssetFromRoute].name : ''
  const exchangeRate = tokenRateInQuote
    ? bigIntToNumberAsString(BigInt(tokenRateInQuote), { maximumFractionDigits: 18 })
    : '0.00'
  const truncatedExchangeRate = tokenRateInQuote
    ? bigIntToNumberAsString(BigInt(tokenRateInQuote), { maximumFractionDigits: 4 })
    : '0.00'
  const receiveOn = networkAssetConfig?.receiveOn
  const isSameChain = selectedChainKey === receiveOn

  return {
    fees: selectFormattedPreviewFee(state),
    loading: selectPreviewFeeLoading(state),
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

interface SummaryOwnProps {}

interface SummaryProps extends SummaryOwnProps, PropsFromRedux {}

export namespace SummaryConnector {
  export const Connector = connector
  export type Props = SummaryProps
}
