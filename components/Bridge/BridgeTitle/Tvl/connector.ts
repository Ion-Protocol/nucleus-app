import { BridgeKey, bridgesConfig } from '@/config/bridges'
import { uiConfig } from '@/config/ui'
import { RootState } from '@/store'
import { selectBridgeTVLByKey, selectFormattedBridgeTVLByKey } from '@/store/slices/bridges'
import { selectLoading } from '@/store/slices/status'
import { ChakraProps } from '@chakra-ui/react'
import { ConnectedProps, connect } from 'react-redux'

const mapState = (state: RootState, ownProps: TvlOwnProps) => {
  const { bridgeKey } = ownProps
  const tvlFormatted = selectFormattedBridgeTVLByKey(bridgeKey)(state)
  const loading = selectLoading(state)

  return {
    tvlFormatted,
    loading,
  }
}

const mapDispatch = {}

const connector = connect(mapState, mapDispatch)

export type PropsFromRedux = ConnectedProps<typeof connector>

interface TvlOwnProps {
  bridgeKey: BridgeKey
}

interface TvlProps extends TvlOwnProps, PropsFromRedux, ChakraProps {}

export namespace TvlConnector {
  export const Connector = connector
  export type Props = TvlProps
}
