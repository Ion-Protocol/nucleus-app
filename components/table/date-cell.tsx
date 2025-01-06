import { Flex, Icon, Link, Text } from '@chakra-ui/react'
import { format, fromUnixTime } from 'date-fns'
import { ArrowRight, SquareArrowOutUpRight } from 'lucide-react'

interface DateCellProps {
  date: string
  showLeftArrow?: boolean
  emptyValue?: string
  txHash?: string | null
  vaultAddress?: string | null
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
      {showLeftArrow && <Icon as={ArrowRight} color="element.subdued" />}
      {!date || date === '0' ? (
        <Text fontSize="md" color="element.subdued">
          {emptyValue}
        </Text>
      ) : (
        <Flex alignItems="top" gap={2}>
          <Text color="element.main" fontSize="md" fontFamily="diatype">
            {format(fromUnixTime(Number(date)), 'd MMMM yyyy')}
          </Text>
          {txHash && vaultAddress && (
            <Link
              href={`https://etherscan.io/tx/${txHash}`}
              target="_blank"
              rel="noopener noreferrer"
              color="element.lighter"
            >
              <Icon as={SquareArrowOutUpRight} boxSize={4} color="element.lighter" />
            </Link>
          )}
        </Flex>
      )}
    </Flex>
  )
}
