import React, { useState, useEffect, useRef } from 'react'
import { Box, Image, useColorMode } from '@chakra-ui/react'

export function AnnouncementBanner() {
  const { colorMode } = useColorMode()
  const [imageHeight, setImageHeight] = useState<number | null>(null)
  const imageRef = useRef<HTMLImageElement>(null)

  useEffect(() => {
    if (imageRef.current) {
      setImageHeight(imageRef.current.clientHeight)
    }
  }, [colorMode])

  return (
    <Box
      w="100%"
      height={imageHeight ? `${imageHeight}px` : 'auto'}
      overflowX="hidden"
      display="flex"
      position="relative"
      borderRadius="16px"
    >
      <Image
        ref={imageRef}
        position="absolute"
        top="0px"
        left="0px"
        minW="1100px"
        maxW="1100px"
        alt="announcement"
        src={
          colorMode === 'light'
            ? '/assets/images/AnnouncementBannerLight.png'
            : '/assets/images/AnnouncementBannerDark.png'
        }
        onLoad={() => {
          if (imageRef.current) {
            setImageHeight(imageRef.current.clientHeight)
          }
        }}
      />
    </Box>
  )
}
