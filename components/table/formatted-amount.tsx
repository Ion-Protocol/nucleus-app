import { bigIntToNumber } from '@/utils/bigint'
import { formatWithSignificantDecimals } from '@/utils/number'
import { Flex } from '@chakra-ui/react'

interface FormattedAmountProps {
  amount: string
  decimals?: number
}

export function FormattedAmount({ amount, decimals = 18 }: FormattedAmountProps) {
  const amountAsNumber = bigIntToNumber(BigInt(amount), { decimals })
  const formattedAmountWithSignificantDecimals = formatWithSignificantDecimals(amountAsNumber)
  return (
    <Flex>
      <span>{formattedAmountWithSignificantDecimals}</span>
      {/* <Text>
        <EqualIcon />
        {amount}
      </Text> */}
    </Flex>
  )
}
