import { nucleusBackendBaseUrl } from '@/config/constants'
import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react'
import { Address } from 'viem'

interface RewardsAPYParams {
  tokenAddress: Address
  blockNumber?: number // Optional
  lookBackDays?: number // API defaults to 7 days if not provided
}

interface BulkRewardsAPYParams {
  params: RewardsAPYParams[]
}

interface BulkRewardsAPYResponse {
  results: {
    tokenAddress: Address
    response: RewardsAPYResponse | null
    error?: string
  }[]
}

interface RewardsAPYResponse {
  apy: number
}

// Define a service using a base URL and expected endpoints
export const nucleusBackendApi = createApi({
  reducerPath: 'nucleusBackendApi',
  baseQuery: fetchBaseQuery({
    baseUrl: nucleusBackendBaseUrl,
    prepareHeaders: (headers) => {
      headers.set('Access-Control-Allow-Origin', '*')
      headers.set('Access-Control-Allow-Methods', 'GET')
      headers.set('Access-Control-Allow-Headers', 'Content-Type, Authorization')
      return headers
    },
  }),
  endpoints: (builder) => ({
    // Keep the original single query endpoint
    getDefaultYieldAPY: builder.query<RewardsAPYResponse, RewardsAPYParams>({
      query: ({ tokenAddress, blockNumber, lookBackDays = 14 }) => {
        const params = new URLSearchParams()
        params.append('token_address', tokenAddress)
        if (blockNumber) params.append('block_number', blockNumber.toString())
        if (lookBackDays) params.append('lookback_days', lookBackDays.toString())
        return `v1/vaults/apy?${params.toString()}`
      },
    }),
  }),
})

export const { useGetDefaultYieldAPYQuery } = nucleusBackendApi
