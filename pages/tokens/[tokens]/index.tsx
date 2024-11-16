import { Button, Flex, Heading, Text } from '@chakra-ui/react'

import { useAppSelector } from '@/store/hooks'
import {
  selectContractAddressByName,
  selectNetworkAssetConfig,
  selectNetworkAssetPaused,
} from '@/store/slices/networkAssets'
import { selectNetworkAssetFromRoute } from '@/store/slices/router'
import { IncentivesResponse, useGetIncentivesAPYQuery } from '@/store/api/incentivesApi'
import { abbreviateNumber } from '@/utils/number'
import { TokenKey } from '@/types/TokenKey'

import Paused from '@/pages/tokens/[tokens]/paused'
import { MintAndRedeem } from '@/components/NetworkAsset/MintAndRedeem'
import NetworkAssetTitle from '@/components/NetworkAsset/NetworkAssetTitle'
import Apy from '@/components/NetworkAsset/NetworkAssetTitle/Apy'
import RewardsAndPoints from '@/components/NetworkAsset/NetworkAssetTitle/RewardsAndPoints'
import Tvl from '@/components/NetworkAsset/NetworkAssetTitle/Tvl'
import RewardsAndHistory from '@/components/NetworkAsset/RewardsAndHistory'

export default function Token() {
  const isNetworkAssetPaused = useAppSelector(selectNetworkAssetPaused)
  const networkAssetConfig = useAppSelector(selectNetworkAssetConfig)
  const networkAssetFromRoute = useAppSelector(selectNetworkAssetFromRoute)
  console.log('networkAssetFromRoute', networkAssetFromRoute)
  const boringVaultAddress = useAppSelector((state) => selectContractAddressByName(state, 'boringVault'))

  console.log('boringVaultAddress', boringVaultAddress)
  const {
    data: incentivesAPY,
    isSuccess: isIncentivesAPYSuccess,
    isLoading: isIncentivesAPYLoading,
    isError: isIncentivesAPYError,
    error: incentivesAPYError,
  } = useGetIncentivesAPYQuery(
    { vaultAddress: boringVaultAddress! },
    { skip: !boringVaultAddress || networkAssetFromRoute !== TokenKey.SSETH }
  )

  console.log(
    'boringVaultAddress',
    boringVaultAddress,
    'networkAssetFromRoute',
    networkAssetFromRoute,
    'incentivesAPY',
    incentivesAPY,
    'isSuccess',
    isIncentivesAPYSuccess,
    'isError',
    isIncentivesAPYError,
    'error',
    incentivesAPYError
  )

  // const mockIncentivesAPYData: IncentivesResponse = {
  //   startDate: '2024-11-15',
  //   endDate: '2024-11-16',
  //   prices: {
  //     '0x5Cf6826140C1C56Ff49C808A1A75407Cd1DF9423': 0.427664,
  //     '0x09D9420332bff75522a45FcFf4855F82a0a3ff50': 0.04196945,
  //   },
  //   tokenIncentives: [
  //     { token_address: '0x5Cf6826140C1C56Ff49C808A1A75407Cd1DF9423', token_amount: 16210 },
  //     { token_address: '0x09D9420332bff75522a45FcFf4855F82a0a3ff50', token_amount: 161000 },
  //   ],
  //   APYPerToken: {
  //     '0x5Cf6826140C1C56Ff49C808A1A75407Cd1DF9423': 15.806487122822526,
  //     '0x09D9420332bff75522a45FcFf4855F82a0a3ff50': 15.406670954966712,
  //   },
  //   APY: 31.21,
  //   TVL: 2280624,
  // }
  // const tvl = abbreviateNumber(mockIncentivesAPYData.TVL)
  // const apy = mockIncentivesAPYData.APY

  const tvl =
    networkAssetFromRoute !== TokenKey.SSETH && incentivesAPY ? abbreviateNumber(incentivesAPY?.TVL) : undefined
  const apy = networkAssetFromRoute === TokenKey.SSETH && incentivesAPY ? incentivesAPY?.APY : undefined

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
        {isIncentivesAPYError && (
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
        {isIncentivesAPYSuccess && (
          <Flex gap={6}>
            <Tvl tvl={tvl} loading={isIncentivesAPYLoading} />
            <Apy apy={apy} loading={isIncentivesAPYLoading} />
            <RewardsAndPoints />
          </Flex>
        )}

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
