import { RootState } from '@/store'
import { ConnectedProps, connect } from 'react-redux'

const mapState = (state: RootState, ownProps: TokenSelectOwnProps) => {
  return {
    thing: '',
  }
}

const mapDispatch = {}

const mergeProps = (
  stateProps: ReturnType<typeof mapState>,
  dispatchProps: typeof mapDispatch,
  ownProps: TokenSelectOwnProps
) => {
  return {
    ...stateProps,
    ...ownProps,
  }
}

const connector = connect(mapState, mapDispatch, mergeProps)

export type PropsFromRedux = ConnectedProps<typeof connector>

export type TokenSelectRole = 'from' | 'to'
interface TokenSelectOwnProps {
  role: TokenSelectRole
}

interface TokenSelectProps extends TokenSelectOwnProps, PropsFromRedux {}

export namespace TokenSelectConnector {
  export const Connector = connector
  export type Props = TokenSelectProps
}
