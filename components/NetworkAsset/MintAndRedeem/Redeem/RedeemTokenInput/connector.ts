import { tokensConfig } from '@/config/tokens'
import { RootState } from '@/store'
import { selectBalancesLoading, selectFormattedTokenBalance } from '@/store/slices/balance'
import {
  selectDepositAmount,
  selectInputError,
  selectShouldIgnoreBalance,
  selectSourceChainKey,
  selectSourceTokenKey,
  selectSourceTokens,
  selectWithdrawAmount,
  setDepositAmount,
  setSelectedSourceToken,
  setWithdrawAmount,
} from '@/store/slices/networkAssets'
import { setDepositAmountMax } from '@/store/slices/networkAssets/thunks'
import { selectNetworkAssetFromRoute } from '@/store/slices/router'
import { TokenKey } from '@/types/TokenKey'
import { ConnectedProps, connect } from 'react-redux'

const mapState = (state: RootState, ownProps: RedeemTokenInputOwnProps) => {
  const currentPageChainKey = selectNetworkAssetFromRoute(state)
  const selectedChainKey = selectSourceChainKey(state)
  const inputValue = selectWithdrawAmount(state)
  const tokenKeys = selectSourceTokens(state)
  const tokens = tokenKeys.map((key) => tokensConfig[key])
  const selectedTokenKey = selectSourceTokenKey(state) || tokenKeys[0] || null
  const selectedToken = tokensConfig[selectedTokenKey]
  const formattedTokenBalance = selectFormattedTokenBalance(state, selectedChainKey, selectedTokenKey)

  return {
    inputValue,
    tokenBalance: formattedTokenBalance,
    loadingTokenBalance: selectBalancesLoading(state),
    error: selectInputError(state),
    tokens,
    selectedToken,
    currentPageChainKey,
    shouldIgnoreBalance: false,
  }
}

const mapDispatch = {
  onChange: setWithdrawAmount,
  onChangeToken: (token: TokenKey) => setSelectedSourceToken({ tokenKey: token }),
  onMax: () => setDepositAmountMax(),
}

const connector = connect(mapState, mapDispatch)

export type PropsFromRedux = ConnectedProps<typeof connector>

interface RedeemTokenInputOwnProps {}

interface RedeemTokenInputProps extends RedeemTokenInputOwnProps, PropsFromRedux {}

export namespace RedeemTokenInputConnector {
  export const Connector = connector
  export type Props = RedeemTokenInputProps
}
