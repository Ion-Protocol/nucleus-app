import { NetApyItem } from '@/types/NetApyItem'
import { API_METHOD, callApi } from '../utils/callApi'

const ENDPOINT = 'v1/bigbrother/net_apy'

/**
 * Fetches the historical net APY data for a given address within a specified time range.
 *
 * @param args - Object containing the address, start time, and end time.
 * @param args.address - The address to fetch net APY for.
 * @param args.startTime - The start time in milliseconds since the epoch.
 * @param args.endTime - The end time in milliseconds since the epoch.
 * @returns A promise that resolves to an array of NetApyItem objects.
 * @throws An error if the API call fails or the response is invalid.
 */
export async function getNetApy(args: {
  address: `0x${string}`
  startTime: number
  endTime: number
}): Promise<NetApyItem[]> {
  const { address, startTime, endTime } = args
  const params = {
    address: address,
    start_time: Math.floor(startTime / 1000), // Convert milliseconds to seconds
    end_time: Math.floor(endTime / 1000), // Convert milliseconds to seconds
  }

  try {
    const response = await callApi(ENDPOINT, API_METHOD.GET, params)
    if (!response.ok) {
      const errorData = await response.json()
      const error = new Error(errorData.message || 'Something went wrong')
      ;(error as any).statusCode = response.status
      throw error
    }

    const dataApi = await response.json()

    // The backend may respond with a string if there is no data. Need to handle this case.
    if (!Array.isArray(dataApi)) {
      return []
    }

    // Transform the API response to match NetApyItem type
    const lenderBalanceData: NetApyItem[] = dataApi.map((data: any) => ({
      lenderAddress: data.lender_address,
      supplyAmount: data.supply_amount,
      netApy: data.net_apy,
      lenderApy: data.lender_apy,
      allocation: data.allocation,
      timeStamp: data.time_stamp * 1000, // Convert seconds to milliseconds
    }))

    // Sort the data by timestamp
    return lenderBalanceData.sort((a, b) => a.timeStamp - b.timeStamp)
  } catch (error) {
    console.error('Error fetching net APY data:', error, { endpoint: ENDPOINT, params })
    throw error
  }
}
