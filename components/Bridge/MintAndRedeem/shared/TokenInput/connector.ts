import { tokensConfig } from '@/config/token'
import { RootState } from '@/store'
import { selectBalancesLoading, selectFormattedTokenBalance } from '@/store/slices/balance'
import {
  selectDepositAmount,
  selectInputError,
  selectShouldIgnoreBalance,
  selectShouldIgnoreErrors,
  selectSourceChainKey,
  selectSourceTokenKey,
  selectSourceTokens,
  setInputValue,
  setSelectedFromToken,
} from '@/store/slices/bridges'
import { setBridgeInputMax } from '@/store/slices/bridges/thunks'
import { selectChainKeyFromRoute } from '@/store/slices/router'
import { TokenKey } from '@/types/TokenKey'
import { ConnectedProps, connect } from 'react-redux'

const mapState = (state: RootState, ownProps: TokenInputOwnProps) => {
  const currentPageChainKey = selectChainKeyFromRoute(state)
  const selectedChainKey = selectSourceChainKey(state)
  const inputValue = selectDepositAmount(state)
  const tokenKeys = selectSourceTokens(state)
  const tokens = tokenKeys.map((key) => tokensConfig[key])
  const selectedTokenKey = selectSourceTokenKey(state) || tokenKeys[0] || null
  const selectedToken = tokensConfig[selectedTokenKey]
  const formattedTokenBalance = selectFormattedTokenBalance(selectedChainKey, selectedTokenKey)(state)
  const shouldIgnoreErrors = selectShouldIgnoreErrors(state)

  return {
    inputValue,
    tokenBalance: formattedTokenBalance,
    loadingTokenBalance: selectBalancesLoading(state),
    error: selectInputError(state),
    tokens,
    selectedToken,
    currentPageChainKey,
    shouldIgnoreErrors,
  }
}

const mapDispatch = {
  onChange: setInputValue,
  onChangeToken: (token: TokenKey) => setSelectedFromToken({ tokenKey: token }),
  onMax: () => setBridgeInputMax(),
}

const connector = connect(mapState, mapDispatch)

export type PropsFromRedux = ConnectedProps<typeof connector>

interface TokenInputOwnProps {}

interface TokenInputProps extends TokenInputOwnProps, PropsFromRedux {}

export namespace TokenInputConnector {
  export const Connector = connector
  export type Props = TokenInputProps
}
