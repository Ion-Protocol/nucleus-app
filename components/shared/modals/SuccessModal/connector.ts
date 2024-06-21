import { RootState } from '@/store'
import { clearSuccess, selectSuccessMessage } from '@/store/slices/status'
import { ConnectedProps, connect } from 'react-redux'

const mapState = (state: RootState) => {
  return {
    message: selectSuccessMessage(state),
  }
}

const mapDispatch = {
  onClose: clearSuccess,
}

const connector = connect(mapState, mapDispatch)

export type PropsFromRedux = ConnectedProps<typeof connector>

interface SuccessModalProps extends PropsFromRedux {}

export namespace SuccessModalConnector {
  export const Connector = connector
  export type Props = SuccessModalProps
}
