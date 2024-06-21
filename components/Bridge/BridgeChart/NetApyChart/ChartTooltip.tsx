import { Box, Flex, Text } from '@chakra-ui/react'

interface ChartTooltipProps {
  active: boolean | undefined
  payload: any
  label: string
}

export function ChartTooltip({ active, payload, label }: ChartTooltipProps) {
  const formattedNetApy = payload[0]?.payload.formattedNetApy
  const formattedTimestamp = payload[0]?.payload.formattedTimestamp

  if (active && payload && payload.length) {
    return (
      <Flex
        direction="column"
        gap={1}
        bg="tooltip.background"
        p={3}
        border="1px solid"
        borderColor="border"
        borderRadius="8px"
        zIndex={10}
        color="tooltip.color"
      >
        <Text>
          <b>{formattedTimestamp}</b>
        </Text>
        <Flex align="center" gap={2}>
          <Box h="12px" w="12px" bg="chart.line" borderRadius="12px" />
          <Text>
            <b>Net APY:</b> {formattedNetApy}
          </Text>
        </Flex>
      </Flex>
    )
  }

  return null
}
