import { Image, ChakraProps, Flex, Text } from '@chakra-ui/react'

interface AnnouncementBannerProps extends ChakraProps {}

const announcement = {
  title: 'Accouncement Banner',
  subtitle: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor.',
}

export function AnnouncementBanner({ ...props }: AnnouncementBannerProps) {
  return (
    <Flex
      h="250px"
      w="100%"
      bgGradient="linear(to-r, #001940, #062857)"
      borderRadius="16px"
      overflow="hidden"
      position="relative"
      {...props}
    >
      <Flex direction="column" px={8} py={6} justify="center">
        <Text textStyle="caption" bg="background" h="fit-content" w="fit-content" py={2} px={3} borderRadius="8px">
          NEW FEATURE
        </Text>
        <Flex h={8} />
        <Flex direction="column" w="45%" minW="650px">
          <Text textStyle="header2" color="primary.500">
            {announcement.title}
          </Text>
          <Text textStyle="header3">{announcement.subtitle}</Text>
        </Flex>
      </Flex>
    </Flex>
  )
}
