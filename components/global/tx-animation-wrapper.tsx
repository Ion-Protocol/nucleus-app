import { TokenKey } from '@/types/TokenKey'
import { bigIntToNumber, bigIntToNumberAsString } from '@/utils/bigint'
import { getSymbolByAddress } from '@/utils/withdrawal'
import { AspectRatio, Box, Flex, Grid, Text, useColorMode } from '@chakra-ui/react'
import { DotLottieReact } from '@lottiefiles/dotlottie-react'
import { Address } from 'viem'
import { TokenIcon } from '../config/tokenIcons'

export const TxAnimationWrapper = ({
  loop,
  autoplay,
  isLoading,
  isSuccess,
  isError,
  offerTokenKey,
  offerToken,
  amount,
}: {
  loop: boolean
  autoplay: boolean
  isLoading: boolean
  isSuccess: boolean
  isError: boolean
  offerTokenKey: TokenKey
  offerToken: Address
  amount: string
}) => {
  const { colorMode } = useColorMode()
  const displayThreshold = 0.0001
  const fullAmount = bigIntToNumber(BigInt(amount), { decimals: 18 })
  const displayAmount =
    fullAmount < displayThreshold
      ? '< 0.0001'
      : bigIntToNumberAsString(BigInt(amount), {
          decimals: 18,
          maximumFractionDigits: 4,
        })

  if (isLoading) {
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
              <TokenIcon fontSize="24px" tokenKey={offerTokenKey} />
              <Text fontSize="xl" fontFamily="ppformula">{`${displayAmount} ${getSymbolByAddress(offerToken)}`}</Text>
            </Flex>
          </Box>
        </Grid>
      </Flex>
    )
  }
  if (isSuccess) {
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
  if (isError) {
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
