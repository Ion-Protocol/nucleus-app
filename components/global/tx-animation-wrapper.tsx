import { TokenKey } from '@/types/TokenKey'
import { AspectRatio, Box, Flex, Grid, Text, useColorMode } from '@chakra-ui/react'
import { DotLottieReact } from '@lottiefiles/dotlottie-react'

export const TxAnimationWrapper = ({
  loop,
  autoplay,
  status,
  tokenKey,
  amount,
}: {
  loop: boolean
  autoplay: boolean
  status: 'loading' | 'success' | 'error'
  tokenKey?: TokenKey
  amount?: string
}) => {
  const { colorMode } = useColorMode()
  if (status === 'loading') {
    return (
      <Flex
        direction={'column'}
        border={'1px solid'}
        borderColor={'stroke.darker'}
        h="272px"
        borderRadius={'lg'}
        alignItems={'center'}
        bg="bg.secondary"
      >
        <Grid h="250px" w="250px">
          <AspectRatio ratio={1} gridColumn={'1'} gridRow={'1'}>
            <DotLottieReact
              src={
                colorMode === 'light' ? '/assets/animations/loading-light.json' : '/assets/animations/loading-dark.json'
              }
              loop={loop}
              autoplay={autoplay}
            />
          </AspectRatio>
          <Box gridColumn={'1'} gridRow={'1'} placeContent="end" zIndex={'1'}>
            <Flex alignItems="center" justifyContent="center" gap="2">
              <Text fontSize={'sm'} fontWeight={'medium'}>
                0.02 ssETH
              </Text>
            </Flex>
          </Box>
        </Grid>
      </Flex>
    )
  }
  if (status === 'success') {
    return (
      <Flex
        direction={'column'}
        border={'1px solid'}
        borderColor={'stroke.darker'}
        h="216px"
        borderRadius={'lg'}
        alignItems={'center'}
        bg="bg.secondary"
        overflow="hidden"
      >
        <Grid h="220px" w="220px">
          <AspectRatio ratio={1} gridColumn={'1'} gridRow={'1'}>
            <DotLottieReact
              src={
                colorMode === 'light' ? '/assets/animations/success-light.json' : '/assets/animations/success-dark.json'
              }
              loop={loop}
              autoplay={autoplay}
            />
          </AspectRatio>
        </Grid>
      </Flex>
    )
  }
  if (status === 'error') {
    return (
      <Flex
        direction={'column'}
        border={'1px solid'}
        borderColor={'stroke.darker'}
        h="216px"
        borderRadius={'lg'}
        alignItems={'center'}
        bg="bg.secondary"
        overflow="hidden"
      >
        <Grid h="220px" w="220px">
          <AspectRatio ratio={1} gridColumn={'1'} gridRow={'1'}>
            <DotLottieReact
              src={colorMode === 'light' ? '/assets/animations/error-light.json' : '/assets/animations/error-dark.json'}
              loop={loop}
              autoplay={autoplay}
            />
          </AspectRatio>
        </Grid>
      </Flex>
    )
  }
  return null
}
