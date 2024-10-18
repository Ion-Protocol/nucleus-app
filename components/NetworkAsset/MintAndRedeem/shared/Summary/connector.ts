import { RootState } from '@/store'
import {
  selectFormattedPreviewFee,
  selectNetworkAssetConfig,
  selectPreviewFeeLoading,
  selectSourceChainKey,
} from '@/store/slices/networkAssets'
import { ConnectedProps, connect } from 'react-redux'

const mapState = (state: RootState, ownProps: SummaryOwnProps) => {
  let selectedChainKey = selectSourceChainKey(state)
  const networkAssetConfig = selectNetworkAssetConfig(state)
  const receiveOn = networkAssetConfig?.receiveOn
  const isSameChain = selectedChainKey === receiveOn

  return { fees: selectFormattedPreviewFee(state), loading: selectPreviewFeeLoading(state), isSameChain }
}

const mapDispatch = {}

const connector = connect(mapState, mapDispatch)

export type PropsFromRedux = ConnectedProps<typeof connector>

interface SummaryOwnProps {}

interface SummaryProps extends SummaryOwnProps, PropsFromRedux {}

export namespace SummaryConnector {
  export const Connector = connector
  export type Props = SummaryProps
}
