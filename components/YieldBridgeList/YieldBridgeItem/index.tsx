import { BridgeUI } from '@/types/Bridge'
import { Flex, Skeleton, Text } from '@chakra-ui/react'
import { YieldBridgeIcon } from './YieldBridgeIcon'
import { useRouter } from 'next/router'

interface YieldBridgeItemProps {
  bridge: BridgeUI
  loading?: boolean
}

export function YieldBridgeItem({ bridge, loading }: YieldBridgeItemProps) {
  const router = useRouter()

  function handleClick() {
    router.push(`/bridge/${bridge.key}`)
  }

  return (
    <Flex
      h="175px"
      border="1px solid"
      borderColor="border"
      w="350px"
      borderRadius="16px"
      overflow="hidden"
      cursor="pointer"
      _hover={{ bg: 'hover' }}
      _active={{ bg: 'active' }}
      onClick={handleClick}
    >
      <Flex w="225px" py={6} pl={6} direction="column" justify="center">
        <Text textStyle="header3">{bridge.name}</Text>
        <Text textStyle="small">{bridge.description}</Text>
        <Flex mt={3} gap={6}>
          <Flex direction="column">
            <Text textStyle="small">TVL</Text>
            <Skeleton isLoaded={!loading} w="95px">
              <Text textStyle="caption">{bridge.tvl.formatted}</Text>
            </Skeleton>
          </Flex>
          <Flex direction="column">
            <Text textStyle="small">APY</Text>
            <Skeleton isLoaded={!loading}>
              <Text textStyle="caption">{bridge.apy.formatted}</Text>
            </Skeleton>
          </Flex>
        </Flex>
      </Flex>
      <Flex flex={1} position="relative">
        <YieldBridgeIcon bridgeKey={bridge.key} fontSize="160px" position="absolute" bottom="-20px" right="-40px" />
      </Flex>
    </Flex>
  )
}
