import { RootState } from '@/store'
import { NetApyItem } from '@/types/NetApyItem'
import { TimeRange } from '@/types/TimeRange'
import { numToPercent } from '@/utils/number'
import { createSelector } from '@reduxjs/toolkit'
import { subDays, subMonths, subWeeks, subYears } from 'date-fns'

/**
 * Selects the loading state of the netApy slice from the root state.
 * @param state - The root state of the application.
 * @returns A boolean indicating whether the netApy slice is currently loading.
 */
export function selectNetApyLoading(state: RootState): boolean {
  return state.netApy.loading
}

/**
 * Selects the time range from the state.
 *
 * @param state - The root state of the application.
 * @returns The selected time range.
 */
export function selectNetApyTimeRange(state: RootState): TimeRange {
  return state.netApy.timeRange
}

/**
 * Selects the start time from the state based on the selected time range.
 *
 * @param state - The root state of the application.
 * @returns The start time in milliseconds.
 */
export function selectNetApyStartTime(state: RootState): number {
  const timeRange = selectNetApyTimeRange(state)
  let currentTime = new Date()

  // Update to round down currentTime to the nearest 5 minutes.
  // This adjustment enhances the determinism of the selector by extending its stable period,
  // which is crucial for minimizing unnecessary fetching and re-renders.
  let minutes = currentTime.getMinutes()
  minutes = minutes - (minutes % 5) // Adjust minutes to round down to the nearest 5 minutes
  currentTime.setMinutes(minutes, 0, 0) // Set adjusted minutes and round down seconds and milliseconds to 0

  let startTime: Date

  switch (timeRange) {
    case TimeRange.Day:
      startTime = subDays(currentTime, 1)
      break
    case TimeRange.Week:
      startTime = subWeeks(currentTime, 1)
      break
    case TimeRange.Month:
      startTime = subMonths(currentTime, 1)
      break
    case TimeRange.Year:
      startTime = subYears(currentTime, 1)
      break
    case TimeRange.All:
      startTime = new Date(10_000) // Unix epoch (near start of time)
      break
    default:
      throw new Error(`Unsupported time range: ${timeRange}`)
  }

  return startTime.getTime()
}

/**
 * Selects the current end time.
 * This may not be necessary but is included for completeness.
 *
 * @param state - The root state of the application.
 * @returns The current end time as a number.
 */
export function selectNetApyEndTime(state: RootState): number {
  let currentTime = new Date()

  // Update to round down currentTime to the nearest 5 minutes.
  // This adjustment enhances the determinism of the selector by extending its stable period,
  // which is crucial for minimizing unnecessary fetching and re-renders.
  let minutes = currentTime.getMinutes()
  minutes = minutes - (minutes % 5) // Adjust minutes to round down to the nearest 5 minutes
  currentTime.setMinutes(minutes, 0, 0) // Set adjusted minutes and round down seconds and milliseconds to 0

  return currentTime.getTime()
}

/**
 * Selects the net APY history from the Redux state.
 *
 * @param state - The root state of the Redux store.
 * @returns An array of NetApyItem objects representing the net APY history.
 */
export function selectNetApyHistory(state: RootState): NetApyItem[] {
  return state.netApy.history
}

/**
 * Selects the latest net APY (Annual Percentage Yield) from the net APY history.
 *
 * @returns The latest net APY value.
 */
export const selectLatestNetApy = createSelector([selectNetApyHistory], (history): number => {
  if (history.length === 0) {
    return 0
  }
  return history[history.length - 1].netApy
})

/**
 * Selects the latest net APY and formats it as a percentage with one decimal place.
 *
 * @returns The formatted latest net APY.
 */
export const selectFormattedLatestNetApy = createSelector([selectLatestNetApy], (latestNetApy) => {
  const latestNetApyMultBy100 = latestNetApy * 100
  return numToPercent(latestNetApyMultBy100, { fractionDigits: 1 })
})
