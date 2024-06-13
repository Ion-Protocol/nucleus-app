import { RootState } from '@/store'
import { setDestinationChain, setSourceChain } from '@/store/slices/bridges'
import { ConnectedProps, connect } from 'react-redux'

const mapState = (state: RootState, ownProps: TokenInputOwnProps) => {
  return {
    thing: '',
  }
}

const mapDispatch = {}

const mergeProps = (
  stateProps: ReturnType<typeof mapState>,
  dispatchProps: typeof mapDispatch,
  ownProps: TokenInputOwnProps
) => {
  return {
    ...stateProps,
    ...ownProps,
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
