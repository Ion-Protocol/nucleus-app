import { BridgeIcon } from '@/components/config/bridgeIcons'
import { IonSkeleton } from '@/components/shared/IonSkeleton'
import { Button, Flex, Text } from '@chakra-ui/react'
import { useRouter } from 'next/router'
import { YieldBridgeItemConnector } from './connector'

function YieldBridgeItem({
  tvl,
  name,
  comingSoon,
  bridgeKey,
  description,
  disabled,
  loading,
}: YieldBridgeItemConnector.Props) {
  const router = useRouter()

  function handleClick() {
    if (!disabled) {
      router.push(`/bridge/${bridgeKey}`)
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
          <Text variant="header3">{name}</Text>
        </Flex>

        {/* Bridge Description */}
        <Text>{description}</Text>

        {!comingSoon ? (
          // Not Coming Soon
          <Flex mt={3} gap={6}>
            {/* TVL */}
            <Flex direction="column">
              <Text>TVL</Text>
              <IonSkeleton isLoaded={!loading} w="100px">
                <Text variant="large">{comingSoon ? '-' : tvl}</Text>
              </IonSkeleton>
            </Flex>
          </Flex>
        ) : (
          // Coming Soon
          <Flex mt={3}>
            <Button pointerEvents="none">
              <Text variant="large">COMING SOON</Text>
            </Button>
          </Flex>
        )}
      </Flex>

      {/* Logo Section */}
      <Flex flex={1} position="relative">
        <BridgeIcon bridgeKey={bridgeKey} fontSize="160px" position="absolute" bottom="-20px" right="-40px" />
      </Flex>
    </Flex>
  )
}

export default YieldBridgeItemConnector.Connector(YieldBridgeItem)
