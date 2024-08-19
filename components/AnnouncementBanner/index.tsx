import { uiConfig } from '@/config/ui'
import { Flex, Image, Text, useColorMode } from '@chakra-ui/react'

export function AnnouncementBanner() {
  const { colorMode } = useColorMode()

  return (
    <Flex
      w="100%"
      h="200px"
      overflow="hidden"
      borderRadius="16px"
      border="1px solid"
      borderColor="border"
      maxW="1100px"
    >
      <Flex bg="backgroundSecondary" position="relative" justify="space-between" w="100%">
        {/* Left Side */}
        <Flex direction="column" p={6} gap={3} minW="500px" maxW="500px" flex={1}>
          <Flex
            bg="background"
            px={3}
            py={1}
            borderRadius="10px"
            w="fit-content"
            border={colorMode === 'light' ? '1px solid' : 'none'}
            borderColor={colorMode === 'light' ? 'primary' : 'transparent'}
          >
            <Text variant="smallParagraph">{uiConfig.pages.dashboard.announcementTag}</Text>
          </Flex>
          <Text variant="heading2" mt={3}>
            {uiConfig.pages.dashboard.announcementHeader}
          </Text>
          <Text variant="bigParagraph">{uiConfig.pages.dashboard.announcementBody}</Text>
        </Flex>
        <Image
          alt="radar"
          h="200px"
          src={colorMode === 'light' ? '/assets/images/radar-light.png' : '/assets/images/radar-dark.png'}
        />
      </Flex>
    </Flex>
  )
}
