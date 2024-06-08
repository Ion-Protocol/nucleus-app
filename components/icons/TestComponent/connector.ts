import { RootState } from '@/store'
import { increment, selectCount } from '@/store/slices/counter'
import { ConnectedProps, connect } from 'react-redux'

const mapState = (state: RootState) => {
  return {
    count: selectCount(state),
  }
}

const mapDispatch = {
  increment,
}

const connector = connect(mapState, mapDispatch)

export type PropsFromRedux = ConnectedProps<typeof connector>

interface TestComponentProps extends PropsFromRedux {
  name: string
}

export namespace TestComponentConnector {
  export const Connector = connector
  export type Props = TestComponentProps
}
