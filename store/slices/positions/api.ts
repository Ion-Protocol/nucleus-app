import { Position } from '@/types/Position'
import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react'

const baseQuery = fetchBaseQuery({
  baseUrl: process.env.NEXT_PUBLIC_BACKEND_ENDPOINT,
})

export const positionsApi = createApi({
  reducerPath: 'positionsApi',
  baseQuery,
  endpoints: (builder) => ({
    getPositions: builder.query<Position[], { address: string }>({
      query: ({ address }) => ({
        url: 'v1/bigbrother/positions',
        params: {
          address,
        },
      }),
      transformResponse: (response: any) => {
        if (!Array.isArray(response)) {
          return []
        }
        return response as Position[]
      },
      keepUnusedDataFor: 5 * 60, // Keep data in cache for 5 minutes (number is in seconds)
    }),
  }),
})

export const { useGetPositionsQuery } = positionsApi
