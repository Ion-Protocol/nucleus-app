import { BridgeIcon } from '@/components/config/bridgeIcons'
import { IonSkeleton } from '@/components/shared/IonSkeleton'
import { Flex, Text } from '@chakra-ui/react'
import { useRouter } from 'next/router'
import { YieldBridgeItemConnector } from './connector'

function YieldBridgeItem({ bridge, disabled, loading }: YieldBridgeItemConnector.Props) {
  const router = useRouter()

  function handleClick() {
    if (!disabled) {
      router.push(`/bridge/${bridge.key}`)
    }
  }

  return (
    <Flex
      h="175px"
      border="1px solid"
      borderColor="border"
      w="350px"
      borderRadius="16px"
      overflow="hidden"
      cursor={disabled ? 'not-allowed' : 'pointer'}
      _hover={{ bg: disabled ? 'default' : 'hover' }}
      _active={{ bg: disabled ? 'default' : 'active' }}
      onClick={handleClick}
    >
      {/* Text Section */}
      <Flex w="225px" py={6} pl={6} direction="column" justify="center">
        <Flex align="center" gap={3}>
          {/* Bridge Name */}
          <Text variant="header3">{bridge.name}</Text>

          {/* Coming soon marker */}
          {bridge.comingSoon && <Text color="secondaryText">Coming soon</Text>}
        </Flex>

        {/* Bridge Description */}
        <Text>{bridge.description}</Text>

        {/* TVL & APY */}
        <Flex mt={3} gap={6}>
          {/* TVL */}
          <Flex direction="column">
            <Text>TVL</Text>
            <IonSkeleton isLoaded={!loading} w="100px">
              <Text variant="large">{bridge.comingSoon ? '-' : bridge.tvl.formatted}</Text>
            </IonSkeleton>
          </Flex>

          {/* APY */}
          <Flex direction="column">
            <Text>APY</Text>
            <IonSkeleton isLoaded={!loading}>
              <Text variant="large">{bridge.comingSoon ? '-' : bridge.apy.formatted}</Text>
            </IonSkeleton>
          </Flex>
        </Flex>
      </Flex>

      {/* Logo Section */}
      <Flex flex={1} position="relative">
        <BridgeIcon bridgeKey={bridge.key} fontSize="160px" position="absolute" bottom="-20px" right="-40px" />
      </Flex>
    </Flex>
  )
}

export default YieldBridgeItemConnector.Connector(YieldBridgeItem)
