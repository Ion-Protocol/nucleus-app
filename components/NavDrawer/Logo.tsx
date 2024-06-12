import { Flex, Image, Text } from '@chakra-ui/react'

export function Logo() {
  return (
    <Flex alignItems="center" gap={1}>
      <Image w="48px" h="48px" alt="Ion logo" src="/assets/images/IonLogo.png" />
      <Text fontSize="20px" mt="8px">
        ION PROTOCOL
      </Text>
    </Flex>
  )
}
