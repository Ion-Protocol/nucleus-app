import { RootState } from '@/store'
import { selectFormattedNetApy, selectNetApyLoading } from '@/store/slices/bridges'
import { selectChainKeyFromRoute } from '@/store/slices/router'
import { ChakraProps } from '@chakra-ui/react'
import { ConnectedProps, connect } from 'react-redux'

const mapState = (state: RootState, ownProps: ApyOwnProps) => {
  const chainKeyFromRoute = selectChainKeyFromRoute(state)
  if (!chainKeyFromRoute) return { netApy: '', loading: false }
  const netApy = selectFormattedNetApy(chainKeyFromRoute)(state)
  const loading = selectNetApyLoading(state)

  return { netApy, loading }
}

const mapDispatch = {}

const connector = connect(mapState, mapDispatch)

export type PropsFromRedux = ConnectedProps<typeof connector>

interface ApyOwnProps {}

interface ApyProps extends ApyOwnProps, PropsFromRedux, ChakraProps {}

export namespace ApyConnector {
  export const Connector = connector
  export type Props = ApyProps
}
