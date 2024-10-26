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

const mapState = (state: RootState, ownProps: RedeemOwnProps) => {
  const selectedChainKey = selectSourceChainKey(state)
  const networkAssetFromRoute = selectNetworkAssetFromRoute(state)
  const networkAssetName = networkAssetFromRoute ? tokensConfig[networkAssetFromRoute].name : ''
  console.log('selectedChainKey', selectedChainKey)
  console.log('networkAssetFromRoute', networkAssetFromRoute)
  // const formattedTokenBalance = selectFormattedTokenBalance(state, selectedChainKey, networkAssetFromRoute)
  // console.log('formattedTokenBalance', formattedTokenBalance)
  const inputValue = selectWithdrawAmount(state)

  const currentPageChainKey = selectNetworkAssetFromRoute(state)
  const tokenKeys = selectSourceTokens(state)
  const tokens = tokenKeys.map((key) => tokensConfig[key])
  const selectedTokenKey = selectSourceTokenKey(state) || tokenKeys[0] || null
  const shouldIgnoreBalance = selectShouldIgnoreBalance(state)

  return {
    networkAssetKey: networkAssetFromRoute,
    networkAssetName,
    inputValue,
    tokenBalance: 10,
    loadingTokenBalance: selectBalancesLoading(state),
    error: selectInputError(state),
  }
}

const mapDispatch = {
  onChange: setWithdrawAmount,
  onMax: () => setDepositAmountMax(),
}

const connector = connect(mapState, mapDispatch)

export type PropsFromRedux = ConnectedProps<typeof connector>

interface RedeemOwnProps {}

interface RedeemProps extends RedeemOwnProps, PropsFromRedux {}

export namespace RedeemConnector {
  export const Connector = connector
  export type Props = RedeemProps
}
