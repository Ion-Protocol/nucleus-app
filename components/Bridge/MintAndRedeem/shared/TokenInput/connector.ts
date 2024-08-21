import { tokensConfig } from '@/config/token'
import { RootState } from '@/store'
import { selectBalancesLoading, selectFormattedTokenBalance } from '@/store/slices/balance'
import {
  selectAvailableTokens,
  selectBridgeFrom,
  selectFromTokenKeyForBridge,
  selectInputError,
  selectSourceBridge,
  setSelectedFromToken,
} from '@/store/slices/bridges'
import { setBridgeFrom, setBridgeFromMax } from '@/store/slices/bridges/thunks'
import { selectBridgeKey } from '@/store/slices/router'
import { TokenKey } from '@/types/TokenKey'
import { ConnectedProps, connect } from 'react-redux'

const mapState = (state: RootState, ownProps: TokenInputOwnProps) => {
  const currentPageBridgeKey = selectBridgeKey(state)
  const selectedBridgeKey = selectSourceBridge(state)
  const inputValue = selectBridgeFrom(state)
  const tokenKeys = selectAvailableTokens(state)
  const tokens = tokenKeys.map((key) => tokensConfig[key])
  const selectedTokenKey = selectFromTokenKeyForBridge(state) || tokenKeys[0] || null
  const selectedToken = tokensConfig[selectedTokenKey]
  const formattedTokenBalance = selectFormattedTokenBalance(selectedBridgeKey, selectedTokenKey)(state)

  return {
    inputValue,
    tokenBalance: formattedTokenBalance,
    // loadingTokenBalance: selectBalancesLoading(state),
    loadingTokenBalance: true,
    error: selectInputError(state),
    tokens,
    selectedToken,
    bridgeKey: currentPageBridgeKey,
  }
}

const mergeProps = (
  stateProps: ReturnType<typeof mapState>,
  dispatchProps: typeof mapDispatch,
  ownProps: TokenInputOwnProps
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

interface TokenInputOwnProps {}

interface TokenInputProps extends TokenInputOwnProps, PropsFromRedux {}

export namespace TokenInputConnector {
  export const Connector = connector
  export type Props = TokenInputProps
}
