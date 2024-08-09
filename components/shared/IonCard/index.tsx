import { getColorFromToken } from '@/styles/theme/helpers/getColorFromToken'
import { Flex, FlexProps, useColorModeValue } from '@chakra-ui/react'
import { PropsWithChildren } from 'react'

interface IonCardProps extends PropsWithChildren, FlexProps {
  variant?: 'outline' | 'elevate'
}

export function IonCard({ variant = 'outline', children, ...props }: IonCardProps) {
  const shadowColor = useColorModeValue(getColorFromToken('shadow', 'light'), getColorFromToken('shadow', 'dark'))

  switch (variant) {
    case 'outline':
      return (
        <Flex direction="column" borderRadius="8px" p={4} bg="none" border="1px solid" borderColor="border" {...props}>
          {children}
        </Flex>
      )
    case 'elevate':
      return (
        <Flex
          direction="column"
          borderRadius="8px"
          border="none"
          p={4}
          bg="backgroundSecondary"
          boxShadow={`0px 4px 10px 0px ${shadowColor}`}
          {...props}
        >
          {children}
        </Flex>
      )
    default:
      return null
  }
}
