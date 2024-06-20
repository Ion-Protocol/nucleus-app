import { Position } from '@/types/Position' // Ensure this path is correct
import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react'

const baseQuery = fetchBaseQuery({
  baseUrl: process.env.NEXT_PUBLIC_BACKEND_ENDPOINT,
})

export const positionsApi = createApi({
  reducerPath: 'positionsApi',
  baseQuery,
  tagTypes: ['Position'],
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
        return response.map((data: any) => ({
          marketId: data.market_id,
          totalDebt: data.total_debt,
          totalCollateral: data.total_collateral,
          totalSupplied: data.total_supplied,
          protocolExchangeRate: data.protocol_exchange_rate,
          supplyAssetExchangeRate: data.supply_asset_exchange_rate,
        }))
      },
      keepUnusedDataFor: 5 * 60, // Keep data in cache for 5 minutes (number is in seconds)
    }),
  }),
})

export const { useGetPositionsQuery } = positionsApi
