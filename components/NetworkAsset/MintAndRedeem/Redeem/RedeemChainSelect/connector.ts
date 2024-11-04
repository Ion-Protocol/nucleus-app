import { chainsConfig } from '@/config/chains'
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

  const selectableChains = selectRedemptionChains(state)
  const defaultRedemptionChain = selectableChains[0]?.key
  const selectedChainName = chainsConfig[defaultRedemptionChain]?.name

  const primaryText = role === 'source' ? `Deposit from ${selectedChainName}` : `Redeem on ${defaultRedemptionChain}`

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
