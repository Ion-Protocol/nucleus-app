import { chainsConfig } from '@/config/chains'
import { RootState } from '@/store'
import {
  selectNetworkAssetConfig,
  selectSourceChainKey,
  selectSourceChains,
  setSourceChain,
} from '@/store/slices/networkAssets'
import { ConnectedProps, connect } from 'react-redux'

const mapState = (state: RootState, ownProps: ChainSelectOwnProps) => {
  // ! put this back to original state
  const { role, txType = 'mint', isActive } = ownProps

  let selectedChainKey = selectSourceChainKey(state)

  const networkAssetConfig = selectNetworkAssetConfig(state)
  const selectableChains = selectSourceChains(state)
  const selectedChainName = chainsConfig[selectedChainKey].name
  const chainKeyOfNetworkAsset = networkAssetConfig?.receiveOn

  const textMap = {
    mint: {
      source: `Deposit from ${selectedChainName}`,
      destination: `Receive on ${chainKeyOfNetworkAsset}`,
    },
  }
  const primaryText = role === 'source' ? textMap.mint.source : textMap.mint.destination

  const placeholder = role === 'source' ? 'Source Chain' : 'Destination Chain'

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
export type ChainSelectType = 'mint' | 'redeem'
interface ChainSelectOwnProps {
  txType: ChainSelectType
  role: ChainSelectRole
  isActive: boolean
}

interface ChainSelectProps extends ChainSelectOwnProps, PropsFromRedux {}

export namespace ChainSelectConnector {
  export const Connector = connector
  export type Props = ChainSelectProps
}
