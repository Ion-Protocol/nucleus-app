import { NetApyItem } from '@/types/NetApyItem'
import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react'

const baseQuery = fetchBaseQuery({
  baseUrl: process.env.NEXT_PUBLIC_BACKEND_ENDPOINT,
})

export const netApyApi = createApi({
  reducerPath: 'netApyApi',
  baseQuery,
  tagTypes: ['NetApy'],
  endpoints: (builder) => ({
    getNetApy: builder.query<NetApyItem[], { address: string; startTime: number; endTime: number }>({
      query: ({ address, startTime, endTime }) => ({
        url: 'v1/bigbrother/net_apy',
        params: {
          address,
          start_time: Math.floor(startTime / 1000),
          end_time: Math.floor(endTime / 1000),
        },
      }),
      transformResponse: (response: any) => {
        if (!Array.isArray(response)) {
          return []
        }
        return response
          .map((data: any) => ({
            lenderAddress: data.lender_address,
            supplyAmount: data.supply_amount,
            netApy: data.net_apy,
            lenderApy: data.lender_apy,
            allocation: data.allocation,
            timeStamp: data.time_stamp * 1000,
          }))
          .sort((a, b) => a.timeStamp - b.timeStamp)
      },
      keepUnusedDataFor: 5 * 60, // Keep data in cache for 5 minutes (number is in seconds)
    }),
  }),
})

export const { useGetNetApyQuery } = netApyApi
