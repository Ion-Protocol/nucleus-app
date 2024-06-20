import { useEffect, useState, useRef } from 'react'
import { useColorMode } from '@chakra-ui/react'
import { getColorFromToken } from '@/styles/theme/helpers/getColorFromToken'

/**
 * Interface representing the position and dimensions of the selected time range element.
 */
interface Position {
  left: number
  width: number
  height: number
}

/**
 * Custom hook to handle the animation and positioning of a motion box within a time range selector.
 * It calculates and sets the position and dimensions of the selected time range element,
 * and provides the necessary information for the motion box animation.
 *
 * @param selectedTimeRange - The currently selected time range.
 * @param timeRanges - Array of available time ranges.
 *
 * @returns - Returns an object containing the following properties:
 * - containerRef: React ref object to be attached to the container element.
 * - selectedPosition: The position and dimensions of the selected time range element.
 * - selectedTimeRangeBackground: The background color for the selected time range element.
 */
export function useAnimatedMotionBox(selectedTimeRange: string, timeRanges: string[]) {
  const [selectedPosition, setSelectedPosition] = useState<Position | null>(null)
  const containerRef = useRef<HTMLDivElement | null>(null)
  const { colorMode } = useColorMode()
  const selectedTimeRangeBackground = getColorFromToken('timeRange.selectedBackground', colorMode)

  useEffect(() => {
    if (containerRef.current) {
      const selectedElement = containerRef.current.querySelector<HTMLDivElement>(
        `[data-time-range="${selectedTimeRange}"]`
      )
      if (selectedElement) {
        const { offsetLeft, offsetWidth, offsetHeight } = selectedElement
        setSelectedPosition({ left: offsetLeft, width: offsetWidth, height: offsetHeight })
      }
    }
  }, [selectedTimeRange, timeRanges])

  return {
    containerRef,
    selectedPosition,
    selectedTimeRangeBackground,
  }
}
