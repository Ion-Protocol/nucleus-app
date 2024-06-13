import { BridgeKey } from '@/config/bridges'
import { RootState } from '@/store'
import { selectBridgeFrom, selectBridgeTo } from '@/store/slices/bridges'
import { setBridgeFrom, setBridgeTo } from '@/store/slices/bridges/thunks'
import { ConnectedProps, connect } from 'react-redux'

const mapState = (state: RootState, ownProps: TokenInputOwnProps) => {
  const { role } = ownProps
  const bridgeKey = state.router.query?.bridge as BridgeKey

  const selectInputValue = role === 'from' ? selectBridgeFrom : selectBridgeTo
  const inputValue = selectInputValue(state, bridgeKey)

  return {
    inputValue,
  }
}

const mapDispatch = {
  setBridgeFrom,
  setBridgeTo,
}

const mergeProps = (
  stateProps: ReturnType<typeof mapState>,
  dispatchProps: typeof mapDispatch,
  ownProps: TokenInputOwnProps
) => {
  const { role } = ownProps
  const onChange = role === 'from' ? dispatchProps.setBridgeFrom : dispatchProps.setBridgeTo

  return {
    ...stateProps,
    ...ownProps,
    onChange,
  }
}

const connector = connect(mapState, mapDispatch, mergeProps)

export type PropsFromRedux = ConnectedProps<typeof connector>

export type TokenInputRole = 'from' | 'to'
interface TokenInputOwnProps {
  role: TokenInputRole
}

interface TokenInputProps extends TokenInputOwnProps, PropsFromRedux {}

export namespace TokenInputConnector {
  export const Connector = connector
  export type Props = TokenInputProps
}
