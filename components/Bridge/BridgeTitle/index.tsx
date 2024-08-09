import { BridgeIcon } from '@/components/config/bridgeIcons'
import { Flex, Text } from '@chakra-ui/react'
import { BridgeTitleConnector } from './connector'

function BridgeTitle({ bridgeKey, name, description, ...props }: BridgeTitleConnector.Props) {
  return (
    <Flex direction="column" align="center" justify="center" w="100%" gap={3} {...props}>
      <Flex align="center" gap={3} justify="center">
        <Text variant="header1">Bridge {name}</Text>
        <BridgeIcon bridgeKey={bridgeKey} fontSize="32px" />
      </Flex>
      <Text>
        Select your deposit asset and select the destination chain that you want to mint the native yield token on.
      </Text>
    </Flex>
  )
}

export default BridgeTitleConnector.Connector(BridgeTitle)
