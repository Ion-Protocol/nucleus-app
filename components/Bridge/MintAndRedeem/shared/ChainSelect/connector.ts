import { RootState } from '@/store'
import {
  selectChainNameByChainKey,
  selectReceiveOnChain,
  selectSourceChainKey,
  selectSourceChains,
  setDestinationChain,
  setSourceChain,
} from '@/store/slices/bridges'
import { ConnectedProps, connect } from 'react-redux'

const mapState = (state: RootState, ownProps: ChainSelectOwnProps) => {
  const { role, isActive } = ownProps

  const selectableChains = selectSourceChains(state)
  const selectChain = role === 'source' ? selectSourceChainKey : selectReceiveOnChain
  const selectedChainKey = selectChain(state) || selectableChains[0]?.key || null
  const selectedChainName = selectChainNameByChainKey(selectedChainKey)(state)

  const placeholder = role === 'source' ? 'Source Chain' : 'Destination Chain'
  const primaryText = role === 'source' ? `Deposit from ${selectedChainName}` : `Receive on ${selectedChainName}`

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
