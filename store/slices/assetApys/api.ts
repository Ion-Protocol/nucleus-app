import { TokenKey } from '@/config/token'
import { AssetApys } from '@/types/AssetApy'
import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react'

const baseQuery = fetchBaseQuery({
  baseUrl: process.env.NEXT_PUBLIC_BACKEND_ENDPOINT,
})

export const assetApysApi = createApi({
  reducerPath: 'assetApysApi',
  baseQuery,
  endpoints: (builder) => ({
    getAssetApys: builder.query<AssetApys, { chainId: number }>({
      query: ({ chainId }) => ({
        url: 'v2/bigbrother/apy',
        params: {
          chain_id: chainId,
        },
      }),
      transformResponse: (response: any) => {
        return {
          [TokenKey.EZETH]: response[TokenKey.EZETH],
          [TokenKey.RSETH]: response[TokenKey.RSETH],
          [TokenKey.RSWETH]: response[TokenKey.RSWETH],
          [TokenKey.WEETH]: response[TokenKey.WEETH],
          [TokenKey.WSTETH]: response[TokenKey.WSTETH],
        }
      },
      keepUnusedDataFor: 5 * 60, // Keep data in cache for 5 minutes (number is in seconds)
    }),
  }),
})

export const { useGetAssetApysQuery } = assetApysApi
