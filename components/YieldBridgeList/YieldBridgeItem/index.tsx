import { TokenIcon } from '@/components/config/tokenIcons'
import { IonSkeleton } from '@/components/shared/IonSkeleton'
import { Button, Flex, Text } from '@chakra-ui/react'
import { useRouter } from 'next/router'
import { YieldBridgeItemConnector } from './connector'

function YieldBridgeItem({
  tvl,
  yieldAssetName,
  yieldAssetKey,
  chainName,
  comingSoon,
  chainKey,
  disabled,
  loading,
}: YieldBridgeItemConnector.Props) {
  const router = useRouter()

  function handleClick() {
    if (!disabled) {
      router.push(`/bridge/${chainKey}`)
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
      transition="transform 0.1s ease, box-shadow 0.1s ease"
      _hover={{
        bg: disabled ? 'default' : 'backgroundSecondary',
        boxShadow: !disabled ? '0 2px 10px rgba(0, 0, 0, 0.1)' : 'none',
        transform: !disabled ? 'translate(1px, -1px)' : 'none',
      }}
      _active={{ bg: disabled ? 'default' : 'active' }}
      onClick={handleClick}
    >
      {/* Text Section */}
      <Flex w="225px" py={6} pl={6} direction="column">
        <Flex align="center" gap={3}>
          {/* Bridge Name */}
          <Text variant="bigParagraphBold">{yieldAssetName}</Text>
          <Text variant="bigParagraph" color="disabledText">
            {chainName}
          </Text>
        </Flex>

        {!comingSoon ? (
          // Not Coming Soon
          <Flex mt={3} gap={6}>
            {/* TVL */}
            <Flex direction="column">
              <Text variant="smallParagraph">TVL</Text>
              <IonSkeleton isLoaded={!loading} w="100px">
                <Text variant="paragraphBold">{comingSoon ? '-' : tvl}</Text>
              </IonSkeleton>
            </Flex>
          </Flex>
        ) : (
          // Coming Soon
          <Flex mt={3}>
            <Button pointerEvents="none">
              <Text variant="button">COMING SOON</Text>
            </Button>
          </Flex>
        )}
      </Flex>

      {/* Logo Section */}
      <Flex flex={1} position="relative">
        <TokenIcon tokenKey={yieldAssetKey} fontSize="160px" position="absolute" bottom="-20px" right="-40px" />
      </Flex>
    </Flex>
  )
}

export default YieldBridgeItemConnector.Connector(YieldBridgeItem)
