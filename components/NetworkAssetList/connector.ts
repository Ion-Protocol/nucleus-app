import { RootState } from '@/store'
import { selectAllNetworkAssetKeys } from '@/store/slices/networkAssets'
import { ConnectedProps, connect } from 'react-redux'

const mapState = (state: RootState) => {
  const networkAssetKeys = selectAllNetworkAssetKeys(state)
  return { networkAssetKeys }
}

const mapDispatch = {}

const connector = connect(mapState, mapDispatch)

export type PropsFromRedux = ConnectedProps<typeof connector>

interface NetworkAssetListProps extends PropsFromRedux {}

export namespace NetworkAssetListConnector {
  export const Connector = connector
  export type Props = NetworkAssetListProps
}
