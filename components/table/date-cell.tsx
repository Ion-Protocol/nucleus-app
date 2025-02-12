import { OrderStatus } from '@/types/Order'
import { Flex, Icon, Link, Text } from '@chakra-ui/react'
import { ArrowRight, LinkExternal02 } from '@untitled-ui/icons-react'
import { format, fromUnixTime } from 'date-fns'

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
      {status === 'expired' && (
        <Text fontSize="md" color="element.subdued">
          Expired
        </Text>
      )}
      {status !== 'pending' && status !== 'cancelled' && status !== 'expired' && (
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
              <Icon
                as={LinkExternal02}
                fontSize={16}
                color="element.lighter"
                sx={{
                  path: {
                    strokeWidth: '1px',
                  },
                }}
              />
            </Link>
          )}
        </Flex>
      )}
    </Flex>
  )
}
