import { getUserClaimedAmountOfAsset } from '@/api/contracts/MerkleClaim/usersClaimedAmountOfAsset'
import { AnnouncementBanner } from '@/components/AnnouncementBanner'
import NetworkAssetList from '@/components/NetworkAssetList'
import { Button, Flex, Text } from '@chakra-ui/react'

const userAddress = '0x94544835Cf97c631f101c5f538787fE14E2E04f6'
const assetAddress = '0x6DF0E641FC9847c0c6Fde39bE6253045440c14d3'
const merkleClaimAddress = '0x5338Bb21e6d623a0328B26ab5DD3938d646DF2Ba'
const chainId = 308712

export default function Dashboard() {
  async function handleClick() {
    const claimedAmount = await getUserClaimedAmountOfAsset(
      { userAddress, assetAddress },
      { merkleClaimAddress, chainId }
    )
    console.log('🚀 ~ handleClick ~ claimedAmount:', claimedAmount)
  }

  return (
    <Flex p={9} pr={3} direction="column" pb="150px">
      <Button onClick={handleClick}>getUserClaimedAmountOfAsset</Button>
      {/* Page title */}
      <Flex direction="column" gap={1}>
        <Text data-testid="dashboard-title" variant="heading2">
          Dashboard
        </Text>
        <Text variant="smallParagraph">Explore the networks powered by Nucleus.</Text>
      </Flex>

      <Flex h={9} />

      {/* Big announcement banner */}
      <Flex pr={6}>
        <AnnouncementBanner />
      </Flex>

      <Flex h={16} />

      {/* Network asset list */}
      <Text variant="heading2">Select a Network Asset</Text>
      <Flex h={8} />
      <NetworkAssetList />
    </Flex>
  )
}
