import { RootState } from '@/store'
import { selectFormattedPreviewFee, selectPreviewFeeLoading } from '@/store/slices/networkAssets'
import { ConnectedProps, connect } from 'react-redux'

const mapState = (state: RootState, ownProps: SummaryOwnProps) => {
  return { fees: selectFormattedPreviewFee(state), loading: selectPreviewFeeLoading(state) }
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
