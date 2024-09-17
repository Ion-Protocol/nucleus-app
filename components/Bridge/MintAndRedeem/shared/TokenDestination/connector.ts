import { tokensConfig } from '@/config/token'
import { RootState } from '@/store'
import { selectBalancesLoading, selectFormattedTokenBalance } from '@/store/slices/balance'
import {
  selectChainConfig,
  selectDepositAmount,
  selectTokenRateInQuote,
  selectTokenRateInQuoteLoading,
} from '@/store/slices/bridges'
import { selectChainKeyFromRoute } from '@/store/slices/router'
import { WAD, bigIntToNumberAsString } from '@/utils/bigint'
import { convertToDecimals } from '@/utils/number'
import { ConnectedProps, connect } from 'react-redux'
import { formatUnits } from 'viem'

const mapState = (state: RootState, ownProps: TokenToOwnProps) => {
  // Calculate destination value
  const from = selectDepositAmount(state)
  const rate = selectTokenRateInQuote(state)
  const depositAmountAsBigInt = BigInt(convertToDecimals(from, 18))
  const rateAsBigInt = rate ? BigInt(rate) : BigInt(0)
  const destinationAmountAsBigInt =
    rateAsBigInt > 0 ? (depositAmountAsBigInt * WAD.bigint) / rateAsBigInt : depositAmountAsBigInt
  const numberValue = parseFloat(formatUnits(destinationAmountAsBigInt, 18))
  const destinationAmountFormatted = bigIntToNumberAsString(destinationAmountAsBigInt, {
    minimumFractionDigits: 0,
    maximumFractionDigits: numberValue < 1 ? 18 : 8,
  })

  const tokenRateInQuoteLoading = selectTokenRateInQuoteLoading(state)

  // Look up list of available token keys from the chain config
  const chainConfig = selectChainConfig(state)
  const chainTokenKey = chainConfig?.yieldAsset || null
  const chainToken = chainTokenKey ? tokensConfig[chainTokenKey] : null

  const chainFromRoute = selectChainKeyFromRoute(state)
  const tokenBalance = selectFormattedTokenBalance(chainFromRoute, chainTokenKey)(state)

  return {
    value: destinationAmountFormatted,
    loadingTokenRate: tokenRateInQuoteLoading,
    chainToken,
    tokenBalance,
    loadingTokenBalance: selectBalancesLoading(state),
  }
}

const mapDispatch = {}

const connector = connect(mapState, mapDispatch)

export type PropsFromRedux = ConnectedProps<typeof connector>

interface TokenToOwnProps {}

interface TokenToProps extends TokenToOwnProps, PropsFromRedux {}

export namespace TokenToConnector {
  export const Connector = connector
  export type Props = TokenToProps
}
