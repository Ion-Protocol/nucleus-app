import { uiConfig } from '@/config/ui'
import { RootState } from '@/store'
import { selectBridgeConfig } from '@/store/slices/bridges'
import { BridgeKey } from '@/types/BridgeKey'
import { ChakraProps } from '@chakra-ui/react'
import { ConnectedProps, connect } from 'react-redux'

const mapState = (state: RootState, ownProps: BridgeTitleOwnProps) => {
  const bridgeKey = state.router.query?.bridge as BridgeKey
  const bridgeConfig = selectBridgeConfig(state)

  const descriptionLength = uiConfig.pages.bridge.title.descriptionLenth
  const description = bridgeConfig?.description || ''
  const truncatedDescription =
    description.length > descriptionLength ? description.substring(0, descriptionLength) + '...' : description

  return {
    bridgeKey,
    name: bridgeConfig?.name,
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
