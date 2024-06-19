import { RootState } from '@/store'
import { selectNetApyTimeRange } from '@/store/slices/netApy'
import { ChakraProps } from '@chakra-ui/react'
import { ConnectedProps, connect } from 'react-redux'

const mapState = (state: RootState, ownProps: TimeRangeSelectorOwnProps) => {
  const selectedTimeRange = selectNetApyTimeRange(state)
  return { selectedTimeRange }
}

const mapDispatch = {}

const connector = connect(mapState, mapDispatch)

export type PropsFromRedux = ConnectedProps<typeof connector>

interface TimeRangeSelectorOwnProps {}

interface TimeRangeSelectorProps extends TimeRangeSelectorOwnProps, PropsFromRedux, ChakraProps {}

export namespace TimeRangeSelectorConnector {
  export const Connector = connector
  export type Props = TimeRangeSelectorProps
}
