import { BridgeKey, bridgesConfig } from '@/config/bridges'
import { uiConfig } from '@/config/ui'
import { RootState } from '@/store'
import { ChakraProps } from '@chakra-ui/react'
import { ConnectedProps, connect } from 'react-redux'

const mapState = (state: RootState, ownProps: BridgeTitleOwnProps) => {
  const bridgeKey = state.router.query?.bridge as BridgeKey
  const bridge = bridgesConfig[bridgeKey]

  const descriptionLength = uiConfig.pages.bridge.title.descriptionLenth
  const truncatedDescription =
    bridge.description.length > descriptionLength
      ? bridge.description.substring(0, descriptionLength) + '...'
      : bridge.description

  return {
    bridgeKey,
    name: bridge.name,
    description: truncatedDescription,
  }
}

const mapDispatch = {}

const connector = connect(mapState, mapDispatch)

export type PropsFromRedux = ConnectedProps<typeof connector>

interface BridgeTitleOwnProps {}

interface BridgeTitleProps extends BridgeTitleOwnProps, PropsFromRedux, ChakraProps {}

export namespace BridgeTitleConnector {
  export const Connector = connector
  export type Props = BridgeTitleProps
}
