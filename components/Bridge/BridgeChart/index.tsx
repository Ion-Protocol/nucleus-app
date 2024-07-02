import { InfoOutlineIcon } from '@chakra-ui/icons'
import { Flex, Text, Tooltip } from '@chakra-ui/react'
import NetApyChart from './NetApyChart'
import TimeRangeSelector from './TimeRangeSelector'
import { BridgeChartConnector } from './connector'
import { IonSkeleton } from '@/components/shared/IonSkeleton'

function BridgeChart({ latestFormattedNetApy, loading }: BridgeChartConnector.Props) {
  return (
    <Flex direction="column">
      <Flex justify="space-between">
        {/* Latest Net APY */}
        <Flex direction="column" gap={2}>
          <Flex gap={2}>
            <Text variant="large">Historical Net APYs</Text>
            <Tooltip label="The historical annualized returns of the native yield token over time.">
              <InfoOutlineIcon color="secondaryText" />
            </Tooltip>
          </Flex>
          <IonSkeleton isLoaded={!loading}>
            <Text variant="xxl">{latestFormattedNetApy}</Text>
          </IonSkeleton>
        </Flex>

        {/* Time Range Selector */}
        <TimeRangeSelector />
      </Flex>

      <Flex h={4} />

      {/* Net APY Chart */}
      <NetApyChart />
    </Flex>
  )
}

export default BridgeChartConnector.Connector(BridgeChart)
