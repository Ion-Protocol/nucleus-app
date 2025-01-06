import { Button, Flex, Heading, Image, Text } from '@chakra-ui/react'

import { discordUrl, hardcodedApy } from '@/config/constants'
import { useAppSelector } from '@/store/hooks'
import { useGetRewardsAPYQuery } from '@/store/slices/incentivesApi'
import {
  selectContractAddressByName,
  selectNetworkAssetConfig,
  selectNetworkAssetPaused,
} from '@/store/slices/networkAssets'
import { selectNetworkAssetFromRoute } from '@/store/slices/router'
import { TokenKey } from '@/types/TokenKey'
import { abbreviateNumber } from '@/utils/number'
import { useColorMode } from '@chakra-ui/react'

import { MintAndRedeem } from '@/components/NetworkAsset/MintAndRedeem'
import NetworkAssetTitle from '@/components/NetworkAsset/NetworkAssetTitle'
import Apy from '@/components/NetworkAsset/NetworkAssetTitle/Apy'
import RewardsAndPoints from '@/components/NetworkAsset/NetworkAssetTitle/RewardsAndPoints'
import Tvl from '@/components/NetworkAsset/NetworkAssetTitle/Tvl'
import RewardsAndHistory from '@/components/NetworkAsset/RewardsAndHistory'
import Paused from '@/pages/tokens/[tokens]/paused'
import { useGetDefaultYieldAPYQuery } from '@/store/slices/nucleusBackendApi'
import { Address } from 'viem'

export default function Token() {
  const { colorMode } = useColorMode()
  const isNetworkAssetPaused = useAppSelector(selectNetworkAssetPaused)
  const networkAssetConfig = useAppSelector(selectNetworkAssetConfig)
  const networkAssetFromRoute = useAppSelector(selectNetworkAssetFromRoute)
  const boringVaultAddress = useAppSelector((state) => selectContractAddressByName(state, 'boringVault'))

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

  const vaultAssetApy = boringVaultApy?.apy ? boringVaultApy.apy : hardcodedApy

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
        <Flex gap={6}>
          <Tvl />
          <Apy apy={apy} loading={isRewardsAPYLoading} />
          <RewardsAndPoints />
        </Flex>

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
