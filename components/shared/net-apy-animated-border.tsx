import { Flex, Box, Text, useColorMode, useTheme } from '@chakra-ui/react'
import { TelescopeIcon } from 'lucide-react'
import { css, keyframes } from '@emotion/react'
import { PropsWithChildren } from 'react'
import { numberToPercent } from '@/utils/number'

interface AnimatedBorderProps {
  apy: number
}

// Define the rotation keyframes
const rotate = keyframes`
  0% { transform: rotate(0deg); }
  100% { transform: rotate(-360deg); }
`

export function NetApyAnimatedBorder({ apy }: AnimatedBorderProps) {
  const height = 40
  const borderThickness = 2

  // hardcoded color because the components below cannot read the theme
  const color = '#7D66D9'

  return (
    <Flex position="relative" w="100%">
      <Flex
        zIndex={10}
        position="absolute"
        top={0}
        left={0}
        w="100%"
        h="100%"
        align="center"
        justify="space-between"
        px={2}
      >
        {/* Content */}
        <Flex align="center" gap={1}>
          <TelescopeIcon size="16px" color={color} />
          <Text variant="body-16" color={color}>
            Net APY
          </Text>
        </Flex>
        <Text variant="body-16-m" color={color}>
          {numberToPercent(apy, 2)}
        </Text>
      </Flex>

      {/* Animated border */}
      <Box position="relative" w="100%">
        <Box position="relative" width="100%" height={`${height}px`} overflow="hidden" borderRadius="8px">
          <Box
            position="relative"
            width={`${height * 10}px`}
            height={`${height * 10}px`}
            top="50%"
            left="50%"
            transform="translate(-50%, -50%)"
          >
            {/* Circle container */}
            <Box
              position="absolute"
              top="0"
              left="0"
              width="100%"
              height="100%"
              borderRadius="50%"
              css={css`
                background: conic-gradient(from 0deg, rgba(102, 80, 224), transparent 50%);
              `}
              animation={`${rotate} 3s linear infinite`}
            ></Box>
          </Box>
        </Box>
        <Box
          border="1px solid"
          borderColor="stroke.main"
          position="absolute"
          top={`${borderThickness}px`}
          left={`${borderThickness}px`}
          borderRadius="8px"
          width={`calc(100% - ${borderThickness * 2}px)`}
          height={`calc(100% - ${borderThickness * 2}px)`}
          bg="bg.white"
        />
      </Box>
    </Flex>
  )
}
