import { RootState } from '@/store'
import { selectFormattedLatestNetApy, selectNetApyLoading } from '@/store/slices/netApy'
import { ChakraProps } from '@chakra-ui/react'
import { ConnectedProps, connect } from 'react-redux'

const mapState = (state: RootState, ownProps: BridgeChartOwnProps) => {
  const loading = selectNetApyLoading(state)
  const latestFormattedNetApy = selectFormattedLatestNetApy(state)

  return {
    latestFormattedNetApy,
    loading,
  }
}

const mapDispatch = {}

const connector = connect(mapState, mapDispatch)

export type PropsFromRedux = ConnectedProps<typeof connector>

interface BridgeChartOwnProps {}

interface BridgeChartProps extends BridgeChartOwnProps, PropsFromRedux, ChakraProps {}

export namespace BridgeChartConnector {
  export const Connector = connector
  export type Props = BridgeChartProps
}
