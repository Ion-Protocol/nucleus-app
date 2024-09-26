import { AnnouncementBanner } from '@/components/AnnouncementBanner'
import NetworkAssetList from '@/components/NetworkAssetList'
import { Flex, Text } from '@chakra-ui/react'

export default function Dashboard() {
  return (
    <Flex p={9} pr={3} direction="column" pb="150px">
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
