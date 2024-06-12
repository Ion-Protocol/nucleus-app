import { AnnouncementBanner } from '@/components/AnnouncementBanner'
import { Flex, Text, useColorMode } from '@chakra-ui/react'

export default function Dashboard() {
  const { colorMode } = useColorMode()

  return (
    <Flex p={9} direction="column">
      {/* Page title */}
      <Flex direction="column" gap={1}>
        <Text textStyle="header1">Dashboard</Text>
        <Text>Lorem ipsum dolor sit amet, consectetur adipiscing.</Text>
      </Flex>

      <Flex h={9} />

      {/* Big announcement banner */}
      <AnnouncementBanner />

      <Flex h={16} />

      {/* Yield Bridge list */}
      <Text textStyle="header2">Choose Yield Bridge</Text>
    </Flex>
  )
}
