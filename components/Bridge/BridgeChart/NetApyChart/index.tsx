import { getColorFromToken } from '@/styles/theme/helpers/getColorFromToken'
import { Flex, Text, useColorMode } from '@chakra-ui/react'
import { CartesianGrid, Line, LineChart, ResponsiveContainer, Tooltip, XAxis, YAxis } from 'recharts'
import { ChartTooltip } from './ChartTooltip'
import { GridBackground } from './GridBackground'
import { NetApyChartConnector } from './connector'

function NetApyChart({ netApyData, formattedTimeRangeDates }: NetApyChartConnector.Props) {
  const { colorMode } = useColorMode()
  const lineColor = getColorFromToken('chart.line', colorMode)

  return (
    <Flex direction="column">
      <Flex h="225px" direction="column" align="center" position="relative">
        <GridBackground />
        <ResponsiveContainer width="100%" height="100%">
          <LineChart
            width={500}
            height={300}
            data={netApyData}
            margin={{
              top: 20,
            }}
          >
            <defs>
              <filter id="glow" x="-50%" y="-50%" width="200%" height="200%">
                <feGaussianBlur stdDeviation="4.5" result="coloredBlur" />
                <feMerge>
                  <feMergeNode in="coloredBlur" />
                  <feMergeNode in="SourceGraphic" />
                </feMerge>
              </filter>
            </defs>
            <CartesianGrid horizontal={false} vertical={false} />
            <XAxis dataKey="index" height={0} />
            <YAxis
              dataKey="netApy"
              width={0}
              type="number"
              domain={[(dataMin: number) => Math.max(0, dataMin - 0.01), 'dataMax']}
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
      </Flex>
      <Flex justify="space-between" mt={2} width="100%">
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
