import { Flex } from '@chakra-ui/react'
import { ChainSelectConnector } from './connector'

function ChainSelect({}: ChainSelectConnector.Props) {
  return <Flex>ChainSelect</Flex>
}

export default ChainSelectConnector.Connector(ChainSelect)
