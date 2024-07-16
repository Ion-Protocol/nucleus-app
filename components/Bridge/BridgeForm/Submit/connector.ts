import { BridgeKey } from '@/config/chains'
import { RootState } from '@/store'
import { selectBridgeFrom, selectDepositError, selectDepositPending } from '@/store/slices/bridges'
import { performDeposit } from '@/store/slices/bridges/thunks'
import { ConnectedProps, connect } from 'react-redux'

const mapState = (state: RootState, ownProps: SubmitOwnProps) => {
  const bridgeKey = state.router.query?.bridge as BridgeKey
  const loading = selectDepositPending(state)
  const error = selectDepositError(state)
  const from = selectBridgeFrom(state)
  const disabled = !from.trim()

  return {
    bridgeKey,
    loading,
    error,
    disabled,
  }
}

const mapDispatch = {
  performDeposit,
}

const mergeProps = (
  stateProps: ReturnType<typeof mapState>,
  dispatchProps: typeof mapDispatch,
  ownProps: SubmitOwnProps
) => {
  const { bridgeKey } = stateProps

  const onSubmit = () => {
    if (bridgeKey) {
      dispatchProps.performDeposit(bridgeKey)
    }
  }

  return {
    ...stateProps,
    ...ownProps,
    onSubmit,
  }
}

const connector = connect(mapState, mapDispatch, mergeProps)

export type PropsFromRedux = ConnectedProps<typeof connector>

interface SubmitOwnProps {}

interface SubmitProps extends SubmitOwnProps, PropsFromRedux {}

export namespace SubmitConnector {
  export const Connector = connector
  export type Props = SubmitProps
}
