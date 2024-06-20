import { Flex, Text } from '@chakra-ui/react'

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
        bg="backgroundSecondary"
        p={3}
        border="1px solid"
        borderColor="border"
        borderRadius="8px"
        zIndex={10}
      >
        <Text>
          <b>{formattedTimestamp}</b>
        </Text>
        <Text>
          <b>Net APY:</b> {formattedNetApy}
        </Text>
      </Flex>
    )
  }

  return null
}
