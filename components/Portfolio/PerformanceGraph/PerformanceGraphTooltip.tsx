import { PerformanceTableDataWithUsdValue } from '@/store/slices/portfolio/selectors'
import { abbreviateNumber } from '@/utils/number'
import { Flex, Text } from '@chakra-ui/react'
import { format } from 'date-fns'

export function PerformanceGraphTooltip({ active, payload, label }: any) {
  const payloadData = payload[0]?.payload as PerformanceTableDataWithUsdValue | undefined
  const date = payloadData?.date
  const formattedDate = date ? format(new Date(date), 'dd MMMM yyyy') : ''
  const usdValue = payloadData?.usdValue
  const formattedUsdValue = usdValue ? abbreviateNumber(usdValue, { decimals: 2 }) : ''

  return (
    <Flex
      bg="bg.main"
      px="12px"
      py="10px"
      border="1px solid"
      borderColor="stroke.main"
      borderRadius={8}
      direction="column"
      gap={1}
    >
      <Text variant="body-12" color="element.lighter">
        {formattedDate}
      </Text>
      <Text variant="body-14" color="element.main">
        {formattedUsdValue}
      </Text>
    </Flex>
  )
}
