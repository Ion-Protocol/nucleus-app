import { MintAndRedeem } from '@/components/NetworkAsset/MintAndRedeem'
import NetworkAssetTitle from '@/components/NetworkAsset/NetworkAssetTitle'
import Apy from '@/components/NetworkAsset/NetworkAssetTitle/Apy'
import RewardsAndPoints from '@/components/NetworkAsset/NetworkAssetTitle/RewardsAndPoints'
import Tvl from '@/components/NetworkAsset/NetworkAssetTitle/Tvl'
import { useAppSelector } from '@/store/hooks'
import { selectNetworkAssetFromRoute } from '@/store/slices/router'
import { Flex } from '@chakra-ui/react'

export default function Token() {
  // Make sure the router query properly contains the network asset key before loading the network asset page.
  // This should only take one-ish iteration to complete, so there is no visible loading state.
  // Now we can assert that chainKey is not null for every child component.
  const chainKey = useAppSelector(selectNetworkAssetFromRoute)
  if (chainKey === null) {
    return <></>
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
          <Apy />
          <RewardsAndPoints />
        </Flex>

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
