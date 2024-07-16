import { RootState } from '@/store'
import { selectActiveFormattedBridgeTvl, selectBridgesLoading } from '@/store/slices/bridges'
import { ChakraProps } from '@chakra-ui/react'
import { ConnectedProps, connect } from 'react-redux'

const mapState = (state: RootState, ownProps: TvlOwnProps) => {
  const tvlFormatted = selectActiveFormattedBridgeTvl(state)
  const loading = selectBridgesLoading(state)

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
