import { tokensConfig } from '@/config/token'
import { RootState } from '@/store'
import { selectChainsAsArray } from '@/store/slices/bridges'
import { openTermsModal } from '@/store/slices/ui'
import { ChakraProps } from '@chakra-ui/react'
import { ConnectedProps, connect } from 'react-redux'

const mapState = (state: RootState, ownProps: NavDrawerOwnProps) => {
  const chains = selectChainsAsArray(state)
  return { chains }
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
