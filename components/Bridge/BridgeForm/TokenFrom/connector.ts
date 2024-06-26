import { BridgeKey } from '@/config/bridges'
import { TokenKey } from '@/config/token'
import { RootState } from '@/store'
import { selectFormattedTokenBalance } from '@/store/slices/balance'
import { selectBridgeFrom, selectBridgeTokenKey, selectInputError } from '@/store/slices/bridges'
import { setBridgeFrom, setBridgeFromMax } from '@/store/slices/bridges/thunks'
import { ConnectedProps, connect } from 'react-redux'

const mapState = (state: RootState, ownProps: TokenFromOwnProps) => {
  const bridgeKey = state.router.query?.bridge as BridgeKey

  const inputValue = selectBridgeFrom(state, bridgeKey)
  const selectedTokenKey = selectBridgeTokenKey(state, bridgeKey) || TokenKey.ETH
  const formattedTokenBalance = selectFormattedTokenBalance(selectedTokenKey)(state)

  return {
    inputValue,
    tokenBalance: formattedTokenBalance,
    error: selectInputError(state),
  }
}

const mapDispatch = {
  onChange: setBridgeFrom,
  onMax: setBridgeFromMax,
}

const connector = connect(mapState, mapDispatch)

export type PropsFromRedux = ConnectedProps<typeof connector>

interface TokenFromOwnProps {}

interface TokenFromProps extends TokenFromOwnProps, PropsFromRedux {}

export namespace TokenFromConnector {
  export const Connector = connector
  export type Props = TokenFromProps
}
