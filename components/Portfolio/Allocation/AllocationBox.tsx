import { chainIconMap } from '@/components/config/chainIcons'
import { tokenIconMap } from '@/components/config/tokenIcons'
import { chainsConfig } from '@/config/chains'
import { tokensConfig } from '@/config/tokens'
import { useAppSelector } from '@/store/hooks'
import { AllocationFilter } from '@/store/slices/portfolio'
import { selectAllocationFilter } from '@/store/slices/portfolio/selectors'
import { ChainKey } from '@/types/ChainKey'
import { TokenKey } from '@/types/TokenKey'
import { abbreviateNumber } from '@/utils/number'
import { Flex, Skeleton, SkeletonCircle, Text, Tooltip, useColorMode, useTheme } from '@chakra-ui/react'
import React from 'react'
import { OthersTooltipItem } from './OthersTooltipItem'

export function AllocationBox(props: any) {
  const {
    x,
    y,
    width,
    height,
    depth,
    asset,
    network: networkName,
    percentageAllocation,
    usdValue,
    details,
    isLoading,
  } = props

  // Hooks
  const { colorMode } = useColorMode()
  const theme = useTheme()
  const allocationFilter = useAppSelector(selectAllocationFilter)

  // Skip rendering the root node (depth 0)
  if (depth === 0) {
    return null
  }

  const colors = theme.semanticTokens.colors
  const strokeColor = colorMode === 'dark' ? '#38332e' : '#e5dbc8'
  const backgroundColor = colorMode === 'dark' ? '#1c1a17' : '#fffdfa'

  const token = tokensConfig[asset as TokenKey]
  const chain = chainsConfig[networkName as ChainKey]
  let name = ''
  if (allocationFilter === AllocationFilter.Network) {
    name = chain?.name
  } else if (allocationFilter === AllocationFilter.AssetType) {
    name = token?.name
  }

  if (asset === 'other') {
    name = 'Others'
  }

  // Adjust dimensions for spacing
  const boxSpacing = 12
  const adjustedX = x + boxSpacing / 2
  const adjustedY = y + boxSpacing / 2
  const adjustedWidth = width - boxSpacing
  const adjustedHeight = height - boxSpacing

  // Determine the icon based on the filter
  let icon = null
  if (allocationFilter === AllocationFilter.Network) {
    icon = chainIconMap[networkName as ChainKey]
  } else if (allocationFilter === AllocationFilter.AssetType) {
    icon = tokenIconMap[asset as TokenKey]
  }

  const fullName = allocationFilter === AllocationFilter.AssetType ? token?.fullName : ''

  const threshold = 100

  let boxSizeCategory = 'small'
  if (width < threshold && height > threshold) {
    boxSizeCategory = 'thin'
  } else if (height < threshold && width > threshold) {
    boxSizeCategory = 'short'
  } else if (width < threshold && height < threshold) {
    boxSizeCategory = 'small'
  } else {
    boxSizeCategory = 'large'
  }

  const formattedPercentAllocation = percentageAllocation > 1 ? `${percentageAllocation.toFixed(0)}%` : '<1%'

  return (
    <Tooltip
      placement="top-start"
      hidden={asset !== 'other'}
      label={
        asset === 'other' ? (
          <Flex
            direction="column"
            px={4}
            pt={3}
            bg="bg.white"
            border="1px solid"
            borderColor="stroke.darker"
            borderRadius={8}
          >
            {details?.map((detail: any, index: number) => <OthersTooltipItem key={index} detail={detail} />)}
          </Flex>
        ) : (
          <Flex
            direction="column"
            px={4}
            pt={3}
            bg="bg.white"
            border="1px solid"
            borderColor="stroke.darker"
            borderRadius={8}
          >
            <Text variant="body-16">{name}</Text>
            <Text variant="body-14" color="element.subdued">
              {formattedPercentAllocation}
            </Text>
          </Flex>
        )
      }
      bg="transparent" // Ensure tooltip matches design
    >
      <g>
        {/* Rectangle with border radius and spacing */}
        <rect
          x={adjustedX}
          y={adjustedY}
          width={adjustedWidth > 0 ? adjustedWidth : 0} // Ensure width is non-negative
          height={adjustedHeight > 0 ? adjustedHeight : 0} // Ensure height is non-negative
          fill={backgroundColor}
          stroke={strokeColor}
          strokeWidth={1}
          rx={8} // Border radius
          ry={8} // Border radius
        />
        {/* Name and Icon */}
        {adjustedWidth > 20 && adjustedHeight > 20 && (
          <foreignObject x={adjustedX} y={adjustedY} width={adjustedWidth} height={adjustedHeight}>
            <Flex
              p={4}
              flexDirection={boxSizeCategory === 'short' ? 'row' : 'column'}
              h="100%"
              w="100%"
              align={boxSizeCategory === 'short' ? 'center' : 'flex-start'}
            >
              {!isLoading ? (
                <>
                  {icon && asset !== 'other' && (
                    <Flex mb={2} mr={2}>
                      {React.createElement(icon, { fontSize: 32 })}
                    </Flex>
                  )}

                  <Flex
                    flexDirection={boxSizeCategory === 'short' ? 'row' : 'column'}
                    h="100%"
                    w="100%"
                    align={boxSizeCategory === 'short' ? 'center' : 'flex-start'}
                  >
                    {/* Name and Full Name */}
                    <Flex direction="column" flex="1 1 auto" minW="0">
                      {(boxSizeCategory !== 'thin' || asset === 'other') && (
                        <Text variant="body-16" color="element.main">
                          {name}
                        </Text>
                      )}
                      {fullName && boxSizeCategory === 'large' && (
                        <Text variant="body-14" color="element.subdued">
                          {fullName}
                        </Text>
                      )}
                    </Flex>

                    <Flex align="center">
                      <Text variant="body-16" color="element.main" mr={2}>
                        {formattedPercentAllocation}
                      </Text>
                      {(boxSizeCategory === 'large' || boxSizeCategory === 'short') && (
                        <Text variant="body-14" color="element.subdued">
                          {abbreviateNumber(usdValue)}
                        </Text>
                      )}
                    </Flex>
                  </Flex>
                </>
              ) : (
                <Flex direction="column" gap={2}>
                  <SkeletonCircle size="28px" startColor="element.invert.secondary" endColor="element.invert.primary" />
                  <Skeleton
                    w="60px"
                    h="14px"
                    startColor="element.invert.secondary"
                    endColor="element.invert.primary"
                    borderRadius="8px"
                  />
                  <Skeleton
                    w="100px"
                    h="14px"
                    startColor="element.invert.secondary"
                    endColor="element.invert.primary"
                    borderRadius="8px"
                  />
                </Flex>
              )}
              {/* Render the icon if it exists */}
            </Flex>
          </foreignObject>
        )}
      </g>
    </Tooltip>
  )
}
