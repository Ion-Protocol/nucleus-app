import { ChainKey } from '@/config/chains'
import { RootState } from '@/store'
import {
  selectDestinationBridge,
  selectSourceBridge,
  selectDestinationBridges,
  selectSourceBridges,
  setDestinationChain,
  setSourceChain,
} from '@/store/slices/bridges'
import { ConnectedProps, connect } from 'react-redux'

const mapState = (state: RootState, ownProps: ChainSelectOwnProps) => {
  const { role } = ownProps

  const selectBridges = role === 'source' ? selectSourceBridges : selectDestinationBridges
  const bridges = selectBridges(state)
  const selectChain = role === 'source' ? selectSourceBridge : selectDestinationBridge
  const selected = selectChain(state) || bridges[0]?.key || null
  const selectedChain = selected && bridges.find((bridge) => bridge.key === selected)

  const placeholder = role === 'source' ? 'Source Chain' : 'Destination Chain'

  return {
    chains: bridges,
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
