import { tokensConfig } from '@/config/token'
import { RootState } from '@/store'
import { selectBalancesLoading, selectFormattedTokenBalance } from '@/store/slices/balance'
import {
  selectBridgeInputValue,
  selectFromTokenKey,
  selectInputError,
  selectSourceBridge,
  selectSourceTokens,
  setInputValue,
  setSelectedFromToken,
} from '@/store/slices/bridges'
import { setBridgeFromMax } from '@/store/slices/bridges/thunks'
import { selectBridgeKeyFromRoute } from '@/store/slices/router'
import { TokenKey } from '@/types/TokenKey'
import { ConnectedProps, connect } from 'react-redux'

const mapState = (state: RootState, ownProps: TokenInputOwnProps) => {
  const currentPageBridgeKey = selectBridgeKeyFromRoute(state)
  const selectedBridgeKey = selectSourceBridge(state)
  const inputValue = selectBridgeInputValue(state)
  const tokenKeys = selectSourceTokens(state)
  const tokens = tokenKeys.map((key) => tokensConfig[key])
  const selectedTokenKey = selectFromTokenKey(state) || tokenKeys[0] || null
  const selectedToken = tokensConfig[selectedTokenKey]
  const formattedTokenBalance = selectFormattedTokenBalance(selectedBridgeKey, selectedTokenKey)(state)
  const fromChain = selectSourceBridge(state)
  const shouldIgnoreBalance = fromChain === currentPageBridgeKey

  return {
    inputValue,
    tokenBalance: formattedTokenBalance,
    loadingTokenBalance: selectBalancesLoading(state),
    error: selectInputError(state),
    tokens,
    selectedToken,
    bridgeKey: currentPageBridgeKey,
    shouldIgnoreBalance,
  }
}

const mapDispatch = {
  onChange: setInputValue,
  onChangeToken: (token: TokenKey) => setSelectedFromToken({ tokenKey: token }),
  onMax: () => setBridgeFromMax(),
}

const connector = connect(mapState, mapDispatch)

export type PropsFromRedux = ConnectedProps<typeof connector>

interface TokenInputOwnProps {}

interface TokenInputProps extends TokenInputOwnProps, PropsFromRedux {}

export namespace TokenInputConnector {
  export const Connector = connector
  export type Props = TokenInputProps
}
