import { Button, chakra, Flex, Text } from '@chakra-ui/react'
import { useRouter } from 'next/router'

import { Address } from 'viem'

import { ChainIcon } from '@/components/config/chainIcons'
import { TokenIcon } from '@/components/config/tokenIcons'
import { AtomTag } from '@/components/shared/AtomTag'
import { ChainIconRow } from '@/components/shared/chain-icon-row'
import { IconWithSubIcon } from '@/components/shared/icon-with-sub-icon'
import { MintIcon } from '@/components/shared/icons/Mint'
import { hardcodedApy } from '@/config/constants'
import { NetworkKey, networksConfig } from '@/config/networks'
import { useGetRewardsAPYQuery } from '@/store/slices/incentivesApi'
import { useGetDefaultYieldAPYQuery } from '@/store/slices/nucleusBackendApi'
import { TokenKey } from '@/types/TokenKey'
import { numberToPercent } from '@/utils/number'
import { ArrowUpRightIcon as LucideArrowUpRightIcon } from 'lucide-react'
import { YieldBridgeItemConnector } from './connector'
import { NetworkAssetTooltip } from './network-asset-tooltip'

// The icon needs to be wrapped in chakra to get the correct styles.
// Otherwise the custom color will not be applied.
const ArrowUpRightIcon = chakra(LucideArrowUpRightIcon)

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
  netApyLoading,
  shouldShowMessageForLargeNetApy,
  chainKey,
  protocols,
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
    isLoading,
    isError: isBoringVaultApyError,
  } = useGetDefaultYieldAPYQuery({ tokenAddress: boringVaultAddress as Address })

  const vaultAssetApy = boringVaultApy ? boringVaultApy.apy : 0
  const totalApy =
    networkAssetKey === TokenKey.SSETH && rewardsResponse ? rewardsResponse?.APY + vaultAssetApy : vaultAssetApy

  const networkAssetCount = networksConfig[NetworkKey.MAINNET].assets[networkAssetKey]?.points.length

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
      direction="column"
      p={6}
      w="370px"
      h="310px"
      gap={6}
      border="1px solid"
      borderColor="stroke.light"
      borderRadius="16px"
      overflow="hidden"
      cursor={disabled ? 'not-allowed' : 'pointer'}
      bg="bg.white"
      _hover={{
        bg: 'bg.main',
      }}
      onClick={handleClick}
    >
      {/* Top Row */}
      <Flex justify="space-between" w="100%">
        {/* Asset */}
        <Flex gap={4}>
          <IconWithSubIcon
            icon={<TokenIcon fontSize="48px" tokenKey={networkAssetKey} />}
            subIcon={<ChainIcon chainKey={chainKey} />}
          />
          <Flex direction="column">
            <Text variant="body-20-m">{networkAssetName}</Text>
            <Text variant="body-16" color="element.subdued" mt="-4px">
              {chainName}
            </Text>
          </Flex>
        </Flex>
        {isExternal && <ArrowUpRightIcon fontSize="24px" color="element.subdued" />}
      </Flex>

      {/* Body */}
      <Flex direction="column" gap={3}>
        {/* TVL */}
        <Flex justify="space-between" w="100%">
          <Text variant="body-16" color="element.subdued">
            TVL
          </Text>
          <Flex flex="1" borderBottom="1px dashed" borderColor="stroke.main" mx={2} mb="0.4em" />
          <Text variant="body-16" color="element.main">
            {tvl}
          </Text>
        </Flex>

        {/* APY */}
        <Flex justify="space-between" w="100%">
          <Text variant="body-16" color="element.subdued">
            APY
          </Text>
          <Flex flex="1" borderBottom="1px dashed" borderColor="stroke.main" mx={2} mb="0.4em" />
          <Text variant="body-16" color="element.main">
            {networkAssetKey === TokenKey.EARNBTC
              ? 'N/A'
              : totalApy
                ? numberToPercent(totalApy, 2)
                : numberToPercent(hardcodedApy, 2)}
          </Text>
        </Flex>

        {/* Benefits */}
        <Flex justify="space-between" w="100%">
          <Text variant="body-16" color="element.subdued">
            Benefits
          </Text>
          <Flex flex="1" borderBottom="1px dashed" borderColor="stroke.main" mx={2} mb="0.4em" />
          <AtomTag tooltip={<NetworkAssetTooltip networkAssetKey={networkAssetKey} />}>
            {networkAssetCount && networkAssetCount > 1
              ? `${networkAssetCount} Rewards`
              : `${networkAssetCount === 1 ? '1 Reward' : '0 Rewards'}`}
          </AtomTag>
        </Flex>

        {/* Protocols */}
        <Flex justify="space-between" w="100%">
          <Text variant="body-16" color="element.subdued">
            Protocols
          </Text>
          <Flex flex="1" borderBottom="1px dashed" borderColor="stroke.main" mx={2} mb="0.4em" />
          <ChainIconRow chains={protocols} />
        </Flex>
      </Flex>
      {/* Button */}
      <Button onClick={handleClick} variant="outline" leftIcon={<MintIcon pb="1px" />}>
        <Text variant="body-16">Mint</Text>
      </Button>
    </Flex>
  )
}

export default YieldBridgeItemConnector.Connector(NetworkAssetItem)
