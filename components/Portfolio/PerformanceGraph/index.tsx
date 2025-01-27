import { TimeRange } from '@/store/slices/portfolio/slice'
import { Flex, Spinner, Text, useColorMode, useTheme } from '@chakra-ui/react'
import { TimeRangeItem } from './TimeRangeItem'
import { CartesianGrid, ResponsiveContainer, Tooltip, XAxis, YAxis, Area, AreaChart } from 'recharts'
import { selectPerformanceGraphDataInUsd, selectPerformanceGraphDataLoading } from '@/store/slices/portfolio/selectors'
import { useAppSelector } from '@/store/hooks'
import { abbreviateNumber } from '@/utils/number'
import { format } from 'date-fns'
import { PerformanceGraphTooltip } from './PerformanceGraphTooltip'

interface PerformanceGraphProps {
  selectedTimeRange: TimeRange
  onTimeRangeChange: (timeRange: TimeRange) => void
}

export function PerformanceGraph({ selectedTimeRange, onTimeRangeChange }: PerformanceGraphProps) {
  const theme = useTheme()
  const { colorMode } = useColorMode()
  const strokeColor =
    colorMode === 'dark'
      ? theme.semanticTokens.colors.stroke.lighter._dark
      : theme.semanticTokens.colors.stroke.lighter.default
  const textColor =
    colorMode === 'dark'
      ? theme.semanticTokens.colors.element.subdued._dark
      : theme.semanticTokens.colors.element.subdued.default
  const lineColor = colorMode === 'dark' ? theme.colors.dark.green['400'] : theme.colors.light.green['400']
  const cursorColor = colorMode === 'dark' ? theme.colors.dark.green['300'] : theme.colors.light.green['300']
  const fillColor = colorMode === 'dark' ? '#27362A' : '#EBFCF1'

  // Load the data
  const performanceGraphData = useAppSelector(selectPerformanceGraphDataInUsd)

  // Get loading state
  const isLoading = useAppSelector(selectPerformanceGraphDataLoading)

  // Calculate the bounds for the Y-axis
  const usdValues = performanceGraphData.map((data) => data.usdValue)
  const minValue = Math.min(...usdValues)
  const maxValue = Math.max(...usdValues)
  const yAxisLowerBound = minValue - minValue * 0.1
  const yAxisUpperBound = maxValue + maxValue * 0.1

  // Generate evenly spaced ticks for the Y-axis
  const numberOfYTicks = 5
  const yTickInterval = (yAxisUpperBound - yAxisLowerBound) / (numberOfYTicks - 1)
  const yAxisTicks = Array.from({ length: numberOfYTicks }, (_, index) => yAxisLowerBound + index * yTickInterval)

  // Generate evenly spaced ticks for the X-axis
  const numberOfXTicks = 7
  const xTickInterval = Math.floor(performanceGraphData.length / (numberOfXTicks - 1))
  const xAxisTicks = performanceGraphData.filter((_, index) => index % xTickInterval === 0).map((data) => data.date)

  return (
    <Flex w="full" direction="column" gap={5}>
      {/* Header */}
      <Flex justify="space-between" align="center" w="full" h="30px">
        <Text variant="body-16-m" color="element.subdued">
          Performance
        </Text>

        <Flex bg="bg.secondary" p={1} borderRadius="8px" gap={1}>
          <TimeRangeItem
            timeRange={TimeRange.OneMonth}
            selectedTimeRange={selectedTimeRange}
            onTimeRangeChange={onTimeRangeChange}
          />
          <TimeRangeItem
            timeRange={TimeRange.ThreeMonths}
            selectedTimeRange={selectedTimeRange}
            onTimeRangeChange={onTimeRangeChange}
          />
          <TimeRangeItem
            timeRange={TimeRange.OneYear}
            selectedTimeRange={selectedTimeRange}
            onTimeRangeChange={onTimeRangeChange}
          />
        </Flex>
      </Flex>

      {/* Chart */}
      <Flex w="100%" h="360px" border="1px solid" borderColor="stroke.main" p={6} borderRadius={8} position="relative">
        <ResponsiveContainer width="100%" height="100%" minHeight={100} minWidth={100}>
          <AreaChart data={performanceGraphData}>
            <CartesianGrid stroke={strokeColor} strokeWidth={1} vertical={false} />

            <Area
              type="monotone"
              dataKey="usdValue"
              stroke={lineColor}
              fill={fillColor}
              dot={false}
              activeDot={{
                r: 3,
                fill: lineColor,
                strokeWidth: 4,
                stroke: `${lineColor}50`,
              }}
              animationDuration={1000}
              hide={isLoading}
            />

            <XAxis
              dataKey="date"
              ticks={xAxisTicks}
              tickFormatter={(date) => format(new Date(date), 'MMM d')}
              axisLine={{ stroke: strokeColor, strokeWidth: 1 }}
              tickLine={{ stroke: strokeColor, strokeWidth: 1 }}
              style={{
                fontFamily: 'var(--font-diatype)',
                fontSize: 14,
                color: textColor,
              }}
              tickMargin={12}
              hide={isLoading}
            />

            <YAxis
              dataKey="usdValue"
              domain={[yAxisLowerBound, yAxisUpperBound]}
              ticks={yAxisTicks}
              tickFormatter={(value) => abbreviateNumber(value, { decimals: 1, abbreviateThousands: true })}
              orientation="right"
              axisLine={false}
              tickLine={false}
              style={{
                fontFamily: 'var(--font-diatype)',
                fontSize: 14,
                color: textColor,
              }}
              tickMargin={12}
              hide={isLoading}
            />

            <Tooltip
              content={<PerformanceGraphTooltip />}
              cursor={{
                stroke: cursorColor,
                strokeWidth: 1,
                fill: lineColor,
                display: isLoading ? 'none' : 'block',
              }}
            />
          </AreaChart>
        </ResponsiveContainer>
        {isLoading && (
          <Flex position="absolute" top={0} left={0} w="100%" h="100%" justify="center" align="center">
            <Spinner size="lg" color="element.subdued" />
          </Flex>
        )}
      </Flex>
    </Flex>
  )
}
