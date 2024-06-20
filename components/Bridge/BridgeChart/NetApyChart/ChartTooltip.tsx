import { Flex, Text } from '@chakra-ui/react'

interface ChartTooltipProps {
  active: boolean | undefined
  payload: any
  label: string
}

export function ChartTooltip({ active, payload, label }: ChartTooltipProps) {
  if (active && payload && payload.length) {
    return (
      <Flex>
        <Text>{`Index: ${payload[0].payload.index}`}</Text>
        <Text>{`Net APY: ${payload[0].value}`}</Text>
      </Flex>
    )
  }

  return null
}
