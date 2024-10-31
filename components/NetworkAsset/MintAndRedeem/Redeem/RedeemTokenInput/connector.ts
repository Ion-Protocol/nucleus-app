import { tokensConfig } from '@/config/tokens'
import { RootState } from '@/store'
import { selectBalancesLoading, selectFormattedTokenBalance } from '@/store/slices/balance'
import {
  selectNetworkAssetConfig,
  selectTokenRateInQuoteLoading,
  selectRedeemAmount,
  setRedeemAmount,
} from '@/store/slices/networkAssets'
import { setWithdrawalAmountMax } from '@/store/slices/networkAssets/thunks'
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

const mapState = (state: RootState, ownProps: RedeemTokenInputOwnProps): MapStateProps => {
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

  const redeemAmount = selectRedeemAmount(state)

  const tokenRateInQuoteLoading = selectTokenRateInQuoteLoading(state)

  const tokenBalance = selectFormattedTokenBalance(state, networkAssetConfig?.receiveOn, networkAssetFromRoute)

  return {
    inputValue: redeemAmount,
    loadingTokenRate: tokenRateInQuoteLoading,
    networkAssetKey: networkAssetFromRoute,
    networkAssetName,
    tokenBalance,
    loadingTokenBalance: selectBalancesLoading(state),
  }
}

const mapDispatch = {
  onChange: setRedeemAmount,
  onMax: () => setWithdrawalAmountMax(),
}

const connector = connect(mapState, mapDispatch)

export type PropsFromRedux = ConnectedProps<typeof connector>

interface RedeemTokenInputOwnProps {}

interface RedeemTokenInputProps extends RedeemTokenInputOwnProps, PropsFromRedux {}

export namespace RedeemTokenInputConnector {
  export const Connector = connector
  export type Props = RedeemTokenInputProps
}
