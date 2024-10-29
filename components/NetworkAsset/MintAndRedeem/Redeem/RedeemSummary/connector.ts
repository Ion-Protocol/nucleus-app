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
  selectWantTokenKey,
  selectContractAddressByName,
  selectTokenAddressByTokenKey,
  selectSourceChainId,
} from '@/store/slices/networkAssets'
import { selectNetworkAssetFromRoute } from '@/store/slices/router'

const mapState = (state: RootState, ownProps: RedeemSummaryOwnProps) => {
  let selectedChainKey = selectSourceChainKey(state)
  const networkAssetConfig = selectNetworkAssetConfig(state)
  const networkAssetFromRoute = selectNetworkAssetFromRoute(state)
  const tokenKeys = selectSourceTokens(state)
  const wantTokenKey = selectWantTokenKey(state) || tokenKeys[0] || null
  const wantToken = tokensConfig[wantTokenKey as keyof typeof tokensConfig]
  // used for useGetRateInQuoteSafeQuery hook
  const accountantAddress = selectContractAddressByName(state, 'accountant')
  const tellerAddress = selectContractAddressByName(state, 'teller')
  const wantAssetAddress = selectTokenAddressByTokenKey(state, wantTokenKey)
  const chainId = selectSourceChainId(state)

  const networkAssetName = networkAssetFromRoute
    ? tokensConfig[networkAssetFromRoute as keyof typeof tokensConfig].name
    : ''
  const receiveOn = networkAssetConfig?.receiveOn
  const isSameChain = selectedChainKey === receiveOn

  return {
    accountantAddress,
    tellerAddress,
    wantAssetAddress,
    chainId,
    bridgeFee: selectFormattedPreviewFee(state),
    bridgeFeeLoading: selectPreviewFeeLoading(state),
    wantToken: wantToken?.name,
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
