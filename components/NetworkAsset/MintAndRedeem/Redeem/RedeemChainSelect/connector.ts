import { RootState } from '@/store'
import {
  selectNetworkAssetConfig,
  selectRedemptionSourceChainKey,
  selectRedemptionChains,
  setRedemptionChain,
} from '@/store/slices/networkAssets'
import { ConnectedProps, connect } from 'react-redux'

const mapState = (state: RootState, ownProps: ChainSelectOwnProps) => {
  const { role, isActive } = ownProps

  const selectedChainKey = selectRedemptionSourceChainKey(state)
  const selectableChains = selectRedemptionChains(state)
  let defaultRedemptionChain = selectableChains[0].key

  const textMap = {
    redeem: {
      source: `Redeem from ${selectedChainKey}`,
      destination: `Receive on ${defaultRedemptionChain}`,
    },
  }

  if (role === 'source' && selectedChainKey) {
    defaultRedemptionChain = selectedChainKey
  }

  const primaryText = role === 'source' ? textMap.redeem.source : textMap.redeem.destination

  const placeholder = role === 'source' ? 'Source Chain' : 'Destination Chain'

  return {
    chains: selectableChains,
    selectedChainKey: defaultRedemptionChain,
    placeholder,
    primaryText,
    isActive,
    role,
  }
}

const mapDispatch = {
  onChange: setRedemptionChain,
}

const connector = connect(mapState, mapDispatch)

export type PropsFromRedux = ConnectedProps<typeof connector>

export type ChainSelectRole = 'source' | 'destination'

interface ChainSelectOwnProps {
  role: ChainSelectRole
  isActive: boolean
}

interface RedeemChainSelectProps extends ChainSelectOwnProps, PropsFromRedux {}

export namespace RedeemChainSelectConnector {
  export const Connector = connector
  export type Props = RedeemChainSelectProps
}
