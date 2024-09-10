import { ChainKey } from '@/types/ChainKey'
import { tokensConfig } from '@/config/token'
import { RootState } from '@/store'
import { selectBalancesLoading, selectFormattedTokenBalance } from '@/store/slices/balance'
import { selectChainConfig, selectDepositAmount, selectBridgeRate } from '@/store/slices/bridges'
import { WAD, bigIntToNumber } from '@/utils/bigint'
import { ConnectedProps, connect } from 'react-redux'

const mapState = (state: RootState, ownProps: TokenToOwnProps) => {
  // Calculate destination value
  const from = selectDepositAmount(state)
  const rate = selectBridgeRate(state)
  const depositAmountAsNUmber = parseFloat(from)
  const depositAmountAsBigInt = depositAmountAsNUmber ? BigInt(depositAmountAsNUmber * WAD.number) : BigInt(0)
  const rateAsBigInt = rate ? BigInt(rate) : BigInt(0)
  const destinationAmountAsBigInt =
    rateAsBigInt > 0 ? (depositAmountAsBigInt * WAD.bigint) / rateAsBigInt : depositAmountAsBigInt
  const destinationAmountFormatted = bigIntToNumber(destinationAmountAsBigInt, {
    minimumFractionDigits: 0,
    maximumFractionDigits: 4,
  })

  // Look up list of available token keys from the chain config
  const chainConfig = selectChainConfig(state)
  const chainTokenKey = chainConfig?.yieldAsset || null
  const chainToken = chainTokenKey ? tokensConfig[chainTokenKey] : null

  const tokenBalance = selectFormattedTokenBalance(ChainKey.ETHEREUM, chainTokenKey)(state)

  return {
    value: destinationAmountFormatted,
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
