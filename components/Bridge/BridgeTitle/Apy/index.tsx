import { hardcodedApy } from '@/config/constants'
import { uiConfig } from '@/config/ui'
import { Flex, Text } from '@chakra-ui/react'

function Apy() {
  return (
    <Flex
      border="1px solid"
      borderColor="border"
      borderRadius="8px"
      py={6}
      px={6}
      direction="column"
      gap={3}
      align="center"
      w="100%"
    >
      <Text variant="paragraph">APY</Text>
      <Text variant="bigNumbers">{hardcodedApy}</Text>
    </Flex>
  )
}

export default Apy
