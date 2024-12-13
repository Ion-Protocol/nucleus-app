import { Order } from '@/types/Order'
import { Badge } from '@chakra-ui/react'

interface StatusBadgeProps {
  status: Order['status']
}

export function StatusBadge({ status }: StatusBadgeProps) {
  const colorScheme = {
    pending: 'yellow',
    completed: 'green',
    cancelled: 'red',
  }[status]

  return <Badge colorScheme={colorScheme}>{status}</Badge>
}
