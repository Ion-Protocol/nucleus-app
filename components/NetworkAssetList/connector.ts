import { RootState } from '@/store'
import { selectAllNetworkAssetKeys, selectBridgesState } from '@/store/slices/networkAssets'
import { ConnectedProps, connect } from 'react-redux'

const mapState = (state: RootState) => {
  const networkAssetKeys = selectAllNetworkAssetKeys(state)
  const bridgesState = selectBridgesState(state)
  const tvls = bridgesState.tvl.data
  return { networkAssetKeys, tvls }
}

const mapDispatch = {}

const connector = connect(mapState, mapDispatch)

export type PropsFromRedux = ConnectedProps<typeof connector>

interface NetworkAssetListProps extends PropsFromRedux {}

export namespace NetworkAssetListConnector {
  export const Connector = connector
  export type Props = NetworkAssetListProps
}
