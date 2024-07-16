import { Flex } from '@chakra-ui/react'
import { YieldBridgeListConnector } from './connector'
import YieldBridgeItem from './YieldBridgeItem'

function YieldBridgeList({ bridgeKeys }: YieldBridgeListConnector.Props) {
  return (
    <Flex wrap="wrap" justifyContent="flex-start" alignItems="flex-start" gap={6} w="100%">
      {bridgeKeys.map((bridgeKey) => (
        <YieldBridgeItem key={bridgeKey} bridgeKey={bridgeKey} />
      ))}
    </Flex>
  )
}

export default YieldBridgeListConnector.Connector(YieldBridgeList)
