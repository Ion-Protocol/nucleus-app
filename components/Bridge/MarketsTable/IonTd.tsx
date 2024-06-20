import { Text, Flex, Td } from '@chakra-ui/react'
import { PropsWithChildren } from 'react'

interface IonTdProps extends PropsWithChildren {}

export function IonTd({ children }: IonTdProps) {
  return (
    <Td borderColor="border">
      <Text variant="large">{children}</Text>
    </Td>
  )
}
