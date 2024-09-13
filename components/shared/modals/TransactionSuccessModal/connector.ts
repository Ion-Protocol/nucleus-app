import { RootState } from '@/store'
import { selectSourceChainKey } from '@/store/slices/bridges'
import {
  clearTransactionSuccess,
  selectTransactionSuccessHash,
  selectTransactionSuccessMessage,
  selectTruncatedTransactionSuccessHash,
} from '@/store/slices/status'
import { ChainKey } from '@/types/ChainKey'
import { ConnectedProps, connect } from 'react-redux'

const mapState = (state: RootState) => {
  const sourceChainKey = selectSourceChainKey(state)
  const shouldShowLayerZeroLink = sourceChainKey === ChainKey.ETHEREUM

  return {
    message: selectTransactionSuccessMessage(state),
    txHash: {
      raw: selectTransactionSuccessHash(state),
      formatted: selectTruncatedTransactionSuccessHash(state),
    },
    shouldShowLayerZeroLink,
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
