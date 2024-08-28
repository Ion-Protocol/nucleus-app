import { BridgeKey } from '@/types/BridgeKey'
import { tokensConfig } from '@/config/token'
import { RootState } from '@/store'
import { selectBalancesLoading, selectFormattedTokenBalance } from '@/store/slices/balance'
import { selectBridgeConfig, selectBridgeInputValue, selectBridgeRate } from '@/store/slices/bridges'
import { WAD, bigIntToNumber } from '@/utils/bigint'
import { ConnectedProps, connect } from 'react-redux'

const mapState = (state: RootState, ownProps: TokenToOwnProps) => {
  // Calculate "to" value
  const from = selectBridgeInputValue(state)
  const rate = selectBridgeRate(state)
  const fromAsNumber = parseFloat(from)
  const fromAsBigInt = fromAsNumber ? BigInt(fromAsNumber * WAD.number) : BigInt(0)
  const rateAsBigInt = rate ? BigInt(rate) : BigInt(0)
  const toAsBigInt = rateAsBigInt > 0 ? (fromAsBigInt * WAD.bigint) / rateAsBigInt : fromAsBigInt
  const valueFormatted = bigIntToNumber(toAsBigInt, { minimumFractionDigits: 0, maximumFractionDigits: 4 })

  // Look up list of available token keys from the bridges config
  const bridgeConfig = selectBridgeConfig(state)
  const bridgeTokenKey = bridgeConfig?.nativeToken || null
  const bridgeToken = bridgeTokenKey ? tokensConfig[bridgeTokenKey] : null

  const tokenBalance = selectFormattedTokenBalance(BridgeKey.ETHEREUM, bridgeTokenKey)(state)

  return {
    value: valueFormatted,
    bridgeToken,
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
