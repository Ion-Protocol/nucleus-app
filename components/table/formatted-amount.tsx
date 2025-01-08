import { bigIntToNumber, bigIntToNumberAsString } from '@/utils/bigint'
import { Flex } from '@chakra-ui/react'

interface FormattedAmountProps {
  amount: string
  decimals?: number
}

export function FormattedAmount({ amount, decimals = 18 }: FormattedAmountProps) {
  const amountAsNumber = bigIntToNumber(BigInt(amount), { decimals })
  const displayAmount = bigIntToNumberAsString(BigInt(amount), { maximumFractionDigits: 4 })

  return (
    <Flex>
      <span>{amountAsNumber < 0.0001 ? '< 0.0001' : displayAmount}</span>
      {/* <Text>
        <EqualIcon />
        {amount}
      </Text> */}
    </Flex>
  )
}
