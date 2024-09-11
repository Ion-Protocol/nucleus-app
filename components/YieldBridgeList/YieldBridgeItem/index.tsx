import { TokenIcon } from '@/components/config/tokenIcons'
import { IonSkeleton } from '@/components/shared/IonSkeleton'
import RewardsIconRow from '@/components/shared/RewardsIconRow'
import { Button, Flex, Text } from '@chakra-ui/react'
import { useRouter } from 'next/router'
import { YieldBridgeItemConnector } from './connector'
import { uiConfig } from '@/config/ui'
import { hardcodedApy } from '@/config/constants'

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
      router.push(`/tokens/${yieldAssetKey}`)
    }
  }

  return (
    <Flex
      h="190px"
      border="1px solid"
      borderColor="border"
      w="330px"
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
      <Flex w="225px" direction="column" justify="space-between" pl={6} py={5}>
        {/* Bridge Name */}
        <Flex align="center" gap={3}>
          <Text variant="bigParagraphBold">{yieldAssetName}</Text>
          <Text variant="bigParagraph" color="disabledText">
            {chainName}
          </Text>
        </Flex>

        {!comingSoon ? (
          <>
            <Flex>
              {/* TVL */}
              <Flex direction="column">
                <Text variant="smallParagraph">TVL</Text>
                <IonSkeleton isLoaded={!loading} w="100px">
                  <Text variant="paragraphBold">{tvl}</Text>
                </IonSkeleton>
              </Flex>

              {/* APY */}
              <Flex direction="column">
                <Text variant="smallParagraph">APY</Text>
                <Text variant="paragraphBold">{hardcodedApy}</Text>
              </Flex>
            </Flex>

            {/* Rewards */}
            <Flex direction="column" gap={1}>
              <Text variant="smallParagraph">Rewards</Text>
              <RewardsIconRow w="fit-content" chainKey={chainKey} />
            </Flex>
          </>
        ) : (
          <Flex mb={6}>
            <Button pointerEvents="none">
              <Text variant="button">COMING SOON</Text>
            </Button>
          </Flex>
        )}
      </Flex>

      {/* Logo Section */}
      <Flex flex={1} position="relative">
        <TokenIcon tokenKey={yieldAssetKey} fontSize="160px" position="absolute" bottom="14px" right="-37px" />
      </Flex>
    </Flex>
  )
}

export default YieldBridgeItemConnector.Connector(YieldBridgeItem)
