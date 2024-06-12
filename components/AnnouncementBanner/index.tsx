import { Image, useColorMode } from '@chakra-ui/react'

export function AnnouncementBanner() {
  const { colorMode } = useColorMode()
  return (
    <Image
      alt="announcement"
      src={
        colorMode === 'light'
          ? '/assets/images/AnnouncementBannerLight.png'
          : '/assets/images/AnnouncementBannerDark.png'
      }
      minW="1300px"
      maxW="1300px"
      alignSelf="center"
    />
  )
}
