import { getColorFromToken } from '@/styles/theme/helpers/getColorFromToken'
import { Box, useColorMode } from '@chakra-ui/react'

export function GridBackground({ horizontalLines = 5, verticalLines = 15 }) {
  const { colorMode } = useColorMode()
  const gridColor = getColorFromToken('chart.grid', colorMode)
  const horizontalLineSpacing = 100 / horizontalLines
  const verticalLineSpacing = 100 / verticalLines

  const gradientBackground = getColorFromToken('background', colorMode)

  return (
    <>
      <Box
        position="absolute"
        height="100%"
        width="10%"
        background={`linear-gradient(to right, ${gradientBackground}, transparent)`}
        left={0}
        zIndex={2}
        pointerEvents="none"
      />
      <Box
        position="absolute"
        height="100%"
        width="10%"
        background={`linear-gradient(to left, ${gradientBackground}, transparent)`}
        right={0}
        zIndex={2}
        pointerEvents="none"
      />
      <Box
        position="absolute"
        height="10%"
        width="100%"
        background={`linear-gradient(to bottom, ${gradientBackground}, transparent)`}
        top={0}
        zIndex={2}
        pointerEvents="none"
      />
      <Box position="absolute" height="100%" width="100%" zIndex={-1}>
        <svg width="100%" height="100%">
          {/* Horizontal dashed lines */}
          {Array.from({ length: horizontalLines - 1 }).map((_, index) => (
            <line
              key={index}
              x1="0"
              y1={`${horizontalLineSpacing * (index + 1)}%`}
              x2="100%"
              y2={`${horizontalLineSpacing * (index + 1)}%`}
              stroke={gridColor}
              strokeDasharray="4, 4"
            />
          ))}
          {/* Vertical dashed lines */}
          {Array.from({ length: verticalLines - 1 }).map((_, index) => (
            <line
              key={index}
              x1={`${verticalLineSpacing * (index + 1)}%`}
              y1="0"
              x2={`${verticalLineSpacing * (index + 1)}%`}
              y2="100%"
              stroke={gridColor}
              strokeDasharray="4, 4"
            />
          ))}
        </svg>
      </Box>
    </>
  )
}
