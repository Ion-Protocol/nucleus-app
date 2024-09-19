import { chainsConfig } from '@/config/chains'
import { RootState } from '@/store'
import {
  selectNetworkAssetConfig,
  selectReceiveOnChain,
  selectSourceChainKey,
  selectSourceChains,
  setSourceChain,
} from '@/store/slices/networkAssets'
import { ConnectedProps, connect } from 'react-redux'

const mapState = (state: RootState, ownProps: ChainSelectOwnProps) => {
  const { role, isActive } = ownProps

  let selectedChainKey = selectSourceChainKey(state)

  const networkAssetConfig = selectNetworkAssetConfig(state)
  const selectableChains = selectSourceChains(state)
  const selectedChainName = chainsConfig[selectedChainKey].name
  const chainKeyOfNetworkAsset = networkAssetConfig?.chain
  const chainNameOfNetworkAsset = chainKeyOfNetworkAsset ? chainsConfig[chainKeyOfNetworkAsset].name : ''

  const placeholder = role === 'source' ? 'Source Chain' : 'Destination Chain'
  const primaryText = role === 'source' ? `Deposit from ${selectedChainName}` : `Receive on ${chainNameOfNetworkAsset}`

  if (role === 'destination' && chainKeyOfNetworkAsset) {
    selectedChainKey = chainKeyOfNetworkAsset
  }

  return {
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
