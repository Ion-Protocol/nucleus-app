import { RootState } from '@/store'
import { selectCurrency, setCurrency } from '@/store/slices/currency'
import { ConnectedProps, connect } from 'react-redux'

const mapState = (state: RootState) => {
  return {
    currency: selectCurrency(state),
  }
}

const mapDispatch = {
  setCurrency: setCurrency,
}

const connector = connect(mapState, mapDispatch)

export type PropsFromRedux = ConnectedProps<typeof connector>

interface CurrencySelectProps extends PropsFromRedux {}

export namespace CurrencySelectConnector {
  export const Connector = connector
  export type Props = CurrencySelectProps
}
