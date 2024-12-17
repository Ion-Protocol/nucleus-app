import { nucleusBackendBaseUrl } from '@/config/constants'
import { OrderStatus, PaginatedResponse } from '@/types/Order'
import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react'
import { Address } from 'viem'

interface RewardsAPYParams {
  tokenAddress: Address
  blockNumber?: number // Optional
  lookBackDays?: number // API defaults to 7 days if not provided
}

interface RewardsAPYResponse {
  apy: number
}

export type WithdrawalParams = {
  user: Address
  vaultAddress?: Address
  chainId?: number
  status?: OrderStatus | 'all'
  all?: boolean
  page?: number
  limit?: number
}

// Define a service using a base URL and expected endpoints
export const nucleusBackendApi = createApi({
  reducerPath: 'nucleusBackendApi',
  baseQuery: fetchBaseQuery({
    baseUrl: nucleusBackendBaseUrl,
    mode: 'cors',
    // prepareHeaders: (headers) => {
    //   headers.set('Access-Control-Allow-Origin', '*')
    //   headers.set('Access-Control-Allow-Methods', 'GET')
    //   headers.set('Access-Control-Allow-Headers', 'Content-Type, Authorization')
    //   return headers
    // },
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
    withdrawalOrdersByUser: builder.query<PaginatedResponse, WithdrawalParams>({
      query: ({ user, vaultAddress, chainId, status = 'all', all, page, limit }) => {
        const params = new URLSearchParams()
        params.append('user', user)
        if (vaultAddress) params.append('vault_address', vaultAddress)
        if (chainId) params.append('chain_id', chainId.toString())
        if (status) params.append('status', status)
        if (all) params.append('all', all.toString())
        if (page) params.append('page', page.toString())
        if (limit) params.append('limit', limit.toString())
        return `v1/protocol/withdrawals?${params.toString()}`
      },
    }),
  }),
})

export const { useGetDefaultYieldAPYQuery, useWithdrawalOrdersByUserQuery } = nucleusBackendApi
