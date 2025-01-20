import { PointSystemIcon } from '@/components/config/pointSystemIcons'
import { TokenIcon } from '@/components/config/tokenIcons'
import { hardcodedApy } from '@/config/constants'
import { NetworkKey, networksConfig } from '@/config/networks'
import { tokensConfig } from '@/config/tokens'
import { useGetDefaultYieldAPYQuery } from '@/store/slices/nucleusBackendApi'
import { TokenKey } from '@/types/TokenKey'
import { numberToPercent } from '@/utils/number'
import { Flex, Text, useColorMode } from '@chakra-ui/react'
import { TelescopeIcon } from 'lucide-react'
import { Address } from 'viem'

interface NetworkAssetTooltipProps {
  networkAssetKey: TokenKey
}

export function NetworkAssetTooltip({ networkAssetKey }: NetworkAssetTooltipProps) {
  const { colorMode } = useColorMode()

  const networkAssetConfig = networksConfig[NetworkKey.MAINNET].assets[networkAssetKey]

  const boringVaultAddress = networkAssetConfig?.contracts.boringVault
  const { data: boringVaultApy } = useGetDefaultYieldAPYQuery({ tokenAddress: boringVaultAddress as Address })
  const vaultAssetApy = boringVaultApy ? boringVaultApy.apy : 0

  return (
    <Flex direction="column" gap={3}>
      {/* Default Yield */}
      <Flex direction="column" gap={1}>
        <Text variant="body-14" color="element.subdued">
          Default Yield
        </Text>
        <Flex border="1px solid" borderColor="stroke.main" borderRadius="8px" p={2} direction="column" gap={2}>
          <Flex align="center" justify="space-between" mt={1}>
            <Flex gap={2}>
              <TokenIcon tokenKey={networkAssetKey} fontSize="20px" />
              <Text variant="body-14" color="element.subdued">
                {tokensConfig[networkAssetKey].name}
              </Text>
            </Flex>
            <Text variant="body-14" color="element.violet">
              {vaultAssetApy ? numberToPercent(vaultAssetApy, 2) : numberToPercent(hardcodedApy, 2)}
            </Text>
          </Flex>
        </Flex>
      </Flex>

      {/* Multipliers */}
      <Flex direction="column" gap={1}>
        <Text variant="body-14" color="element.subdued">
          Multipliers
        </Text>
        <Flex border="1px solid" borderColor="stroke.main" borderRadius="8px" p={2} direction="column" gap={2}>
          {networkAssetConfig?.points.map((pointsItem) => (
            <Flex key={pointsItem.key} align="center" justify="space-between">
              <Flex gap={1} align="center">
                {colorMode === 'dark' ? (
                  <Flex bg="element.main" border="1px solid" borderColor="stroke.main" borderRadius="50px" p={1}>
                    <PointSystemIcon pointSystemKey={pointsItem.key} fontSize={16} />
                  </Flex>
                ) : (
                  <PointSystemIcon pointSystemKey={pointsItem.key} fontSize={16} />
                )}
                <Text variant="body-14" color="element.subdued">
                  {pointsItem.name}
                </Text>
              </Flex>
              <Text variant="body-14" color="element.violet">
                {pointsItem.pointsMultiplier}x
              </Text>
            </Flex>
          ))}
        </Flex>
      </Flex>

      {/* Net APY */}
      <Flex
        border="1px solid"
        borderColor="stroke.main"
        borderRadius="8px"
        p={2}
        color="element.violet"
        justify="space-between"
      >
        <Flex align="center" gap={1}>
          <TelescopeIcon />
          <Text variant="body-16">Net APY</Text>
        </Flex>
        <Text variant="body-16">
          {vaultAssetApy ? numberToPercent(vaultAssetApy, 2) : numberToPercent(hardcodedApy, 2)}
        </Text>
      </Flex>
    </Flex>
  )
}
