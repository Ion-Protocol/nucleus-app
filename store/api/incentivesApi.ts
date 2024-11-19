import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react'
import { nucleusApiBaseUrl } from '@/config/constants'
import { Address } from 'viem'

interface IncentivesAPYParams {
  vaultAddress: Address
}

export interface TokenIncentive {
  token_address: Address
  token_amount: number
}

// Main response interface
export interface IncentivesResponse {
  // ISO 8601 date strings
  startDate: string
  endDate: string

  // Token prices mapping
  prices: {
    [key: Address]: number
  }

  // Array of token incentives
  tokenIncentives: TokenIncentive[]

  // APY per token mapping
  APYPerToken: {
    [key: Address]: number
  }

  // Overall APY and TVL
  APY: number
  TVL: number
}

// Define a service using a base URL and expected endpoints
export const nucleusIncentivesApi = createApi({
  reducerPath: 'nucleusIncentivesApi',
  tagTypes: ['Vault'],
  refetchOnMountOrArgChange: true,
  baseQuery: fetchBaseQuery({ baseUrl: nucleusApiBaseUrl }),
  endpoints: (builder) => ({
    // Keep the original single query endpoint
    getRewardsAPY: builder.query<IncentivesResponse, IncentivesAPYParams>({
      query: ({ vaultAddress }) => {
        const params = new URLSearchParams()
        params.append('vaultAddress', vaultAddress)
        return `/prod-d2c/apyReward?${params.toString()}`
      },
    }),
  }),
})

export const { useGetRewardsAPYQuery } = nucleusIncentivesApi
