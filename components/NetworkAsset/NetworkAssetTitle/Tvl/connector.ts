import { RootState } from '@/store'
import { selectActiveFormattedNetworkAssetTvl, selectTvlLoading } from '@/store/slices/networkAssets'
import { ChakraProps } from '@chakra-ui/react'
import { ConnectedProps, connect } from 'react-redux'

const mapState = (state: RootState, ownProps: TvlOwnProps) => {
  const tvlFormatted = selectActiveFormattedNetworkAssetTvl(state)
  const loading = selectTvlLoading(state)

  return {
    tvlFormatted,
    loading,
  }
}

const mapDispatch = {}

const connector = connect(mapState, mapDispatch)

export type PropsFromRedux = ConnectedProps<typeof connector>

interface TvlOwnProps {
  tvl: string | undefined
  loading: boolean
}

interface TvlProps extends TvlOwnProps, PropsFromRedux, ChakraProps {}

export namespace TvlConnector {
  export const Connector = connector
  export type Props = TvlProps
}
