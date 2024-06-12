import { Flex } from '@chakra-ui/react'
import { YieldBridgeListConnector } from './connector'

function YieldBridgeList({ bridges, loading }: YieldBridgeListConnector.Props) {
  // console.log(bridges)
  console.log(loading)
  return <Flex>Yield Bridge List</Flex>
}

export default YieldBridgeListConnector.Connector(YieldBridgeList)
