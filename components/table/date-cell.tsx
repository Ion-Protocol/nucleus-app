import { OrderStatus } from '@/types/Order'
import { Flex, Icon, Link, Text } from '@chakra-ui/react'
import { format, fromUnixTime } from 'date-fns'
import { ArrowRight, SquareArrowOutUpRight } from 'lucide-react'

interface DateCellProps {
  date: string
  showLeftArrow?: boolean
  txHash?: string | null
  vaultAddress?: string | null
  status?: OrderStatus
}

export function DateCell({ date, status, txHash, vaultAddress, showLeftArrow = false }: DateCellProps) {
  return (
    <Flex alignItems="center" gap={4}>
      {showLeftArrow && <Icon as={ArrowRight} color="element.subdued" />}
      {status === 'pending' && (
        <Text fontSize="md" color="element.subdued">
          Pending...
        </Text>
      )}
      {status === 'cancelled' && (
        <Text fontSize="md" color="element.subdued">
          Cancelled
        </Text>
      )}
      {/* Uncomment when status is updated */}
      {/* {status === 'expired' && (
        <Text fontSize="md" color="element.subdued">
          Expired...
        </Text>
      )} */}
      {status !== 'pending' && status !== 'cancelled' && (
        <Flex alignItems="top" gap={2}>
          <Text color="element.main" fontSize="md" fontFamily="diatype">
            {format(fromUnixTime(Number(date)), 'd MMMM yyyy')}
          </Text>
          {txHash && vaultAddress && (
            <Link
              onClick={(e) => e.stopPropagation()}
              isExternal
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
