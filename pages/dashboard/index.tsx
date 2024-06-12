import { AnnouncementBanner } from '@/components/AnnouncementBanner'
import YieldBridgeList from '@/components/YieldBridgeList'
import { Flex, Text } from '@chakra-ui/react'

export default function Dashboard() {
  return (
    <Flex p={9} pr={3} direction="column">
      {/* Page title */}
      <Flex direction="column" gap={1}>
        <Text textStyle="header1">Dashboard</Text>
        <Text>Lorem ipsum dolor sit amet, consectetur adipiscing.</Text>
      </Flex>

      <Flex h={9} />

      {/* Big announcement banner */}
      <Flex pr={6}>
        <AnnouncementBanner />
      </Flex>

      <Flex h={16} />

      {/* Yield Bridge list */}
      <Text textStyle="header2">Choose Yield Bridge</Text>
      <Flex h={8} />
      <YieldBridgeList />
    </Flex>
  )
}
