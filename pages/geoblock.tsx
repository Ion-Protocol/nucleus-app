import GeoBlock from '@/components/shared/icons/GeoBlock'
import { Flex, Text } from '@chakra-ui/react'

export default function Index({}) {
  return (
    <Flex direction="column" align="center" justify="center" mt={20}>
      <GeoBlock />
      <Flex h={6} />
      <Text variant="large">Oops this app does not support users from your country. Sorry for the inconvenience!</Text>
    </Flex>
  )
}
