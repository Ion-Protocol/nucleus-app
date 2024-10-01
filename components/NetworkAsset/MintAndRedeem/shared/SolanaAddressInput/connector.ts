import { RootState } from '@/store'
import { selectSolanaAddress, selectSolanaAddressError, setSolanaAddress } from '@/store/slices/networkAssets'
import { ConnectedProps, connect } from 'react-redux'

const mapState = (state: RootState, ownProps: SolanaAddressInputOwnProps) => {
  const solanaAddress = selectSolanaAddress(state)
  const solanaAddressError = selectSolanaAddressError(state)
  return { solanaAddress, solanaAddressError }
}

const mapDispatch = {
  onChangeSolanaAddress: setSolanaAddress,
}

const connector = connect(mapState, mapDispatch)

export type PropsFromRedux = ConnectedProps<typeof connector>

interface SolanaAddressInputOwnProps {}

interface SolanaAddressInputProps extends SolanaAddressInputOwnProps, PropsFromRedux {}

export namespace SolanaAddressInputConnector {
  export const Connector = connector
  export type Props = SolanaAddressInputProps
}
