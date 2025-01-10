import { Order } from '@/types/Order'
import { capitalizeFirstLetter } from '@/utils/string'
import { Flex, Icon, Text } from '@chakra-ui/react'
import { Dot } from 'lucide-react'

interface StatusBadgeProps {
  status: Order['status']
}

export function StatusBadge({ status }: StatusBadgeProps) {
  const colorScheme = {
    pending: 'thermic.400',
    fulfilled: 'olivenite.400',
    cancelled: 'button.error.bg',
    expired: 'stroke.darker',
  }[status]

  return (
    <Flex alignItems={'center'}>
      <Icon as={Dot} boxSize={6} strokeWidth={6} color={colorScheme} />
      <Text fontSize={'inherit'}>{capitalizeFirstLetter(status)}</Text>
    </Flex>
  )
}
