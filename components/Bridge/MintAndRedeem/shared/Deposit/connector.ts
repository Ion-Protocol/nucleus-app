import { RootState } from '@/store'
import { selectBridgeFrom, selectDepositError, selectDepositPending } from '@/store/slices/bridges'
import { performDeposit } from '@/store/slices/bridges/thunks'
import { BridgeKey } from '@/types/BridgeKey'
import { ConnectedProps, connect } from 'react-redux'

const mapState = (state: RootState, ownProps: SubmitOwnProps) => {
  const bridgeKey = state.router.query?.bridge as BridgeKey
  const loading = selectDepositPending(state)
  const error = selectDepositError(state)
  const from = selectBridgeFrom(state)
  const disabled = !from.trim() || parseFloat(from) === 0

  return {
    bridgeKey,
    loading,
    error,
    disabled,
  }
}

const mapDispatch = {
  onSubmit: () => performDeposit(),
}

const connector = connect(mapState, mapDispatch)

export type PropsFromRedux = ConnectedProps<typeof connector>

interface SubmitOwnProps {}

interface SubmitProps extends SubmitOwnProps, PropsFromRedux {}

export namespace SubmitConnector {
  export const Connector = connector
  export type Props = SubmitProps
}
