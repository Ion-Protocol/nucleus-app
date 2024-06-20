import { Flex, Text, useColorMode } from '@chakra-ui/react'
import { NetApyChartConnector } from './connector'
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts'
import { ChartTooltip } from './ChartTooltip'
import { getColorFromToken } from '@/styles/theme/helpers/getColorFromToken'

function NullTick() {
  return null
}

function NetApyChart({ netApyData, formattedTimeRangeDates, xTickIndexes, yTickIndexes }: NetApyChartConnector.Props) {
  const { colorMode } = useColorMode()
  const gridColor = getColorFromToken('chart.grid', colorMode)
  const lineColor = getColorFromToken('chart.line', colorMode)

  return (
    <Flex h="400px" direction="column" align="center">
      <ResponsiveContainer width="100%" height="100%">
        <LineChart width={500} height={300} data={netApyData}>
          <defs>
            <filter id="glow" x="-50%" y="-50%" width="200%" height="200%">
              <feGaussianBlur stdDeviation="4.5" result="coloredBlur" />
              <feMerge>
                <feMergeNode in="coloredBlur" />
                <feMergeNode in="SourceGraphic" />
              </feMerge>
            </filter>
          </defs>
          <CartesianGrid strokeDasharray="4 4" stroke={gridColor} />
          <XAxis
            dataKey="index"
            ticks={xTickIndexes}
            interval={0}
            tick={<NullTick />}
            axisLine={false}
            tickLine={false}
            height={0}
          />
          <YAxis
            dataKey="netApy"
            ticks={yTickIndexes}
            interval={0}
            tick={<NullTick />}
            axisLine={false}
            tickLine={false}
            width={0}
          />
          <Tooltip
            content={({ active, payload, label }) => <ChartTooltip active={active} payload={payload} label={label} />}
          />
          <Line
            type="monotone"
            dataKey="netApy"
            stroke={lineColor}
            dot={false}
            activeDot={{ r: 4 }}
            strokeWidth={2}
            filter="url(#glow)"
            animationDuration={500}
          />
        </LineChart>
      </ResponsiveContainer>
      <Flex justify="space-between" mt={2} w="100%">
        {formattedTimeRangeDates.map((date, i) => (
          <Text variant="large" color="secondaryText" key={i}>
            {date}
          </Text>
        ))}
      </Flex>
    </Flex>
  )
}

export default NetApyChartConnector.Connector(NetApyChart)
