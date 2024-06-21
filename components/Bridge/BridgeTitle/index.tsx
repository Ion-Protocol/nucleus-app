import { BridgeIcon } from '@/components/config/bridgeIcons'
import { Flex, Text } from '@chakra-ui/react'
import { BridgeTitleConnector } from './connector'
import Tvl from './Tvl'

function BridgeTitle({ bridgeKey, name, description, ...props }: BridgeTitleConnector.Props) {
  return (
    <Flex align="center" justify="space-between" w="100%" {...props}>
      <Flex direction="column" gap={2} w="700px">
        <Flex align="center" gap={3}>
          <Text variant="header1">Bridge {name}</Text>
          <BridgeIcon bridgeKey={bridgeKey} fontSize="32px" />
        </Flex>
        <Text>{description}</Text>
        <Text>
          Select your deposit asset and select the destination chain that you want to mint the native yield token on.
        </Text>
      </Flex>
      <Tvl />
    </Flex>
  )
}

export default BridgeTitleConnector.Connector(BridgeTitle)
