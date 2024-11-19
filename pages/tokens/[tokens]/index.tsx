import { Button, Flex, Heading, Text } from '@chakra-ui/react'

import { useAppSelector } from '@/store/hooks'
import {
  selectContractAddressByName,
  selectNetworkAssetConfig,
  selectNetworkAssetPaused,
} from '@/store/slices/networkAssets'
import { selectNetworkAssetFromRoute } from '@/store/slices/router'
import { useGetRewardsAPYQuery } from '@/store/api/incentivesApi'
import { abbreviateNumber } from '@/utils/number'
import { TokenKey } from '@/types/TokenKey'

import Paused from '@/pages/tokens/[tokens]/paused'
import { MintAndRedeem } from '@/components/NetworkAsset/MintAndRedeem'
import NetworkAssetTitle from '@/components/NetworkAsset/NetworkAssetTitle'
import Apy from '@/components/NetworkAsset/NetworkAssetTitle/Apy'
import RewardsAndPoints from '@/components/NetworkAsset/NetworkAssetTitle/RewardsAndPoints'
import Tvl from '@/components/NetworkAsset/NetworkAssetTitle/Tvl'
import RewardsAndHistory from '@/components/NetworkAsset/RewardsAndHistory'
import { useGetDefaultYieldAPYQuery } from '@/store/api/nucleusBackendApi'
import { Address } from 'viem'

export default function Token() {
  const isNetworkAssetPaused = useAppSelector(selectNetworkAssetPaused)
  const networkAssetConfig = useAppSelector(selectNetworkAssetConfig)
  const networkAssetFromRoute = useAppSelector(selectNetworkAssetFromRoute)
  console.log('networkAssetFromRoute', networkAssetFromRoute)
  const boringVaultAddress = useAppSelector((state) => selectContractAddressByName(state, 'boringVault'))

  console.log('boringVaultAddress', boringVaultAddress)
  const {
    data: rewardsResponse,
    isSuccess: isRewardsAPYSuccess,
    isLoading: isRewardsAPYLoading,
    isError: isRewardsAPYError,
    error: rewardsAPYError,
  } = useGetRewardsAPYQuery(
    { vaultAddress: boringVaultAddress! },
    { skip: !boringVaultAddress || networkAssetFromRoute !== TokenKey.SSETH }
  )
  const { data: boringVaultApy } = useGetDefaultYieldAPYQuery({ tokenAddress: boringVaultAddress as Address })

  const vaultAssetApy = boringVaultApy ? boringVaultApy.apy : 0

  const tvl =
    networkAssetFromRoute !== TokenKey.SSETH && rewardsResponse ? abbreviateNumber(rewardsResponse?.TVL) : undefined
  const apy =
    networkAssetFromRoute === TokenKey.SSETH && rewardsResponse
      ? `${(rewardsResponse?.APY + vaultAssetApy).toFixed(2)}%`
      : `${vaultAssetApy.toFixed(2)}%`

  if (isNetworkAssetPaused) {
    return <Paused />
  }
  return (
    <Flex direction="column" w="100%" align="center">
      <Flex direction="column" h="100%" pt={20}>
        {/* Title & Description */}
        <NetworkAssetTitle />

        {/* Spacer */}
        <Flex h={8} />

        {/* TVL */}
        {isRewardsAPYError && (
          <Flex
            border="1px solid"
            borderColor="border"
            borderRadius="8px"
            bg="error.background"
            py={6}
            px={6}
            direction="column"
            gap={3}
            align="center"
            w="100%"
          >
            <Heading size="md">Check back soon</Heading>
            <Text variant="paragraph" whiteSpace="nowrap">
              We’re in the process of calculating rewards for the next cycle.
            </Text>
            <Text whiteSpace="nowrap">
              We should be done soon but feel free to join our discord to get more active updates.
            </Text>
            <Button colorScheme="blue">Discord</Button>
          </Flex>
        )}
        {(isRewardsAPYSuccess && networkAssetFromRoute === TokenKey.SSETH) ||
        networkAssetFromRoute !== TokenKey.SSETH ? (
          <Flex gap={6}>
            <Tvl tvl={tvl} loading={isRewardsAPYLoading} />
            <Apy apy={apy} loading={isRewardsAPYLoading} />
            <RewardsAndPoints />
          </Flex>
        ) : null}

        {/* Rewards and History */}
        {networkAssetConfig?.showRewardsAndHistory && (
          <>
            <Flex h={8} />
            <RewardsAndHistory />
          </>
        )}

        {/* Spacer */}
        <Flex h={8} />

        {/* Mint and Redeem */}
        <MintAndRedeem />

        {/* Bottom Spacer */}
        <Flex h="100px" />
      </Flex>
    </Flex>
  )
}
