import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react'

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
      headers.set('Access-Control-Allow-Origin', '*')
      headers.set('Access-Control-Allow-Methods', 'GET')
      headers.set('Access-Control-Allow-Headers', 'Content-Type, Authorization')
      return headers
    },
  }),
  endpoints: (builder) => ({
    getTokenPrice: builder.query<number, string>({
      query: (tokenId) => ({
        url: 'price',
        params: {
          ids: tokenId,
          vs_currencies: 'usd',
        },
      }),
      transformResponse: (response: PriceResponse, _meta, tokenId) => {
        return response[tokenId]?.usd
      },
    }),
  }),
})

export const { useGetTokenPriceQuery } = coinGeckoApi
