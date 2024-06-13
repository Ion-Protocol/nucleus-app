import { BridgeKey } from '@/config/bridges'
import { RootState } from '@/store'
import { selectBridgeFrom, selectBridgeRate } from '@/store/slices/bridges'
import { setBridgeFrom } from '@/store/slices/bridges/thunks'
import { WAD, bigIntToNumber } from '@/utils/bigint'
import { ConnectedProps, connect } from 'react-redux'

const mapState = (state: RootState, ownProps: TokenToOwnProps) => {
  const bridgeKey = state.router.query?.bridge as BridgeKey

  const from = selectBridgeFrom(state, bridgeKey)
  const rate = selectBridgeRate(state, bridgeKey)
  const fromAsNumber = parseFloat(from)
  const fromAsBigInt = fromAsNumber ? BigInt(fromAsNumber * WAD.number) : BigInt(0)
  const rateAsBigInt = rate ? BigInt(rate) : BigInt(0)
  const toAsBigInt = rateAsBigInt > 0 ? (fromAsBigInt * WAD.bigint) / rateAsBigInt : fromAsBigInt
  const toFormatted = bigIntToNumber(toAsBigInt, { minimumFractionDigits: 0, maximumFractionDigits: 4 })

  return {
    to: toFormatted,
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
