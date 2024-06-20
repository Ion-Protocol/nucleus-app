import { NetApyItem } from '@/types/NetApyItem'

/**
 * Creates evenly spaced data points by timestamp from unevenly spaced data.
 *
 * This function processes an array of NetApyItem objects and generates a new array where the data points
 * are evenly spaced by the given interval. It calculates the average netApy for each interval. If no data
 * points are found for an interval, it uses the latest calculated value.
 *
 * @param data - Array of NetApyItem objects containing the original data points.
 * @param startTimestamp - The starting timestamp in Unix epoch milliseconds for filtering the final output.
 * @param endTimestamp - The ending timestamp in Unix epoch milliseconds.
 * @param interval - The interval in milliseconds to space the data points.
 * @returns A new array of NetApyItem objects with evenly spaced timestamps and averaged netApy values.
 */
export function createEvenlySpacedData(
  data: NetApyItem[],
  startTimestamp: number,
  endTimestamp: number,
  interval: number
): NetApyItem[] {
  // Return an empty array if there's no data
  if (data.length === 0) {
    return []
  }

  // Start at the earliest data point timestamp or the start timestamp, whichever is earlier
  const earliestDataTimestamp = Math.min(...data.map((item) => item.timeStamp))
  const initialTimestamp = earliestDataTimestamp > startTimestamp ? startTimestamp : earliestDataTimestamp

  const result: Record<number, number> = {}
  let latestValue =
    earliestDataTimestamp > startTimestamp ? 0 : data.find((item) => item.timeStamp === initialTimestamp)?.netApy || 0
  let currentTimestamp = initialTimestamp

  // Loop through the time range from the initial timestamp to the end timestamp
  while (currentTimestamp <= endTimestamp) {
    // Filter data points that fall within the current interval
    const intervalData = data.filter(
      (item) => item.timeStamp >= currentTimestamp && item.timeStamp < currentTimestamp + interval
    )

    let averageNetApy = latestValue

    // Calculate the average netApy for the current interval if data points are found
    if (intervalData.length > 0) {
      const totalNetApy = intervalData.reduce((sum, item) => sum + item.netApy, 0)
      averageNetApy = totalNetApy / intervalData.length
    }

    // Assign the average netApy to the result object with the current timestamp as the key
    result[currentTimestamp] = averageNetApy
    latestValue = averageNetApy // Update the latest value

    // Move to the next interval
    currentTimestamp += interval
  }

  // Transform the result object into an array of NetApyItem objects
  const evenlySpacedData = Object.keys(result).map((timestamp) => {
    const ts = parseInt(timestamp)
    return {
      lenderAddress: '',
      supplyAmount: [],
      netApy: result[ts],
      lenderApy: [],
      allocation: [],
      timeStamp: ts,
    }
  })

  // Filter the data to remove any points with a timestamp before the startTimestamp
  const filteredData = evenlySpacedData.filter((item) => item.timeStamp >= startTimestamp)
  return filteredData
}
