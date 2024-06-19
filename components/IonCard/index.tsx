import { Box, BoxProps, useColorModeValue } from '@chakra-ui/react'
import { PropsWithChildren } from 'react'

interface IonCardProps extends PropsWithChildren, BoxProps {
  variant?: 'outline' | 'elevate'
}

export function IonCard({ variant = 'outline', children, ...props }: IonCardProps) {
  const shadowColor = useColorModeValue('shadow.light', 'shadow.dark')

  switch (variant) {
    case 'outline':
      return (
        <Box borderRadius="8px" p={4} bg="backgroundSecondary" border="1px solid" borderColor="border" {...props}>
          {children}
        </Box>
      )
    case 'elevate':
      return (
        <Box
          borderRadius="8px"
          border="none"
          p={4}
          bg="backgroundSecondary"
          boxShadow={`0px 4px 10px 0px ${shadowColor}`}
          {...props}
        >
          {children}
        </Box>
      )
    default:
      return null
  }
}
