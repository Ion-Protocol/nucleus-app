import { RootState } from '@/store'
import {
  selectNetworkConfig,
  selectReceiveOnChain,
  selectSourceChainKey,
  selectSourceChains,
  setDestinationChain,
  setSourceChain,
} from '@/store/slices/bridges'
import { selectChainKeyFromRoute } from '@/store/slices/router'
import { ChainKey } from '@/types/ChainKey'
import { ConnectedProps, connect } from 'react-redux'

const mapState = (state: RootState, ownProps: ChainSelectOwnProps) => {
  const { role, isActive } = ownProps

  const selectableChains = selectSourceChains(state)
  const chainConfig = selectNetworkConfig(state)
  const allChains = chainConfig?.chains
  const selectChain = role === 'source' ? selectSourceChainKey : selectChainKeyFromRoute
  const selectedChainKey = selectChain(state) || selectableChains[0]?.key || null
  const selectedChain = allChains?.[selectedChainKey]
  const receiveOnChain = selectReceiveOnChain(state)

  const selectedChainName = selectedChainKey === ChainKey.ETHEREUM ? 'Ethereum' : selectedChain?.name || ''

  const placeholder = role === 'source' ? 'Source Chain' : 'Destination Chain'
  const primaryText = role === 'source' ? `Deposit from ${selectedChainName}` : `Receive on ${receiveOnChain}`

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
  setSourceChain,
  setDestinationChain,
}

const mergeProps = (
  stateProps: ReturnType<typeof mapState>,
  dispatchProps: typeof mapDispatch,
  ownProps: ChainSelectOwnProps
) => {
  const { role } = ownProps
  const onChange = role === 'source' ? dispatchProps.setSourceChain : dispatchProps.setDestinationChain

  return {
    ...stateProps,
    ...ownProps,
    onChange,
  }
}

const connector = connect(mapState, mapDispatch, mergeProps)

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
