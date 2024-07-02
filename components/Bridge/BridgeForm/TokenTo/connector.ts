import { BridgeKey, bridgesConfig } from '@/config/bridges'
import { TokenKey, tokensConfig } from '@/config/token'
import { RootState } from '@/store'
import {
  selectBridgeFrom,
  selectBridgeRate,
  selectToTokenKeyForBridge,
  setSelectedToToken,
} from '@/store/slices/bridges'
import { selectBridgeKey } from '@/store/slices/router'
import { WAD, bigIntToNumber } from '@/utils/bigint'
import { ConnectedProps, connect } from 'react-redux'

const mapState = (state: RootState, ownProps: TokenToOwnProps) => {
  const bridgeKey = selectBridgeKey(state) as BridgeKey

  // Calculate "to" value
  const from = selectBridgeFrom(state, bridgeKey)
  const rate = selectBridgeRate(state, bridgeKey)
  const fromAsNumber = parseFloat(from)
  const fromAsBigInt = fromAsNumber ? BigInt(fromAsNumber * WAD.number) : BigInt(0)
  const rateAsBigInt = rate ? BigInt(rate) : BigInt(0)
  const toAsBigInt = rateAsBigInt > 0 ? (fromAsBigInt * WAD.bigint) / rateAsBigInt : fromAsBigInt
  const toFormatted = bigIntToNumber(toAsBigInt, { minimumFractionDigits: 0, maximumFractionDigits: 4 })

  // Look up list of available token keys from the bridges config
  const tokenKeys = bridgesConfig[bridgeKey].destinationTokens
  const tokens = tokenKeys.map((key) => tokensConfig[key])

  // Look up selected token key in state
  const selectedTokenKey = selectToTokenKeyForBridge(state, bridgeKey) || tokenKeys[0]
  const selectedToken = tokensConfig[selectedTokenKey]

  return {
    to: toFormatted,
    tokens,
    selectedToken,
    bridgeKey,
  }
}

const mapDispatch = {
  onChangeToken: setSelectedToToken,
}

const mergeProps = (
  stateProps: ReturnType<typeof mapState>,
  dispatchProps: typeof mapDispatch,
  ownProps: TokenToOwnProps
) => {
  const { bridgeKey } = stateProps

  return {
    ...stateProps,
    ...ownProps,
    ...dispatchProps,
    onChangeToken: (tokenKey: TokenKey) => dispatchProps.onChangeToken({ bridgeKey, tokenKey }),
  }
}

const connector = connect(mapState, mapDispatch, mergeProps)

export type PropsFromRedux = ConnectedProps<typeof connector>

interface TokenToOwnProps {}

interface TokenToProps extends TokenToOwnProps, PropsFromRedux {}

export namespace TokenToConnector {
  export const Connector = connector
  export type Props = TokenToProps
}
