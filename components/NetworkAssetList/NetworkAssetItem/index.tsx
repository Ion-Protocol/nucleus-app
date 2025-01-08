import { Button, Flex, Text } from '@chakra-ui/react'
import { useRouter } from 'next/router'

import { Address } from 'viem'

import { TokenIcon } from '@/components/config/tokenIcons'
import { IonSkeleton } from '@/components/shared/IonSkeleton'
import { IonTooltip } from '@/components/shared/IonTooltip'
import RewardsIconRow from '@/components/shared/RewardsAndPoints/RewardsIconRow'
import RewardsTooltip from '@/components/shared/RewardsAndPoints/RewardsTooltip'
import { hardcodedApy } from '@/config/constants'
import { useGetRewardsAPYQuery } from '@/store/slices/incentivesApi'
import { useGetDefaultYieldAPYQuery } from '@/store/slices/nucleusBackendApi'
import { TokenKey } from '@/types/TokenKey'
import { numberToPercent } from '@/utils/number'
import { ExternalLinkIcon } from '@chakra-ui/icons'
import { YieldBridgeItemConnector } from './connector'

function NetworkAssetItem({
  tvl,
  networkAssetName,
  networkAssetKey,
  boringVaultAddress,
  chainName,
  comingSoon,
  isExternal,
  partnerUrl,
  disabled,
  tvlLoading,
  formattedNetApy,
  fullFormattedNetApy,
  netApyLoading,
  shouldShowMessageForLargeNetApy,
}: YieldBridgeItemConnector.Props) {
  const router = useRouter()
  // Skipping for now to prevent errors
  // TODO: Figure out why this was only called for SSETH
  const { data: rewardsResponse } = useGetRewardsAPYQuery(
    { vaultAddress: boringVaultAddress as Address },
    // { skip: true }
    { skip: !boringVaultAddress || networkAssetKey === TokenKey.SSETH }
  )
  const {
    data: boringVaultApy,
    isLoading: isBoringVaultApyLoading,
    isError: isBoringVaultApyError,
  } = useGetDefaultYieldAPYQuery({ tokenAddress: boringVaultAddress as Address })

  const vaultAssetApy = boringVaultApy ? boringVaultApy.apy : 0
  const totalApy =
    networkAssetKey === TokenKey.SSETH && rewardsResponse ? rewardsResponse?.APY + vaultAssetApy : vaultAssetApy

  function handleClick() {
    if (isExternal) {
      window.open(partnerUrl, '_blank')
    }
    if (!disabled && !isExternal) {
      router.push(`/tokens/${networkAssetName?.toLowerCase()}`)
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
      bg="backgroundSecondary"
      _hover={{
        bg: disabled ? 'default' : 'hover',
      }}
      _active={{ bg: disabled ? 'default' : 'active' }}
      onClick={handleClick}
    >
      {/* Title */}
      <Flex w="225px" direction="column" justify="space-between" pl={6} py={5}>
        {/* Network Asset Name */}
        <Flex align="center" gap={3}>
          <Text variant="bigParagraphBold">{networkAssetName}</Text>
          <Text variant="bigParagraph" color="disabledText">
            {chainName}
          </Text>
          {isExternal && <ExternalLinkIcon color="disabledText" fontSize="16px" />}
        </Flex>

        {!comingSoon ? (
          <>
            <Flex w="138px" justify="space-between">
              {/* TVL */}
              <Flex direction="column">
                <Text variant="smallParagraph">TVL</Text>
                <IonSkeleton isLoaded={!tvlLoading} w="100%">
                  <Text variant="paragraphBold">{tvl}</Text>
                </IonSkeleton>
              </Flex>

              {/* APY */}
              <Flex direction="column">
                <Text variant="smallParagraph">APY</Text>
                <IonSkeleton isLoaded={!isBoringVaultApyLoading}>
                  <IonTooltip
                    label={
                      shouldShowMessageForLargeNetApy ? `${fullFormattedNetApy} will likely decrease...` : undefined
                    }
                  >
                    <Text variant="paragraphBold">{`${totalApy ? numberToPercent(totalApy, 2) : numberToPercent(hardcodedApy, 2)}`}</Text>
                  </IonTooltip>
                </IonSkeleton>
              </Flex>
            </Flex>
            <Flex direction="column" gap={1} w="fit-content">
              {/* Rewards */}
              <Text variant="smallParagraph">Rewards</Text>
              <RewardsTooltip tokenKey={networkAssetKey}>
                <RewardsIconRow w="fit-content" tokenKey={networkAssetKey} />
              </RewardsTooltip>
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
        <TokenIcon tokenKey={networkAssetKey} fontSize="160px" position="absolute" bottom="14px" right="-37px" />
      </Flex>
    </Flex>
  )
}

export default YieldBridgeItemConnector.Connector(NetworkAssetItem)
