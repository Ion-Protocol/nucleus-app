import { Flex, Link, Text } from '@chakra-ui/react'
import { format, fromUnixTime } from 'date-fns'
import { ArrowRight, ArrowUpRight } from 'lucide-react'

interface DateCellProps {
  date: string
  showLeftArrow?: boolean
  emptyValue?: string
  txHash?: string
  vaultAddress?: string
}

export function DateCell({
  date,
  emptyValue = 'Pending...',
  txHash,
  vaultAddress,
  showLeftArrow = false,
}: DateCellProps) {
  return (
    <Flex alignItems="center" gap={4}>
      {showLeftArrow && <ArrowRight size={16} strokeWidth={1.5} />}
      {!date || date === '0' ? (
        <Text fontSize="md" color="neutral.800">
          {emptyValue}
        </Text>
      ) : (
        <Text fontSize="md" color="">
          {format(fromUnixTime(Number(date)), 'PP')}
        </Text>
      )}
      {txHash && vaultAddress && (
        <Link href={`https://etherscan.io/tx/${txHash}`} target="_blank">
          <ArrowUpRight size={16} />
        </Link>
      )}
    </Flex>
  )
}
