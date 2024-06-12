import BridgeTitle from '@/components/Bridge/BridgeTitle'
import { BridgeKey } from '@/config/bridges'
import { Divider, Flex } from '@chakra-ui/react'
import { useRouter } from 'next/router'

export default function Bridge() {
  const router = useRouter()
  const { bridge: bridgeKey } = router.query as { bridge: BridgeKey }

  return (
    <Flex direction="column" borderBottom="1px solid" borderColor="border">
      <Flex direction="column" h="185px">
        <BridgeTitle bridgeKey={bridgeKey} ml={9} mt={9} />
      </Flex>
    </Flex>
  )
}
