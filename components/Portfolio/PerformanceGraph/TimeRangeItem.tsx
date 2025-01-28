import { TimeRange } from '@/store/slices/portfolio/slice'
import { Flex, Text } from '@chakra-ui/react'

interface TimeRangeItemProps {
  timeRange: TimeRange
  selectedTimeRange: TimeRange
  onTimeRangeChange: (timeRange: TimeRange) => void
}

export function TimeRangeItem({ timeRange, selectedTimeRange, onTimeRangeChange }: TimeRangeItemProps) {
  return (
    <Flex
      bg={selectedTimeRange === timeRange ? 'bg.white' : 'transparent'}
      border="1px solid"
      borderColor={selectedTimeRange === timeRange ? 'stroke.main' : 'transparent'}
      borderRadius="4px"
      px="6px"
      py="2px"
      onClick={() => onTimeRangeChange(timeRange)}
      cursor="pointer"
    >
      <Text variant="body-14" color="element.lighter" userSelect="none">
        {timeRange}
      </Text>
    </Flex>
  )
}
