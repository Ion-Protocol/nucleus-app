import { RootState } from '@/store'
import { selectAllBridges } from '@/store/slices/bridges'
import { selectLoading } from '@/store/slices/status'
import { ConnectedProps, connect } from 'react-redux'

const mapState = (state: RootState) => {
  return {
    bridges: selectAllBridges(state),
    loading: selectLoading(state),
  }
}

const mapDispatch = {}

const connector = connect(mapState, mapDispatch)

export type PropsFromRedux = ConnectedProps<typeof connector>

interface YieldBridgeListProps extends PropsFromRedux {}

export namespace YieldBridgeListConnector {
  export const Connector = connector
  export type Props = YieldBridgeListProps
}
