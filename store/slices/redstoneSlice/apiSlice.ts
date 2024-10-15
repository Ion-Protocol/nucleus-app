import { redstoneBaseUrl } from '@/config/constants'
import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react'

export const redstoneApi = createApi({
  reducerPath: 'redstoneApi',
  baseQuery: fetchBaseQuery({ baseUrl: redstoneBaseUrl }),
  endpoints: (builder) => ({
    getExchangeRate: builder.query<number, string>({
      query: (token) => `prices?symbol=${token}`,
      transformResponse: (response: any) => response[0]?.value ?? null, // Extract the price value
    }),
  }),
})

export const {
  endpoints: { getExchangeRate },
  useGetExchangeRateQuery,
} = redstoneApi
