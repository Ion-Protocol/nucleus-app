import { RootState } from '@/store'
import { selectDepositDisabled, selectDepositPending } from '@/store/slices/bridges'
import { performDeposit } from '@/store/slices/bridges/thunks'
import { ConnectedProps, connect } from 'react-redux'

const mapState = (state: RootState, ownProps: SubmitOwnProps) => {
  const loading = selectDepositPending(state)
  const disabled = selectDepositDisabled(state)

  return {
    loading,
    disabled,
  }
}

const mapDispatch = {
  onSubmit: (beginCheckout: any) => performDeposit(beginCheckout),
}

const connector = connect(mapState, mapDispatch)

export type PropsFromRedux = ConnectedProps<typeof connector>

interface SubmitOwnProps {}

interface SubmitProps extends SubmitOwnProps, PropsFromRedux {}

export namespace SubmitConnector {
  export const Connector = connector
  export type Props = SubmitProps
}
