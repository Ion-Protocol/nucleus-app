import { NetApyItem } from '@/types/NetApyItem'
import { TimeRange } from '@/types/TimeRange'
import { addDays, addMonths, eachDayOfInterval, subDays, subMonths } from 'date-fns'

/**
 * Generates an array of timestamps representing specific dates within a specified time range.
 *
 * Depending on the given `timeRange` value, the function calculates the appropriate dates and returns them
 * as an array of Unix timestamps (milliseconds since January 1, 1970).
 *
 * If `timeRange` is `TimeRange.All` and the optional `data` parameter is provided, the function will calculate
 * the dates based on the range of timestamps present in the `data` array.
 *
 * @param timeRange - The specified time range for which to generate the dates. This can be one of the following:
 *                    - `TimeRange.Week`: Generates dates for the past week.
 *                    - `TimeRange.Month`: Generates dates at intervals over the past month.
 *                    - `TimeRange.Year`: Generates dates at intervals over the past year.
 *                    - `TimeRange.All`: Generates dates based on the range of the provided `data`.
 * @param data - Optional array of data items, each containing a `timeStamp` property. This is used only when
 *               `timeRange` is `TimeRange.All` to calculate the date range based on the timestamps in the data.
 * @returns An array of Unix timestamps representing the generated dates within the specified time range.
 */
export function getTimeRangeDates(timeRange: TimeRange, data?: NetApyItem[]): number[] {
  const today = new Date()

  switch (timeRange) {
    case TimeRange.Week: {
      const startDate = subDays(today, 7)
      const dates = eachDayOfInterval({ start: startDate, end: today })
      return dates.map((date) => date.getTime())
    }

    case TimeRange.Month: {
      const startDate = subDays(today, 29)
      const dates: Date[] = []
      for (let i = 0; i <= 30; i += 5) {
        dates.push(addDays(startDate, i))
      }
      return dates.map((date) => date.getTime())
    }

    case TimeRange.Year: {
      const startDate = subMonths(today, 11)
      const dates: Date[] = []
      for (let i = 0; i <= 5; i++) {
        dates.push(addMonths(startDate, i * 2))
      }
      return dates.map((date) => date.getTime())
    }

    case TimeRange.All: {
      if (!data || data.length === 0) {
        return []
      }
      const firstDate = new Date(data[0].timeStamp)
      const lastDate = new Date(data[data.length - 1].timeStamp)
      const interval = Math.floor((lastDate.getTime() - firstDate.getTime()) / 5)
      const dates = Array.from({ length: 6 }, (_, i) => new Date(firstDate.getTime() + i * interval))
      return dates.map((date) => date.getTime())
    }

    default:
      return []
  }
}
