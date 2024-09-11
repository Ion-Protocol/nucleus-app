import BridgeTitle from '@/components/Bridge/BridgeTitle'
import Apy from '@/components/Bridge/BridgeTitle/Apy'
import RewardsAndPoints from '@/components/Bridge/BridgeTitle/RewardsAndPoints'
import Tvl from '@/components/Bridge/BridgeTitle/Tvl'
import { MintAndRedeem } from '@/components/Bridge/MintAndRedeem'
import { useAppSelector } from '@/store/hooks'
import { selectChainKeyFromRoute } from '@/store/slices/router'
import { Flex } from '@chakra-ui/react'

export default function Token() {
  // Make sure the router query properly contains the bridge key before loading the bridge page.
  // This should only take one-ish iteration to complete, so there is no visible loading state.
  // Now we can assert that chainKey is not null for every child component.
  const chainKey = useAppSelector(selectChainKeyFromRoute)
  if (chainKey === null) {
    return <></>
  }

  return (
    <Flex direction="column" w="100%" align="center">
      <Flex direction="column" h="100%" pt={20}>
        {/* Title & Description */}
        <BridgeTitle />

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
