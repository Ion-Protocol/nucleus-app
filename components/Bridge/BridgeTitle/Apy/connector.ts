import { RootState } from '@/store'
import {
  selectFormattedNetApy,
  selectNetApy,
  selectNetApyLoading,
  selectShouldShowMessageForLargeNetApy,
} from '@/store/slices/bridges'
import { selectChainKeyFromRoute } from '@/store/slices/router'
import { numberToPercent } from '@/utils/number'
import { ChakraProps } from '@chakra-ui/react'
import { ConnectedProps, connect } from 'react-redux'

const mapState = (state: RootState, ownProps: ApyOwnProps) => {
  const chainKeyFromRoute = selectChainKeyFromRoute(state)
  if (!chainKeyFromRoute)
    return { formattedNetApy: '', fullFormattedNetApy: '', loading: false, shouldShowMessageForLargeNetApy: false }
  const formattedNetApy = selectFormattedNetApy(chainKeyFromRoute)(state)
  const rawNetApy = selectNetApy(chainKeyFromRoute)(state)
  const fullFormattedNetApy = `${numberToPercent(rawNetApy || 0)}`
  const loading = selectNetApyLoading(state)
  const shouldShowMessageForLargeNetApy = selectShouldShowMessageForLargeNetApy(chainKeyFromRoute)(state)

  return { formattedNetApy, fullFormattedNetApy, loading, shouldShowMessageForLargeNetApy }
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
