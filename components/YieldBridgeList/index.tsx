import { Flex } from '@chakra-ui/react'
import { YieldBridgeListConnector } from './connector'
import YieldBridgeItem from './YieldBridgeItem'

function YieldBridgeList({ bridges }: YieldBridgeListConnector.Props) {
  return (
    <Flex wrap="wrap" justifyContent="flex-start" alignItems="flex-start" gap={6} w="100%">
      {bridges.map((bridge, index) => (
        <YieldBridgeItem key={index} bridgeKey={bridge.key} />
      ))}
    </Flex>
  )
}

export default YieldBridgeListConnector.Connector(YieldBridgeList)
