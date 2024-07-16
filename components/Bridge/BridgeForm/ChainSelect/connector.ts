import { ChainKey } from '@/config/bridges'
import { RootState } from '@/store'
import {
  selectBridgeDestinationChain,
  selectBridgeSourceChain,
  selectChainsNamesAndKeys,
  setDestinationChain,
  setSourceChain,
} from '@/store/slices/bridges'
import { ConnectedProps, connect } from 'react-redux'

const mapState = (state: RootState, ownProps: ChainSelectOwnProps) => {
  const { role } = ownProps

  const chains = selectChainsNamesAndKeys(state)
  const selectChain = role === 'source' ? selectBridgeSourceChain : selectBridgeDestinationChain
  const selected = selectChain(state) || ChainKey.MAINNET
  const selectedChain = selected && chains.find((chain) => chain.key === selected)

  const placeholder = role === 'source' ? 'Source Chain' : 'Destination Chain'

  return {
    chains,
    selected: selectedChain,
    placeholder,
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
