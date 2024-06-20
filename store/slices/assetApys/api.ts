import { AssetApys } from '@/types/AssetApys'
import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react'

const baseQuery = fetchBaseQuery({
  baseUrl: process.env.NEXT_PUBLIC_BACKEND_ENDPOINT,
})

export const assetApysApi = createApi({
  reducerPath: 'assetApysApi',
  baseQuery,
  endpoints: (builder) => ({
    getAssetApys: builder.query<AssetApys, {}>({
      query: () => ({
        url: 'v1/bigbrother/apy',
      }),
      transformResponse: (response: any) => {
        return response as AssetApys
      },
      keepUnusedDataFor: 5 * 60, // Keep data in cache for 5 minutes (number is in seconds)
    }),
  }),
})

export const { useGetAssetApysQuery } = assetApysApi
