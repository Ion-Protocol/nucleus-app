import { MintAndRedeem } from '@/components/NetworkAsset/MintAndRedeem'
import NetworkAssetTitle from '@/components/NetworkAsset/NetworkAssetTitle'
import Apy from '@/components/NetworkAsset/NetworkAssetTitle/Apy'
import RewardsAndPoints from '@/components/NetworkAsset/NetworkAssetTitle/RewardsAndPoints'
import Tvl from '@/components/NetworkAsset/NetworkAssetTitle/Tvl'
import { useAppSelector } from '@/store/hooks'
import { selectNetworkAssetPaused } from '@/store/slices/networkAssets'
import { Flex } from '@chakra-ui/react'
import Paused from './paused'

export default function Token() {
  const isNetworkAssetPaused = useAppSelector(selectNetworkAssetPaused)

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
