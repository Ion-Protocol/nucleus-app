import { RootState } from '@/store'
import {
  selectChainConfig,
  selectSourceBridge,
  selectSourceBridges,
  setDestinationChain,
  setSourceChain,
} from '@/store/slices/bridges'
import { selectBridgeKeyFromRoute } from '@/store/slices/router'
import { BridgeKey } from '@/types/BridgeKey'
import { ConnectedProps, connect } from 'react-redux'

const mapState = (state: RootState, ownProps: ChainSelectOwnProps) => {
  const { role, isActive } = ownProps

  const selectableBridges = selectSourceBridges(state)
  const chainConfig = selectChainConfig(state)
  const allBridges = chainConfig?.bridges
  const selectChain = role === 'source' ? selectSourceBridge : selectBridgeKeyFromRoute
  const selectedBridgeKey = selectChain(state) || selectableBridges[0]?.key || null
  const selectedChain = allBridges?.[selectedBridgeKey]

  const selectedChainName = selectedBridgeKey === BridgeKey.ETHEREUM ? 'Ethereum' : selectedChain?.name || ''

  const placeholder = role === 'source' ? 'Source Chain' : 'Destination Chain'
  const primaryText = role === 'source' ? `Deposit from ${selectedChainName}` : `Receive on ${selectedChainName}`

  return {
    chains: selectableBridges,
    selectedBridgeKey,
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
