import { Flex, Text } from '@chakra-ui/react'
import { motion } from 'framer-motion'
import { TimeRangeSelectorConnector } from './connector'
import { useAnimatedMotionBox } from './useAnimatedMotionBox'

function TimeRangeSelector({ selectedTimeRange, timeRanges, setTimeRange }: TimeRangeSelectorConnector.Props) {
  const { containerRef, selectedPosition, selectedTimeRangeBackground } = useAnimatedMotionBox(
    selectedTimeRange,
    timeRanges
  )

  return (
    <Flex
      ref={containerRef}
      px={3}
      py={1}
      bg="timeRange.background"
      border="1px solid"
      borderColor="border"
      borderRadius="8px"
      gap={3}
      h="fit-content"
      align="center"
      position="relative"
    >
      {/* The horizontal bar of time ranges */}
      {timeRanges.map((timeRange) => (
        <Flex
          key={timeRange}
          align="center"
          px={3}
          py={1}
          position="relative"
          data-time-range={timeRange}
          onClick={() => setTimeRange(timeRange)}
          cursor="pointer"
          zIndex={2}
        >
          <Text
            mt={2}
            mb={1}
            variant="large"
            textTransform="capitalize"
            color={selectedTimeRange === timeRange ? 'default' : 'timeRange.unselectedText'}
            zIndex={2}
            userSelect="none"
            lineHeight={0.8}
          >
            {timeRange}
          </Text>
        </Flex>
      ))}

      {/* The animated box indicating the selected time range */}
      {selectedPosition && (
        <motion.div
          initial={false}
          animate={{ left: selectedPosition.left, width: selectedPosition.width, height: selectedPosition.height }}
          transition={{ type: 'spring', stiffness: 300, damping: 30 }}
          style={{
            position: 'absolute',
            backgroundColor: selectedTimeRangeBackground,
            borderRadius: '8px',
            top: '50%',
            transform: 'translateY(-50%)',
            zIndex: 1,
          }}
        />
      )}
    </Flex>
  )
}

export default TimeRangeSelectorConnector.Connector(TimeRangeSelector)
