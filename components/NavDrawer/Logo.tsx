import { Flex, Image, Text } from '@chakra-ui/react'
import { useRouter } from 'next/router'

export function Logo() {
  const router = useRouter()

  function handleClick() {
    router.push('/dashboard')
  }

  return (
    <Flex alignItems="center" gap={1} onClick={handleClick} cursor="pointer">
      <Image w="48px" h="48px" alt="Ion logo" src="/assets/images/IonLogo.png" />
      <Text fontSize="large" mt="8px">
        ION PROTOCOL
      </Text>
    </Flex>
  )
}
