import { RootState } from '@/store'
import { NetApyItem } from '@/types/NetApyItem'
import { TimeRange } from '@/types/TimeRange'
import { formatTimestamps } from '@/utils/date'
import { applyGaussianSmoothing } from '@/utils/math'
import { numToPercent } from '@/utils/number'
import { createSelector } from '@reduxjs/toolkit'
import { format, subMonths, subWeeks, subYears } from 'date-fns'
import { enUS } from 'date-fns/locale'
import { createEvenlySpacedData } from './helpers/createEvenlySpacedData'
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
 * Selects the NetApyData from the Redux state.
 *
 * @param state - The RootState object representing the Redux state.
 * @returns An array of NetApyItem objects representing the NetApyData.
 */
export function selectNetApyData(state: RootState): NetApyItem[] {
  return state.netApy.history
}

/**
 * Selects evenly spaced net APY data based on the specified time range.
 * @param {Array} history - The array of net APY data.
 * @param {TimeRange} timeRange - The time range for which to select the data.
 * @returns {Array} - The evenly spaced net APY data.
 * @throws {Error} - If an unsupported time range is provided.
 */
export const selectEvenlySpacedNetApyData = createSelector(
  [selectNetApyData, selectNetApyTimeRange],
  (history, timeRange) => {
    const WEEK_MS = 6.048e8
    const MONTH_MS = 2.628e9
    const YEAR_MS = 3.154e10

    const pointCount = 250

    let currentTime = new Date()

    // Round down currentTime to the nearest 5 minutes.
    let minutes = currentTime.getMinutes()
    minutes = minutes - (minutes % 5) // Adjust minutes to round down to the nearest 5 minutes
    currentTime.setMinutes(minutes, 0, 0) // Set adjusted minutes and round down seconds and milliseconds to 0

    let startTime: Date
    let interval = 0

    switch (timeRange) {
      case TimeRange.Week:
        startTime = subWeeks(currentTime, 1)
        interval = Math.round(WEEK_MS / pointCount)
        break
      case TimeRange.Month:
        startTime = subMonths(currentTime, 1)
        interval = Math.round(MONTH_MS / pointCount)
        break
      case TimeRange.Year:
        startTime = subYears(currentTime, 1)
        interval = Math.round(YEAR_MS / pointCount)
        break
      case TimeRange.All:
        startTime = new Date(history[0].timeStamp)
        interval = Math.round((currentTime.getTime() - startTime.getTime()) / pointCount)
        break
      default:
        throw new Error(`Unsupported time range: ${timeRange}`)
    }

    const evenlySpacedData = createEvenlySpacedData(history, startTime.getTime(), currentTime.getTime(), interval)
    return evenlySpacedData
  }
)

export const selectSmoothedNetApyData = createSelector([selectEvenlySpacedNetApyData], (history) => {
  return applyGaussianSmoothing(history, 10, 2, (item) => item.netApy)
})

/**
 * Selects the net APY data with formatting.
 *
 * @returns An array of net APY data objects with formatted values.
 */
export const selectNetApyDataWithFormatting = createSelector([selectSmoothedNetApyData], (history) => {
  const dateFormat = 'MMM d'
  return history.map((item) => {
    return {
      ...item,
      formattedNetApy: numToPercent(item.netApy * 100, { fractionDigits: 2 }),
      formattedTimestamp: format(new Date(item.timeStamp), dateFormat, { locale: enUS }),
    }
  })
})

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
 * Selects the latest net APY (Annual Percentage Yield) from the net APY history.
 *
 * @returns The latest net APY value.
 */
export const selectLatestNetApy = createSelector([selectNetApyData], (history): number => {
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
 * Selects the time range dates based on the given net APY time range and history.
 *
 * @param {TimeRange} timeRange - The net APY time range.
 * @param {History} history - The net APY history.
 * @returns {number[]} - The time range dates.
 */
export const selectTimeRangeDates = createSelector(
  [selectNetApyTimeRange, selectNetApyData],
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
