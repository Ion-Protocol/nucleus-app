import { tokensConfig } from '@/config/tokens'
import { RootState } from '@/store'
import { selectBalancesLoading, selectFormattedTokenBalance } from '@/store/slices/balance'
import {
  selectwiAmount,
  selectNetworkAssetConfig,
  selectTokenRateInQuote,
  selectTokenRateInQuoteLoading,
  selectWithdrawAmount,
} from '@/store/slices/networkAssets'
import { selectNetworkAssetFromRoute } from '@/store/slices/router'
import { TokenKey } from '@/types/TokenKey'
import { WAD, bigIntToNumberAsString } from '@/utils/bigint'
import { convertToDecimals } from '@/utils/number'
import { ConnectedProps, connect } from 'react-redux'
import { formatUnits } from 'viem'

interface MapStateProps {
  value: string
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
      value: '',
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
  const rate = selectTokenRateInQuote(state)
  const withdrawAmountAsBigInt = BigInt(convertToDecimals(withdrawAmount, 18))
  const rateAsBigInt = rate ? BigInt(rate) : BigInt(0)
  const destinationAmountAsBigInt =
    rateAsBigInt > 0 ? (withdrawAmountAsBigInt * WAD.bigint) / rateAsBigInt : withdrawAmountAsBigInt
  const numberValue = parseFloat(formatUnits(destinationAmountAsBigInt, 18))
  const destinationAmountFormatted = bigIntToNumberAsString(destinationAmountAsBigInt, {
    minimumFractionDigits: 0,
    maximumFractionDigits: numberValue < 1 ? 18 : 8,
  })

  const tokenRateInQuoteLoading = selectTokenRateInQuoteLoading(state)

  const tokenBalance = selectFormattedTokenBalance(state, networkAssetConfig?.receiveOn, networkAssetFromRoute)

  return {
    value: destinationAmountFormatted,
    loadingTokenRate: tokenRateInQuoteLoading,
    networkAssetKey: networkAssetFromRoute,
    networkAssetName,
    tokenBalance,
    loadingTokenBalance: selectBalancesLoading(state),
  }
}

const mapDispatch = {}

const connector = connect(mapState, mapDispatch)

export type PropsFromRedux = ConnectedProps<typeof connector>

interface TokenFromOwnProps {}

interface TokenFromProps extends TokenFromOwnProps, PropsFromRedux {}

export namespace TokenFromConnector {
  export const Connector = connector
  export type Props = TokenFromProps
}
