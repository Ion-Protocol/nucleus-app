import { BridgeKey } from '@/config/bridges'
import { RootState } from '@/store'
import { selectBridgeFrom, selectDepositError, selectDepositPending, selectInputError } from '@/store/slices/bridges'
import { performDeposit } from '@/store/slices/bridges/thunks'
import { ConnectedProps, connect } from 'react-redux'

const mapState = (state: RootState, ownProps: SubmitOwnProps) => {
  const bridgeKey = state.router.query?.bridge as BridgeKey
  const loading = selectDepositPending(state)
  const inputError = selectInputError(state)
  const depositError = selectDepositError(state)
  const from = selectBridgeFrom(state, bridgeKey)
  const disabled = !from.trim() || !!inputError

  return {
    bridgeKey,
    loading,
    inputError,
    depositError,
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
