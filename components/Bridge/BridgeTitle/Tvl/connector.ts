import { BridgeKey } from '@/config/bridges'
import { RootState } from '@/store'
import { selectFormattedBridgeTVLByKey } from '@/store/slices/bridges'
import { selectLoading } from '@/store/slices/status'
import { ChakraProps } from '@chakra-ui/react'
import { ConnectedProps, connect } from 'react-redux'

const mapState = (state: RootState, ownProps: TvlOwnProps) => {
  const bridgeKey = state.router.query?.bridge as BridgeKey
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

interface TvlOwnProps {}

interface TvlProps extends TvlOwnProps, PropsFromRedux, ChakraProps {}

export namespace TvlConnector {
  export const Connector = connector
  export type Props = TvlProps
}
