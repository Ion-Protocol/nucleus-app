import { Flex } from '@chakra-ui/react'
import { YieldBridgeListConnector } from './connector'
import YieldBridgeItem from './YieldBridgeItem'

function YieldBridgeList({ chainKeys }: YieldBridgeListConnector.Props) {
  return (
    <Flex wrap="wrap" justifyContent="flex-start" alignItems="flex-start" gap={6} w="100%">
      {chainKeys.map((chainKey) => (
        <YieldBridgeItem key={chainKey} chainKey={chainKey} />
      ))}
    </Flex>
  )
}

export default YieldBridgeListConnector.Connector(YieldBridgeList)
