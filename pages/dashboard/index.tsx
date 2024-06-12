import { AnnouncementBanner } from '@/components/AnnouncementBanner'
import { Flex, Spacer, Text } from '@chakra-ui/react'

export default function Dashboard() {
  return (
    <Flex p={6} direction="column">
      {/* Page title */}
      <Flex direction="column" gap={1}>
        <Text textStyle="header1">Dashboard</Text>
        <Text>Lorem ipsum dolor sit amet, consectetur adipiscing.</Text>
      </Flex>

      <Flex h={9} />

      {/* Big announcement banner */}
      <AnnouncementBanner />
    </Flex>
  )
}
