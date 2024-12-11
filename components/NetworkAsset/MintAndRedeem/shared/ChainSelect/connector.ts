import { chainsConfig } from '@/config/chains'
import { RootState } from '@/store'
import {
  selectNetworkAssetConfig,
  selectSourceChainKey,
  selectSourceChains,
  setSourceChain,
} from '@/store/slices/networkAssets'
import { selectNetworkAssetFromRoute } from '@/store/slices/router'
import { ConnectedProps, connect } from 'react-redux'

const mapState = (state: RootState, ownProps: ChainSelectOwnProps) => {
  const { role, isActive } = ownProps

  let selectedChainKey = selectSourceChainKey(state)

  const networkAssetFromRoute = selectNetworkAssetFromRoute(state)
  const networkAssetConfig = selectNetworkAssetConfig(state)
  const selectableChains = selectSourceChains(state)
  const selectedChainName = selectedChainKey ? chainsConfig[selectedChainKey].name : ''
  const chainKeyOfNetworkAsset = networkAssetConfig?.receiveOn
  const chainNameOfNetworkAsset = chainKeyOfNetworkAsset ? chainsConfig[chainKeyOfNetworkAsset].name : ''

  const primaryText = role === 'source' ? `Deposit from ${selectedChainName}` : `Receive on ${chainNameOfNetworkAsset}`

  const placeholder = role === 'source' ? 'Source Chain' : 'Destination Chain'

  if (role === 'destination' && chainKeyOfNetworkAsset) {
    selectedChainKey = chainKeyOfNetworkAsset
  }

  return {
    networkAssetFromRoute,
    chains: selectableChains,
    selectedChainKey,
    placeholder,
    primaryText,
    isActive,
    role,
  }
}

const mapDispatch = {
  onChange: setSourceChain,
}

const connector = connect(mapState, mapDispatch)

export type PropsFromRedux = ConnectedProps<typeof connector>

export type ChainSelectRole = 'source' | 'destination'
interface ChainSelectOwnProps {
  role: ChainSelectRole
  isActive: boolean
}

interface ChainSelectProps extends ChainSelectOwnProps, PropsFromRedux {}

export namespace ChainSelectConnector {
  export const Connector = connector
  export type Props = ChainSelectProps
}
