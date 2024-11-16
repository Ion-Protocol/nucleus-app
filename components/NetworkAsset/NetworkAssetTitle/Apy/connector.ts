import { RootState } from '@/store'
import {
  selectFormattedNetApy,
  selectNetApy,
  selectNetApyLoading,
  selectShouldShowMessageForLargeNetApy,
} from '@/store/slices/networkAssets'
import { selectNetworkAssetFromRoute } from '@/store/slices/router'
import { numberToPercent } from '@/utils/number'
import { ChakraProps } from '@chakra-ui/react'
import { ConnectedProps, connect } from 'react-redux'

const mapState = (state: RootState, ownProps: ApyOwnProps) => {
  const networkAssetFromRoute = selectNetworkAssetFromRoute(state)
  if (!networkAssetFromRoute)
    return { formattedNetApy: '', fullFormattedNetApy: '', loading: false, shouldShowMessageForLargeNetApy: false }
  const formattedNetApy = selectFormattedNetApy(state, networkAssetFromRoute)
  const rawNetApy = selectNetApy(state, networkAssetFromRoute)
  const fullFormattedNetApy = `${numberToPercent(rawNetApy || 0)}`
  const loading = selectNetApyLoading(state)
  const shouldShowMessageForLargeNetApy = selectShouldShowMessageForLargeNetApy(state, networkAssetFromRoute)

  return { formattedNetApy, fullFormattedNetApy, loading, shouldShowMessageForLargeNetApy }
}

const mapDispatch = {}

const connector = connect(mapState, mapDispatch)

export type PropsFromRedux = ConnectedProps<typeof connector>

interface ApyOwnProps {
  apy: number | undefined
  loading: boolean
}

interface ApyProps extends ApyOwnProps, PropsFromRedux, ChakraProps {}

export namespace ApyConnector {
  export const Connector = connector
  export type Props = ApyProps
}
