import { tokensConfig } from '@/config/tokens'
import { useAppSelector } from '@/store/hooks'
import { selectNetworkAssetFromRoute } from '@/store/slices/router'
import { Flex, Image, Text, useColorMode } from '@chakra-ui/react'

export default function Paused() {
  const { colorMode } = useColorMode()
  const networkAssetKey = useAppSelector(selectNetworkAssetFromRoute)
  const networkAssetFullName = networkAssetKey ? tokensConfig[networkAssetKey].fullName : ''

  return (
    <Flex direction="column" align="center" justify="center" h="80vh">
      <Image
        alt="paused"
        h="325px"
        src={
          colorMode === 'light'
            ? '/assets/images/maintenance-nucleus-icon-light.png'
            : '/assets/images/maintenance-nucleus-icon-dark.png'
        }
      />
      <Text variant="heading2">{networkAssetFullName} is currently under maintenance</Text>
      <Text mt={3} variant="bigParagraph">
        Please check back in at a later time.
      </Text>
    </Flex>
  )
}
