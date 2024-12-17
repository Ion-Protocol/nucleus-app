import { Flex } from '@chakra-ui/react'
import { formatUnits } from 'viem'

interface FormattedAmountProps {
  amount: string
  decimals?: number
}

export function FormattedAmount({ amount, decimals = 18 }: FormattedAmountProps) {
  return (
    <Flex>
      <span>{formatUnits(BigInt(amount), decimals)}</span>
      {/* <Text>
        <EqualIcon />
        {amount}
      </Text> */}
    </Flex>
  )
}
