import { RootState } from '@/store'
import { selectAllBridgeKeys } from '@/store/slices/bridges'
import { ConnectedProps, connect } from 'react-redux'

const mapState = (state: RootState) => {
  const bridgeKeys = selectAllBridgeKeys(state)
  return { bridgeKeys }
}

const mapDispatch = {}

const connector = connect(mapState, mapDispatch)

export type PropsFromRedux = ConnectedProps<typeof connector>

interface YieldBridgeListProps extends PropsFromRedux {}

export namespace YieldBridgeListConnector {
  export const Connector = connector
  export type Props = YieldBridgeListProps
}
