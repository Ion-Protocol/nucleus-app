import { chainsConfig } from '@/config/chains'
import { RootState } from '@/store'
import { selectSourceChainKey } from '@/store/slices/networkAssets'
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
  const txBaseUrl = chainsConfig[sourceChainKey].explorerBaseUrl

  return {
    message: selectTransactionSuccessMessage(state),
    txHash: {
      raw: selectTransactionSuccessHash(state),
      formatted: selectTruncatedTransactionSuccessHash(state),
    },
    shouldShowLayerZeroLink,
    txBaseUrl,
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
