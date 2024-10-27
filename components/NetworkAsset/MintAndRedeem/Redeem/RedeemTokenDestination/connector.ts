import { tokensConfig } from '@/config/tokens'
import { RootState } from '@/store'
import { selectBalancesLoading, selectFormattedTokenBalance } from '@/store/slices/balance'
import {
  selectNetworkAssetConfig,
  selectTokenRateInQuoteLoading,
  selectWithdrawAmount,
  setWithdrawAmount,
} from '@/store/slices/networkAssets'
import { selectNetworkAssetFromRoute } from '@/store/slices/router'
import { TokenKey } from '@/types/TokenKey'
import { ConnectedProps, connect } from 'react-redux'

interface MapStateProps {
  inputValue: string
  loadingTokenRate: boolean
  networkAssetKey: TokenKey | null
  networkAssetName: string
  tokenBalance: string | null
  loadingTokenBalance: boolean
}

const mapState = (state: RootState, ownProps: TokenFromOwnProps): MapStateProps => {
  const networkAssetConfig = selectNetworkAssetConfig(state)
  if (!networkAssetConfig) {
    return {
      inputValue: '',
      loadingTokenRate: false,
      networkAssetKey: null,
      networkAssetName: '',
      tokenBalance: null,
      loadingTokenBalance: false,
    }
  }
  const networkAssetFromRoute = selectNetworkAssetFromRoute(state)
  const networkAssetName = networkAssetFromRoute ? tokensConfig[networkAssetFromRoute].name : ''

  const withdrawAmount = selectWithdrawAmount(state)

  const tokenRateInQuoteLoading = selectTokenRateInQuoteLoading(state)

  const tokenBalance = selectFormattedTokenBalance(state, networkAssetConfig?.receiveOn, networkAssetFromRoute)

  return {
    inputValue: withdrawAmount,
    loadingTokenRate: tokenRateInQuoteLoading,
    networkAssetKey: networkAssetFromRoute,
    networkAssetName,
    tokenBalance,
    loadingTokenBalance: selectBalancesLoading(state),
  }
}

const mapDispatch = {
  onChange: setWithdrawAmount,
}

const connector = connect(mapState, mapDispatch)

export type PropsFromRedux = ConnectedProps<typeof connector>

interface TokenFromOwnProps {}

interface TokenFromProps extends TokenFromOwnProps, PropsFromRedux {}

export namespace TokenFromConnector {
  export const Connector = connector
  export type Props = TokenFromProps
}
