import { tokensConfig } from '@/config/tokens'
import { RootState } from '@/store'
import { selectNetworkAssetsAsArray } from '@/store/slices/networkAssets'
import { openTermsModal } from '@/store/slices/ui'
import { ChakraProps } from '@chakra-ui/react'
import { ConnectedProps, connect } from 'react-redux'

const mapState = (state: RootState, ownProps: NavDrawerOwnProps) => {
  const networkAssets = selectNetworkAssetsAsArray(state)
  return { networkAssets }
}

const mapDispatch = { openTermsModal }

const connector = connect(mapState, mapDispatch)

export type PropsFromRedux = ConnectedProps<typeof connector>

interface NavDrawerOwnProps {}

interface NavDrawerProps extends NavDrawerOwnProps, PropsFromRedux, ChakraProps {}

export namespace NavDrawerConnector {
  export const Connector = connector
  export type Props = NavDrawerProps
}
