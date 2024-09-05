import { ChainIcon } from '@/components/config/chainIcons'
import { Flex, Text } from '@chakra-ui/react'
import { BridgeTitleConnector } from './connector'

function BridgeTitle({ chainKey: chainKey, name, description, ...props }: BridgeTitleConnector.Props) {
  return (
    <Flex direction="column" align="center" justify="center" w="100%" gap={2} {...props}>
      <Flex align="center" gap={3} justify="center">
        <Text variant="heading2">Bridge {name}</Text>
        <ChainIcon chainKey={chainKey} fontSize="32px" />
      </Flex>
      <Text variant="smallParagraph">
        Select your deposit asset and select the destination chain that you want to mint the native yield token on.
      </Text>
    </Flex>
  )
}

export default BridgeTitleConnector.Connector(BridgeTitle)
