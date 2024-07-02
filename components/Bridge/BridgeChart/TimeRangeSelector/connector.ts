import { RootState } from '@/store'
import { selectNetApyTimeRange, setTimeRange } from '@/store/slices/netApy'
import { TimeRange } from '@/types/TimeRange'
import { ChakraProps } from '@chakra-ui/react'
import { ConnectedProps, connect } from 'react-redux'

const mapState = (state: RootState, ownProps: TimeRangeSelectorOwnProps) => {
  const selectedTimeRange = selectNetApyTimeRange(state)
  let timeRanges = Object.values(TimeRange)
  return { selectedTimeRange, timeRanges }
}

const mapDispatch = {
  setTimeRange,
}

const connector = connect(mapState, mapDispatch)

export type PropsFromRedux = ConnectedProps<typeof connector>

interface TimeRangeSelectorOwnProps {}

interface TimeRangeSelectorProps extends TimeRangeSelectorOwnProps, PropsFromRedux, ChakraProps {}

export namespace TimeRangeSelectorConnector {
  export const Connector = connector
  export type Props = TimeRangeSelectorProps
}
