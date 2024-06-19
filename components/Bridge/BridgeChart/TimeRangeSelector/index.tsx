import { Flex } from '@chakra-ui/react'
import { TimeRangeSelectorConnector } from './connector'

function TimeRangeSelector({ selectedTimeRange }: TimeRangeSelectorConnector.Props) {
  return <Flex></Flex>
}

export default TimeRangeSelectorConnector.Connector(TimeRangeSelector)
