import { BridgeForm } from '@/components/Bridge/BridgeForm'
import BridgeTitle from '@/components/Bridge/BridgeTitle'
import { useAppSelector } from '@/store/hooks'
import { selectBridgeKey } from '@/store/slices/router'
import { Flex } from '@chakra-ui/react'

export default function Bridge() {
  // Make sure the router query properly contains the bridge key before loading the bridge page.
  // This should only take one-ish iteration to complete, so there is no visible loading state.
  // Now we can assert that bridgeKey is not null for every child component.
  const bridgeKey = useAppSelector(selectBridgeKey)
  if (bridgeKey === null) {
    return <></>
  }

  return (
    <Flex direction="column" h="100%">
      {/* Title & Description */}
      <Flex h="150px" w="100%" borderBottom="1px solid" borderColor="border">
        <BridgeTitle mx={9} />
      </Flex>

      {/* Bottom */}
      <Flex h="100%">
        {/* Left: Main Bridge Form */}
        <BridgeForm px={9} pt={9} w="40%" minW="300px" borderRight="1px solid" borderColor="border" />
      </Flex>
    </Flex>
  )
}
