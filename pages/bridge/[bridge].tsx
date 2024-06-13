import { BridgeForm } from '@/components/Bridge/BridgeForm'
import BridgeTitle from '@/components/Bridge/BridgeTitle'
import { BridgeKey } from '@/config/bridges'
import { Flex } from '@chakra-ui/react'
import { useRouter } from 'next/router'

export default function Bridge() {
  const router = useRouter()
  const { bridge: bridgeKey } = router.query as { bridge: BridgeKey }

  return (
    <Flex direction="column">
      {/* Title & Description */}
      <Flex direction="column" h="185px" borderBottom="1px solid" borderColor="border">
        <BridgeTitle bridgeKey={bridgeKey} ml={9} mt={9} />
      </Flex>

      {/* Main Bridge Form */}
      <BridgeForm ml={9} mt={9} />
    </Flex>
  )
}
