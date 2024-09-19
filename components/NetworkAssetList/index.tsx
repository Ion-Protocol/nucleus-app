import { Flex } from '@chakra-ui/react'
import { NetworkAssetListConnector } from './connector'
import NetworkAssetItem from './NetworkAssetItem'

function NetworkAssetList({ networkAssetKeys }: NetworkAssetListConnector.Props) {
  return (
    <Flex wrap="wrap" justifyContent="flex-start" alignItems="flex-start" gap={6} w="100%">
      {networkAssetKeys.map((tokenKey) => (
        <NetworkAssetItem key={tokenKey} networkAssetKey={tokenKey} />
      ))}
    </Flex>
  )
}

export default NetworkAssetListConnector.Connector(NetworkAssetList)
