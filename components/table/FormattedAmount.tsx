import { bigIntToNumberAsString } from '@/utils/bigint'
import { Flex } from '@chakra-ui/react'

interface FormattedAmountProps {
  amount: string
  decimals?: number
}

export function FormattedAmount({ amount, decimals = 18 }: FormattedAmountProps) {
  return (
    <Flex>
      <span>{bigIntToNumberAsString(BigInt(amount), { decimals, maximumFractionDigits: 4 })}</span>
      {/* <Text>
        <EqualIcon />
        {amount}
      </Text> */}
    </Flex>
  )
}
