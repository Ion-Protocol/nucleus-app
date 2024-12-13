import { Order } from '@/types/Order'
import { capitalizeFirstLetter } from '@/utils/string'
import { Flex } from '@chakra-ui/react'
import { Dot } from 'lucide-react'

interface StatusBadgeProps {
  status: Order['status']
}

export function StatusBadge({ status }: StatusBadgeProps) {
  const colorScheme = {
    pending: 'yellow',
    fulfilled: 'green',
    cancelled: 'red',
  }[status]

  return (
    <Flex alignItems={'center'}>
      <Dot strokeWidth={4} color={colorScheme} />
      {capitalizeFirstLetter(status)}
    </Flex>
  )
}
