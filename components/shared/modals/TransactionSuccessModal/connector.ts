import { RootState } from '@/store'
import {
  clearTransactionSuccess,
  selectTransactionSuccessHash,
  selectTransactionSuccessMessage,
} from '@/store/slices/status'
import { ConnectedProps, connect } from 'react-redux'

const mapState = (state: RootState) => {
  return {
    message: selectTransactionSuccessMessage(state),
    txHash: selectTransactionSuccessHash(state),
  }
}

const mapDispatch = {
  onClose: clearTransactionSuccess,
}

const connector = connect(mapState, mapDispatch)

export type PropsFromRedux = ConnectedProps<typeof connector>

interface SuccessModalProps extends PropsFromRedux {}

export namespace SuccessModalConnector {
  export const Connector = connector
  export type Props = SuccessModalProps
}
