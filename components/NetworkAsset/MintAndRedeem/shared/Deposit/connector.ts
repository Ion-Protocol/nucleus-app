import { RootState } from '@/store'
import {
  selectDepositAndBridgeCheckoutParams,
  selectDepositDisabled,
  selectDepositPending,
  selectShouldUseFunCheckout,
} from '@/store/slices/networkAssets'
import { performDeposit } from '@/store/slices/networkAssets/thunks'
import { ConnectedProps, connect } from 'react-redux'

const mapState = (state: RootState, ownProps: SubmitOwnProps) => {
  const loading = selectDepositPending(state)
  const disabled = selectDepositDisabled(state)
  const shouldUseFunCheckout = selectShouldUseFunCheckout(state)
  const funkitCheckoutParams = selectDepositAndBridgeCheckoutParams(state)

  return {
    loading,
    disabled,
    shouldUseFunCheckout: shouldUseFunCheckout && !disabled,
    funkitCheckoutParams,
  }
}

const mapDispatch = {
  onSubmit: performDeposit,
}

const connector = connect(mapState, mapDispatch)

export type PropsFromRedux = ConnectedProps<typeof connector>

interface SubmitOwnProps {}

interface SubmitProps extends SubmitOwnProps, PropsFromRedux {}

export namespace SubmitConnector {
  export const Connector = connector
  export type Props = SubmitProps
}
