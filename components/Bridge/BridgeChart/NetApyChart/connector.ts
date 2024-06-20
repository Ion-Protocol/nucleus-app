import { RootState } from '@/store'
import {
  selectEvenlySpacedXTicks,
  selectEvenlySpacedYTicks,
  selectFormattedTimeRangeDates,
  selectNetApyHistoryWithIndexes,
} from '@/store/slices/netApy'
import { ConnectedProps, connect } from 'react-redux'

const mapState = (state: RootState, ownProps: NetApyChartOwnProps) => {
  const netApyDataWithIndexes = selectNetApyHistoryWithIndexes(state)
  const formattedTimeRangeDates = selectFormattedTimeRangeDates(state)
  const xTickIndexes = selectEvenlySpacedXTicks(state)
  const yTickIndexes = selectEvenlySpacedYTicks(state)

  return { netApyData: netApyDataWithIndexes, formattedTimeRangeDates, xTickIndexes, yTickIndexes }
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
