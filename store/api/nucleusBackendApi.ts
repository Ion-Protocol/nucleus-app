import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react'
import { nucleusBackendBaseUrl } from '@/config/constants'
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
  baseQuery: fetchBaseQuery({ baseUrl: nucleusBackendBaseUrl }),
  endpoints: (builder) => ({
    // Keep the original single query endpoint
    getRewardsAPY: builder.query<RewardsAPYResponse, RewardsAPYParams>({
      query: ({ tokenAddress, blockNumber, lookBackDays }) => {
        const params = new URLSearchParams()
        params.append('token_address', tokenAddress)
        if (blockNumber) params.append('block_number', blockNumber.toString())
        if (lookBackDays) params.append('look_back_days', lookBackDays.toString())
        return `v1/vaults/apy?${params.toString()}`
      },
    }),

    // Bulk query endpoint
    getBulkRewardsAPY: builder.query<BulkRewardsAPYResponse, BulkRewardsAPYParams>({
      async queryFn({ params }, _queryApi, _extraOptions, fetchWithBQ) {
        try {
          // Use Promise.all vs Promise.allSettled to fetch all APYs in parallel
          const results = await Promise.all(
            params.map(async (param) => {
              try {
                const queryParams = new URLSearchParams()
                queryParams.append('token_address', param.tokenAddress)
                if (param.blockNumber) {
                  queryParams.append('block_number', param.blockNumber.toString())
                }
                if (param.lookBackDays) {
                  queryParams.append('look_back_days', param.lookBackDays.toString())
                }

                const result = await fetchWithBQ(`v1/vaults/apy?${queryParams.toString()}`)

                if (result.error) {
                  return {
                    tokenAddress: param.tokenAddress,
                    response: null,
                    error: 'Failed to fetch APY',
                  }
                }

                return {
                  tokenAddress: param.tokenAddress,
                  response: result.data as RewardsAPYResponse,
                }
              } catch (error) {
                return {
                  tokenAddress: param.tokenAddress,
                  response: null,
                  error: error instanceof Error ? error.message : 'Unknown error',
                }
              }
            })
          )

          return { data: { results } }
        } catch (error) {
          return {
            error: {
              status: 500,
              data: error instanceof Error ? error.message : 'Failed to fetch APYs',
            },
          }
        }
      },
    }),
  }),
})

export const { useGetRewardsAPYQuery } = nucleusBackendApi
