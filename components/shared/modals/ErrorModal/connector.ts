import { RootState } from '@/store'
import { clearError, selectError, selectErrorMessage, selectErrorTitle } from '@/store/slices/status'
import { ConnectedProps, connect } from 'react-redux'

const mapState = (state: RootState) => {
  return {
    error: selectError(state),
  }
}

const mapDispatch = {
  clearError,
}

const connector = connect(mapState, mapDispatch)

export type PropsFromRedux = ConnectedProps<typeof connector>

interface ErrorModalProps extends PropsFromRedux {}

export namespace ErrorModalConnector {
  export const Connector = connector
  export type Props = ErrorModalProps
}
