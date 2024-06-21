import { Text, Flex, Td, ChakraProps } from '@chakra-ui/react'
import { PropsWithChildren } from 'react'

interface IonTdProps extends PropsWithChildren, ChakraProps {}

export function IonTd({ children, ...props }: IonTdProps) {
  return (
    <Td borderColor="border" {...props}>
      <Text variant="large">{children}</Text>
    </Td>
  )
}
