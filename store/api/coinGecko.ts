import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react'
import { Address } from 'viem'

// Add this interface for the response type
interface PriceResponse {
  [key: string]: {
    usd: number
  }
}

export const coinGeckoApi = createApi({
  reducerPath: 'coinGeckoApi',
  baseQuery: fetchBaseQuery({
    baseUrl: 'https://pro-api.coingecko.com/api/v3/simple/',
    prepareHeaders: (headers) => {
      headers.set('x-cg-pro-api-key', process.env.NEXT_PUBLIC_COINGECKO_API_KEY ?? '')
      return headers
    },
  }),
  endpoints: (builder) => ({
    getTokenPrice: builder.query<PriceResponse, string>({
      query: (tokenId) => ({
        url: 'price',
        params: {
          ids: tokenId,
          vs_currencies: 'usd',
        },
      }),
    }),
  }),
})

export const { useGetTokenPriceQuery } = coinGeckoApi
