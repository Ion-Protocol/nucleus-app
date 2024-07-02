import { BridgeKey } from '@/config/bridges'
import { RootState } from '@/store'
import { selectBridgeByKey, selectBridgeLoadingByKey } from '@/store/slices/bridges'
import { ConnectedProps, connect } from 'react-redux'

const mapState = (state: RootState, ownProps: YieldBridgeItemOwnProps) => {
  const { bridgeKey } = ownProps
  const bridge = selectBridgeByKey(bridgeKey)(state)
  const disabled = bridge.comingSoon
  const loading = selectBridgeLoadingByKey(bridgeKey)(state)
  return {
    bridge,
    disabled,
    loading,
  }
}

const mapDispatch = {}

const connector = connect(mapState, mapDispatch)

export type PropsFromRedux = ConnectedProps<typeof connector>

interface YieldBridgeItemOwnProps {
  bridgeKey: BridgeKey
}

interface YieldBridgeItemProps extends PropsFromRedux, YieldBridgeItemOwnProps {}

export namespace YieldBridgeItemConnector {
  export const Connector = connector
  export type Props = YieldBridgeItemProps
}
