import { RootState } from '@/store'
import {
  selectFormattedTimeRangeDates,
  selectNetApyDataWithFormatting,
  selectNetApyLoading,
} from '@/store/slices/netApy'
import { ConnectedProps, connect } from 'react-redux'

const mapState = (state: RootState, ownProps: NetApyChartOwnProps) => {
  const dataWithFormatting = selectNetApyDataWithFormatting(state)
  const formattedTimeRangeDates = selectFormattedTimeRangeDates(state)
  const loading = selectNetApyLoading(state)

  return { netApyData: dataWithFormatting, formattedTimeRangeDates, loading }
}

const mapDispatch = {}

const connector = connect(mapState, mapDispatch)

export type PropsFromRedux = ConnectedProps<typeof connector>

interface NetApyChartOwnProps {}

interface NetApyChartProps extends NetApyChartOwnProps, PropsFromRedux {}

export namespace NetApyChartConnector {
  export const Connector = connector
  export type Props = NetApyChartProps
}
