import { RootState } from '@/store'
import { NetApyItem } from '@/types/NetApyItem'
import { TimeRange } from '@/types/TimeRange'
import { formatTimestamps } from '@/utils/date'
import { generateEvenlySpacedFloats, generateEvenlySpacedIntegers, numToPercent } from '@/utils/number'
import { createSelector } from '@reduxjs/toolkit'
import { subDays, subMonths, subWeeks, subYears } from 'date-fns'
import { getTimeRangeDates } from './helpers/getTimeRangeDates'

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
 * Selects the net APY data based on the selected time range from the Redux state.
 *
 * @param state - The root state of the application.
 * @param timeRange - The selected time range.
 * @returns An array of NetApyItem objects representing the net APY within the selected time range.
 */
export const selectNetApyByTimeRange = createSelector(
  [selectNetApyTimeRange, selectNetApyHistory],
  (timeRange, history) => {
    let currentTime = new Date()

    // Round down currentTime to the nearest 5 minutes.
    let minutes = currentTime.getMinutes()
    minutes = minutes - (minutes % 5) // Adjust minutes to round down to the nearest 5 minutes
    currentTime.setMinutes(minutes, 0, 0) // Set adjusted minutes and round down seconds and milliseconds to 0

    let startTime: Date

    switch (timeRange) {
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

    return history.filter((item) => item.timeStamp >= startTime.getTime())
  }
)

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

export const selectNetApyHistoryWithIndexes = createSelector([selectNetApyByTimeRange], (history): NetApyItem[] => {
  return history.map((item, index) => ({ ...item, index }))
})

/**
 * Selects the latest net APY (Annual Percentage Yield) from the net APY history.
 *
 * @returns The latest net APY value.
 */
export const selectLatestNetApy = createSelector([selectNetApyByTimeRange], (history): number => {
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

/**
 * Memoized selector that selects the maximum net APY (Annual Percentage Yield) from the net APY history.
 * If the history is empty, returns 0.
 *
 * @returns The maximum net APY value.
 */
export const selectMaxNetApy = createSelector([selectNetApyByTimeRange], (history): number => {
  if (history.length === 0) {
    return 0
  }
  return Math.max(...history.map((item) => item.netApy))
})

/**
 * Memoized selector that selects evenly spaced x ticks based on the net APY history length.
 * X axis is built on the indexes of the net APY history.
 *
 * @returns An array of evenly spaced x ticks.
 */
export const selectEvenlySpacedXTicks = createSelector([selectNetApyByTimeRange], (history): number[] => {
  return generateEvenlySpacedIntegers(history.length, 15)
})

/**
 * Memoized selector that selects evenly spaced y ticks based on the max net APY.
 * Y axis is built on the net APY values.
 *
 * @returns An array of evenly spaced x ticks.
 */
export const selectEvenlySpacedYTicks = createSelector([selectMaxNetApy], (maxNetApy): number[] => {
  return generateEvenlySpacedFloats(maxNetApy, 7)
})

/**
 * Selects the time range dates based on the given net APY time range and history.
 *
 * @param {TimeRange} timeRange - The net APY time range.
 * @param {History} history - The net APY history.
 * @returns {number[]} - The time range dates.
 */
export const selectTimeRangeDates = createSelector(
  [selectNetApyTimeRange, selectNetApyByTimeRange],
  (timeRange, history): number[] => {
    return getTimeRangeDates(timeRange, history)
  }
)

/**
 * Selects and returns the formatted time range dates.
 *
 * @returns An array of strings representing the formatted time range dates.
 */
export const selectFormattedTimeRangeDates = createSelector([selectTimeRangeDates], (timeRangeDates): string[] => {
  return formatTimestamps(timeRangeDates)
})
