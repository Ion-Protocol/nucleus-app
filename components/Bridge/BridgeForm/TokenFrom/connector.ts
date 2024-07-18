import { BridgeKey } from '@/config/chains'
import { TokenKey, tokensConfig } from '@/config/token'
import { RootState } from '@/store'
import { selectFormattedTokenBalance } from '@/store/slices/balance'
import {
  selectBridgeConfig,
  selectBridgeFrom,
  selectFromTokenKeyForBridge,
  selectInputError,
  setSelectedFromToken,
} from '@/store/slices/bridges'
import { setBridgeFrom, setBridgeFromMax } from '@/store/slices/bridges/thunks'
import { selectBridgeKey } from '@/store/slices/router'
import { ConnectedProps, connect } from 'react-redux'

const mapState = (state: RootState, ownProps: TokenFromOwnProps) => {
  const bridgeKey = selectBridgeKey(state)
  const inputValue = selectBridgeFrom(state)
  const bridgeConfig = selectBridgeConfig(state)
  const tokenKeys = bridgeConfig?.sourceTokens || []
  const tokens = tokenKeys.map((key) => tokensConfig[key])
  const selectedTokenKey = selectFromTokenKeyForBridge(state) || tokenKeys[0] || null
  const selectedToken = tokensConfig[selectedTokenKey]
  const formattedTokenBalance = selectFormattedTokenBalance(selectedTokenKey)(state)

  return {
    inputValue,
    tokenBalance: formattedTokenBalance,
    error: selectInputError(state),
    tokens,
    selectedToken,
    bridgeKey,
  }
}

const mergeProps = (
  stateProps: ReturnType<typeof mapState>,
  dispatchProps: typeof mapDispatch,
  ownProps: TokenFromOwnProps
) => {
  const { bridgeKey } = stateProps

  return {
    ...stateProps,
    ...ownProps,
    ...dispatchProps,
    onChangeToken: (tokenKey: TokenKey) => dispatchProps.onChangeToken({ bridgeKey, tokenKey }),
  }
}

const mapDispatch = {
  onChange: setBridgeFrom,
  onChangeToken: setSelectedFromToken,
  onMax: setBridgeFromMax,
}

const connector = connect(mapState, mapDispatch, mergeProps)

export type PropsFromRedux = ConnectedProps<typeof connector>

interface TokenFromOwnProps {}

interface TokenFromProps extends TokenFromOwnProps, PropsFromRedux {}

export namespace TokenFromConnector {
  export const Connector = connector
  export type Props = TokenFromProps
}
