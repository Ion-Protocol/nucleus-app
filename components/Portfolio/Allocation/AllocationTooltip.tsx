import { Flex } from '@chakra-ui/react'
import { TooltipProps } from 'recharts'
import { OthersTooltipItem } from './OthersTooltipItem'

export interface AllocationDetail {
  asset: string
  network: string
  percentageAllocation: number
}

export function AllocationTooltip(props: TooltipProps<any, any>) {
  const { active, payload, coordinate } = props

  // If tooltip isn't actively hovered or there's no data, don't render
  if (!active || !payload || !payload.length) return null

  // Grab the data for the hovered box
  const hoveredItem = payload[0].payload
  const hoveredItemDetails = hoveredItem.details as AllocationDetail[]

  // Only show tooltip for the "other" box
  if (hoveredItem.asset !== 'other') return null

  // Adjust as needed
  const TOOLTIP_WIDTH = 220
  const OFFSET = 16

  // Position the tooltip to the left of the cursor (to avoid going off screen)
  const left = (coordinate?.x ?? 0) - TOOLTIP_WIDTH - OFFSET
  const top = (coordinate?.y ?? 0) - OFFSET

  return (
    <Flex
      direction="column"
      bg="bg.white"
      border="1px solid"
      borderColor="stroke.darker"
      position="absolute"
      left={left}
      top={top}
      px={4}
      pt={3}
      borderRadius={8}
      pointerEvents="none"
      // Adjust zIndex if it ever appears behind other elements
      zIndex={9999}
    >
      {hoveredItemDetails.map((detail, index) => (
        <OthersTooltipItem key={index} detail={detail} />
      ))}
    </Flex>
  )
}
