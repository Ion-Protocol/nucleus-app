import { bridgesConfig } from '@/config/bridges'
import { chainsConfig } from '@/config/chains'
import { RootState } from '@/store'
import {
  setSourceChain,
  setDestinationChain,
  selectBridgeSourceChain,
  selectBridgeDestinationChain,
} from '@/store/slices/bridges'
import { ConnectedProps, connect } from 'react-redux'

const mapState = (state: RootState, ownProps: ChainSelectOwnProps) => {
  const { role } = ownProps
  const bridgeKey = state.router.query?.bridge

  if (!bridgeKey) return { chains: [], selected: null }

  const bridge = bridgesConfig[bridgeKey]
  const chainKeys = role === 'source' ? bridge.sourceChains : bridge.destinationChains
  const chains = chainKeys.map((key) => ({ key, ...chainsConfig[key] }))
  const selectChain = role === 'source' ? selectBridgeSourceChain : selectBridgeDestinationChain
  const selected = selectChain(state)
  const selectedChain = selected && chains.find((chain) => chain.key === selected)

  return {
    chains,
    selected: selectedChain,
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
}

interface ChainSelectProps extends ChainSelectOwnProps, PropsFromRedux {}

export namespace ChainSelectConnector {
  export const Connector = connector
  export type Props = ChainSelectProps
}
