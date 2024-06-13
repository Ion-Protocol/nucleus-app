import { BridgeKey } from '@/config/bridges'
import { RootState } from '@/store'
import { selectBridgeFrom } from '@/store/slices/bridges'
import { setBridgeFrom } from '@/store/slices/bridges/thunks'
import { ConnectedProps, connect } from 'react-redux'

const mapState = (state: RootState, ownProps: TokenInputOwnProps) => {
  const bridgeKey = state.router.query?.bridge as BridgeKey

  const from = selectBridgeFrom(state, bridgeKey)

  const inputValue = selectBridgeFrom(state, bridgeKey)

  return {
    inputValue,
  }
}

const mapDispatch = {
  onChange: setBridgeFrom,
}

const connector = connect(mapState, mapDispatch)

export type PropsFromRedux = ConnectedProps<typeof connector>

interface TokenInputOwnProps {}

interface TokenInputProps extends TokenInputOwnProps, PropsFromRedux {}

export namespace TokenInputConnector {
  export const Connector = connector
  export type Props = TokenInputProps
}
