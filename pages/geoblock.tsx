import { Image, useColorMode } from '@chakra-ui/react'
import { Flex, Text } from '@chakra-ui/react'

export default function Index({}) {
  const colorMode = useColorMode()
  return (
    <Flex justify="center" mt="150px">
      <Flex direction="column" align="center" justify="center" mt={20} maxW="700px" gap={2}>
        <Image
          src={
            colorMode.colorMode === 'dark' ? '/assets/images/geoblock-dark.png' : '/assets/images/geoblock-light.png'
          }
          alt="Geoblock"
          width="350px"
        />
        <Flex h={6} />
        <Text variant="heading2" lineHeight="1.5">
          Oops this app does not support users from your country. Sorry for the inconvenience!
        </Text>
      </Flex>
    </Flex>
  )
}
