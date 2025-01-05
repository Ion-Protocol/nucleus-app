import { AspectRatio, Box, Flex, Grid, Text } from '@chakra-ui/react'
import { DotLottieReact } from '@lottiefiles/dotlottie-react'

export const LottieWrapper = ({ src, loop, autoplay }: { src: string; loop: boolean; autoplay: boolean }) => {
  return (
    <Flex
      direction={'column'}
      border={'1px solid red'}
      h="272px"
      borderRadius={'lg'}
      alignItems={'center'}
      bg="bg.secondary"
    >
      <Grid h="250px" w="250px">
        <AspectRatio ratio={1} gridColumn={'1'} gridRow={'1'}>
          <DotLottieReact src={src} loop={loop} autoplay={autoplay} />
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
