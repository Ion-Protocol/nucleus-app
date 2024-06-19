import { InfoOutlineIcon } from '@chakra-ui/icons'
import { Flex, Skeleton, Text, Tooltip } from '@chakra-ui/react'
import TimeRangeSelector from './TimeRangeSelector'
import { BridgeChartConnector } from './connector'

function BridgeChart({ latestFormattedNetApy, loading }: BridgeChartConnector.Props) {
  return (
    <Flex direction="column">
      <Flex justify="space-between">
        {/* Latest Net APY */}
        <Flex direction="column" gap={2}>
          <Flex gap={2}>
            <Text variant="large">Historical Net APYs</Text>
            <Tooltip label="Lorem ipsum dolor sit amet, consectetur adipiscing.">
              <InfoOutlineIcon color="secondaryText" />
            </Tooltip>
          </Flex>
          <Skeleton isLoaded={!loading}>
            <Text variant="xxl">{latestFormattedNetApy}</Text>
          </Skeleton>
        </Flex>

        {/* Time Range Selector */}
        <TimeRangeSelector />
      </Flex>
    </Flex>
  )
}

export default BridgeChartConnector.Connector(BridgeChart)
