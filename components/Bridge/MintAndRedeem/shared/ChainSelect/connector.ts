import { RootState } from '@/store'
import { selectSourceBridge, selectSourceBridges, setDestinationChain, setSourceChain } from '@/store/slices/bridges'
import { selectBridgeKey } from '@/store/slices/router'
import { ConnectedProps, connect } from 'react-redux'

const mapState = (state: RootState, ownProps: ChainSelectOwnProps) => {
  const { role, isActive } = ownProps

  const bridges = selectSourceBridges(state)
  const selectChain = role === 'source' ? selectSourceBridge : selectBridgeKey
  const selected = selectChain(state) || bridges[0]?.key || null
  const selectedChain = selected && bridges.find((bridge) => bridge.key === selected)

  const placeholder = role === 'source' ? 'Source Chain' : 'Destination Chain'
  const primaryText = role === 'source' ? `Deposit from ${selectedChain?.name}` : `Receive on ${selectedChain?.name}`

  return {
    chains: bridges,
    selected: selectedChain,
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
