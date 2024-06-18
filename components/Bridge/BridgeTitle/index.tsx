import { BridgeIcon } from '@/components/config/bridgeIcons'
import { Flex, Text } from '@chakra-ui/react'
import { BridgeTitleConnector } from './connector'

function BridgeTitle({ bridgeKey, name, description, ...props }: BridgeTitleConnector.Props) {
  return (
    <Flex direction="column" gap={1} w="600px" maxH="125px" {...props}>
      <Flex align="center" gap={3}>
        <Text variant="header1">Bridge {name}</Text>
        <BridgeIcon bridgeKey={bridgeKey} fontSize="40px" />
      </Flex>
      <Text>{description}</Text>
    </Flex>
  )
}

export default BridgeTitleConnector.Connector(BridgeTitle)
