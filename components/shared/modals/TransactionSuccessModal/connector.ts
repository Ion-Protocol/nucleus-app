import { RootState } from '@/store'
import {
  clearTransactionSuccess,
  selectTransactionSuccessHash,
  selectTransactionSuccessMessage,
  selectTruncatedTransactionSuccessHash,
} from '@/store/slices/status'
import { ConnectedProps, connect } from 'react-redux'

const mapState = (state: RootState) => {
  return {
    message: selectTransactionSuccessMessage(state),
    txHash: {
      raw: selectTransactionSuccessHash(state),
      formatted: selectTruncatedTransactionSuccessHash(state),
    },
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
