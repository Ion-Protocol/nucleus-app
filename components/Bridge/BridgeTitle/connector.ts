import { BridgeKey, bridgesConfig } from '@/config/bridges'
import { RootState } from '@/store'
import { clearError } from '@/store/slices/status'
import { ChakraProps } from '@chakra-ui/react'
import { ConnectedProps, connect } from 'react-redux'

const mapState = (state: RootState, ownProps: BridgeTitleOwnProps) => {
  const { bridgeKey } = ownProps
  const bridge = bridgesConfig[bridgeKey]
  const truncatedDescription =
    bridge.description.length > 175 ? bridge.description.substring(0, 175) + '...' : bridge.description
  return {
    name: bridge.name,
    description: bridge.description,
    truncatedDescription: truncatedDescription,
  }
}

const mapDispatch = {
  clearError,
}

const connector = connect(mapState, mapDispatch)

export type PropsFromRedux = ConnectedProps<typeof connector>

interface BridgeTitleOwnProps {
  bridgeKey: BridgeKey
}

interface BridgeTitleProps extends BridgeTitleOwnProps, PropsFromRedux, ChakraProps {}

export namespace BridgeTitleConnector {
  export const Connector = connector
  export type Props = BridgeTitleProps
}
