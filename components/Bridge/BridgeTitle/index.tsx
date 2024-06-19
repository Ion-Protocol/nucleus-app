import { BridgeIcon } from '@/components/config/bridgeIcons'
import { Flex, Text } from '@chakra-ui/react'
import { BridgeTitleConnector } from './connector'
import Tvl from './Tvl'

function BridgeTitle({ bridgeKey, name, description, ...props }: BridgeTitleConnector.Props) {
  return (
    <Flex align="center" justify="space-between" {...props}>
      <Flex direction="column" gap={2}>
        <Flex align="center" gap={3}>
          <Text variant="header1">Bridge {name}</Text>
          <BridgeIcon bridgeKey={bridgeKey} fontSize="32px" />
        </Flex>
        <Text>{description}</Text>
      </Flex>
      <Tvl />
    </Flex>
  )
}

export default BridgeTitleConnector.Connector(BridgeTitle)
